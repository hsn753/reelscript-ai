require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ApifyClient } = require('apify-client');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const apifyClient = new ApifyClient({ token: process.env.APIFY_API_TOKEN });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// POST /analyze — scrape reels and analyze style
app.post('/analyze', async (req, res) => {
  const { username, maxReels = 30 } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'username is required' });
  }

  try {
    console.log(`[analyze] Scraping reels for @${username}, max: ${maxReels}`);

    const run = await apifyClient.actor('apify/instagram-reel-scraper').call({
      username: [username],
      resultsLimit: parseInt(maxReels),
    });

    const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();

    if (!items || items.length === 0) {
      return res.status(404).json({ error: 'No reels found for this account. Make sure it is public.' });
    }

    console.log(`[analyze] Found ${items.length} reels. Building context...`);

    // Extract transcripts + captions
    const reelData = items.map((reel, i) => ({
      index: i + 1,
      caption: reel.caption || '',
      transcript: reel.transcript || '',
      likes: reel.likesCount || 0,
      views: reel.videoViewCount || 0,
      duration: reel.videoDuration || 0,
      url: reel.url || '',
      timestamp: reel.timestamp || '',
    }));

    const hasTranscripts = reelData.some((r) => r.transcript && r.transcript.length > 10);

    // Build the context string for GPT
    const reelContext = reelData
      .map(
        (r) =>
          `--- Reel #${r.index} (${r.likes} likes, ${r.views} views) ---\nCaption: ${r.caption}\nTranscript: ${r.transcript || '(no transcript)'}`
      )
      .join('\n\n');

    const systemPrompt = `You are an expert content strategist and script analyst. You will analyze Instagram Reels from a specific creator and extract their unique style fingerprint.`;

    const userPrompt = `Analyze the following ${reelData.length} Instagram Reels from @${username}.

${reelContext}

Based on these reels, provide a detailed style analysis in the following JSON format:
{
  "creatorHandle": "${username}",
  "totalReelsAnalyzed": ${reelData.length},
  "hasTranscripts": ${hasTranscripts},
  "styleProfile": {
    "tone": "describe the overall tone (e.g. casual, educational, motivational, humorous)",
    "pacing": "describe the pacing style",
    "vocabulary": "describe word choice and vocabulary level",
    "personality": "describe personality traits that come through"
  },
  "hookPatterns": ["list 3-5 common hook/opening patterns they use"],
  "contentThemes": ["list 4-6 recurring themes or topics"],
  "ctaPatterns": ["list 2-4 common call-to-action patterns"],
  "scriptStructure": "describe their typical reel structure (e.g. hook → problem → solution → CTA)",
  "uniqueQuirks": ["list 2-4 unique phrases, mannerisms, or stylistic quirks"],
  "topPerformingInsights": "what patterns appear in their highest-performing reels",
  "summary": "2-3 sentence summary of this creator's overall style that a script writer should know"
}

Return only valid JSON, no markdown.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4,
      response_format: { type: 'json_object' },
    });

    const analysis = JSON.parse(completion.choices[0].message.content);

    return res.json({
      success: true,
      reelsScraped: reelData.length,
      analysis,
      reels: reelData.slice(0, 10), // return first 10 reels for display
    });
  } catch (err) {
    console.error('[analyze] Error:', err.message);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// POST /generate — generate a new script based on style profile
app.post('/generate', async (req, res) => {
  const { username, styleAnalysis, topic, scriptType = 'reel', additionalInstructions = '' } = req.body;

  if (!styleAnalysis || !topic) {
    return res.status(400).json({ error: 'styleAnalysis and topic are required' });
  }

  try {
    console.log(`[generate] Generating script for @${username} on topic: ${topic}`);

    const systemPrompt = `You are an expert Instagram Reel script writer. You specialize in writing scripts that perfectly match a specific creator's voice, tone, and style.`;

    const userPrompt = `Write an Instagram Reel script for @${username} about: "${topic}"

Here is their style profile:
${JSON.stringify(styleAnalysis, null, 2)}

Script requirements:
- Type: ${scriptType}
- Match their tone: ${styleAnalysis.styleProfile?.tone || 'natural'}
- Use their typical structure: ${styleAnalysis.scriptStructure || 'hook → content → CTA'}
- Incorporate their hook patterns: ${(styleAnalysis.hookPatterns || []).join(', ')}
- Include a natural CTA in their style: ${(styleAnalysis.ctaPatterns || []).join(', ')}
- Mirror their vocabulary and personality
${additionalInstructions ? `- Additional instructions: ${additionalInstructions}` : ''}

Return a JSON object in this format:
{
  "title": "brief title for this script",
  "estimatedDuration": "estimated duration in seconds",
  "hook": "the opening hook line(s)",
  "body": "the main content of the script with natural line breaks",
  "cta": "the call to action",
  "fullScript": "the complete script formatted for a teleprompter, with natural pauses marked as [pause] and emphasis marked as [emphasis]",
  "productionNotes": "brief notes on delivery style, pacing, and any visual suggestions"
}

Return only valid JSON, no markdown.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const script = JSON.parse(completion.choices[0].message.content);

    return res.json({ success: true, script });
  } catch (err) {
    console.error('[generate] Error:', err.message);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
