import { useState } from 'react'
import axios from 'axios'
import {
  Film,
  Sparkles,
  FileText,
  TrendingUp,
  Hash,
  Mic,
  ChevronRight,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  RefreshCw,
  Eye,
  Heart,
  Clock,
} from 'lucide-react'

const API_BASE = '/api'

function Badge({ children, color = 'purple' }) {
  const colors = {
    purple: 'bg-purple-500/15 text-purple-300 border border-purple-500/25',
    pink: 'bg-pink-500/15 text-pink-300 border border-pink-500/25',
    blue: 'bg-blue-500/15 text-blue-300 border border-blue-500/25',
    green: 'bg-green-500/15 text-green-300 border border-green-500/25',
    amber: 'bg-amber-500/15 text-amber-300 border border-amber-500/25',
  }
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  )
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm text-slate-300 transition-colors"
    >
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function StyleProfilePanel({ analysis }) {
  const { styleProfile, hookPatterns, contentThemes, ctaPatterns, uniqueQuirks, scriptStructure, topPerformingInsights, summary } = analysis

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-sm text-slate-400 leading-relaxed">{summary}</p>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Style Profile</h4>
          <div className="space-y-2">
            {Object.entries(styleProfile || {}).map(([k, v]) => (
              <div key={k}>
                <span className="text-xs text-slate-500 capitalize">{k}: </span>
                <span className="text-sm text-slate-300">{v}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Script Structure</h4>
          <p className="text-sm text-slate-300">{scriptStructure}</p>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4 mb-3">Top Performer Insights</h4>
          <p className="text-sm text-slate-300">{topPerformingInsights}</p>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Mic size={14} className="text-purple-400" />
            <h4 className="text-xs font-semibold text-slate-400">Hook Patterns</h4>
          </div>
          <div className="space-y-2">
            {(hookPatterns || []).map((h, i) => (
              <div key={i} className="flex gap-2 text-sm text-slate-300">
                <span className="text-purple-500 shrink-0">→</span>
                <span>{h}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Hash size={14} className="text-pink-400" />
            <h4 className="text-xs font-semibold text-slate-400">Content Themes</h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(contentThemes || []).map((t, i) => (
              <Badge key={i} color="pink">{t}</Badge>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-green-400" />
            <h4 className="text-xs font-semibold text-slate-400">CTA Patterns</h4>
          </div>
          <div className="space-y-2">
            {(ctaPatterns || []).map((c, i) => (
              <div key={i} className="text-sm text-slate-300 flex gap-2">
                <span className="text-green-500 shrink-0">→</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {uniqueQuirks && uniqueQuirks.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-amber-400" />
            <h4 className="text-xs font-semibold text-slate-400">Unique Quirks & Phrases</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {uniqueQuirks.map((q, i) => (
              <Badge key={i} color="amber">{q}</Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

function ScriptPanel({ script }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">{script.title}</h3>
          <span className="text-sm text-slate-500 flex items-center gap-1 mt-1">
            <Clock size={12} />
            ~{script.estimatedDuration}
          </span>
        </div>
        <CopyButton text={script.fullScript} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">Hook</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{script.hook}</p>
        </Card>
        <Card>
          <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Body</h4>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{script.body}</p>
        </Card>
        <Card>
          <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">CTA</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{script.cta}</p>
        </Card>
      </div>

      <Card className="bg-black/30">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <FileText size={12} />
            Full Script (Teleprompter)
          </h4>
          <CopyButton text={script.fullScript} />
        </div>
        <pre className="text-sm text-slate-200 leading-loose whitespace-pre-wrap font-sans">{script.fullScript}</pre>
      </Card>

      {script.productionNotes && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Production Notes</h4>
          <p className="text-sm text-slate-300">{script.productionNotes}</p>
        </Card>
      )}
    </div>
  )
}

export default function App() {
  const [username, setUsername] = useState('')
  const [maxReels, setMaxReels] = useState(30)
  const [analyzeLoading, setAnalyzeLoading] = useState(false)
  const [analyzeError, setAnalyzeError] = useState('')
  const [analysisResult, setAnalysisResult] = useState(null)

  const [topic, setTopic] = useState('')
  const [additionalInstructions, setAdditionalInstructions] = useState('')
  const [generateLoading, setGenerateLoading] = useState(false)
  const [generateError, setGenerateError] = useState('')
  const [script, setScript] = useState(null)

  const [activeTab, setActiveTab] = useState('analyze')

  const handleAnalyze = async () => {
    if (!username.trim()) return
    setAnalyzeLoading(true)
    setAnalyzeError('')
    setAnalysisResult(null)
    setScript(null)
    try {
      const res = await axios.post(`${API_BASE}/analyze`, {
        username: username.trim().replace('@', ''),
        maxReels,
      })
      setAnalysisResult(res.data)
      setActiveTab('style')
    } catch (err) {
      setAnalyzeError(err.response?.data?.error || 'Failed to analyze account. Make sure it is public.')
    } finally {
      setAnalyzeLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!topic.trim() || !analysisResult) return
    setGenerateLoading(true)
    setGenerateError('')
    setScript(null)
    try {
      const res = await axios.post(`${API_BASE}/generate`, {
        username: analysisResult.analysis.creatorHandle,
        styleAnalysis: analysisResult.analysis,
        topic: topic.trim(),
        additionalInstructions,
      })
      setScript(res.data.script)
      setActiveTab('script')
    } catch (err) {
      setGenerateError(err.response?.data?.error || 'Failed to generate script.')
    } finally {
      setGenerateLoading(false)
    }
  }

  const tabs = [
    { id: 'analyze', label: 'Analyze', icon: Film, disabled: false },
    { id: 'style', label: 'Style Profile', icon: TrendingUp, disabled: !analysisResult },
    { id: 'generate', label: 'Generate Script', icon: Sparkles, disabled: !analysisResult },
    { id: 'script', label: 'Script', icon: FileText, disabled: !script },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Film size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-white leading-none">ReelScript AI</h1>
              <p className="text-xs text-slate-500 mt-0.5">Script writer trained on any creator</p>
            </div>
          </div>
          {analysisResult && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                @
              </div>
              <span className="text-sm text-slate-300">@{analysisResult.analysis.creatorHandle}</span>
              <Badge color="green">{analysisResult.reelsScraped} reels analyzed</Badge>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white/5 rounded-xl p-1 w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white shadow'
                    : tab.disabled
                    ? 'text-slate-600 cursor-not-allowed'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Analyze Tab */}
        {activeTab === 'analyze' && (
          <div className="max-w-xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Analyze a Creator</h2>
              <p className="text-slate-400">Enter a public Instagram username to scrape their reels and extract their unique content style.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Instagram Username</label>
                <div className="flex">
                  <span className="flex items-center px-3 bg-white/5 border border-r-0 border-white/10 rounded-l-xl text-slate-400 text-sm">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                    placeholder="username"
                    className="flex-1 bg-white/5 border border-white/10 rounded-r-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Number of Reels to Analyze <span className="text-purple-400 font-semibold">{maxReels}</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={maxReels}
                  onChange={(e) => setMaxReels(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>5 (faster)</span>
                  <span>100 (more accurate)</span>
                </div>
              </div>

              {analyzeError && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{analyzeError}</p>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={analyzeLoading || !username.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all"
              >
                {analyzeLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Scraping & Analyzing... (this takes ~1-2 min)
                  </>
                ) : (
                  <>
                    <Film size={18} />
                    Analyze Reels
                    <ChevronRight size={16} />
                  </>
                )}
              </button>

              <p className="text-xs text-slate-600 text-center">
                Only works with public Instagram accounts. Uses Apify + GPT-4o.
              </p>
            </div>
          </div>
        )}

        {/* Style Profile Tab */}
        {activeTab === 'style' && analysisResult && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Style Profile</h2>
                <p className="text-slate-400">AI-extracted style fingerprint from @{analysisResult.analysis.creatorHandle}</p>
              </div>
              <button
                onClick={() => setActiveTab('generate')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-white font-medium text-sm transition-all"
              >
                <Sparkles size={14} />
                Generate Script
              </button>
            </div>
            <StyleProfilePanel analysis={analysisResult.analysis} />

            {analysisResult.reels && analysisResult.reels.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Eye size={14} />
                  Sample Reels Scraped
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {analysisResult.reels.slice(0, 4).map((reel, i) => (
                    <Card key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Heart size={10} /> {(reel.likes || 0).toLocaleString()}</span>
                          <span className="flex items-center gap-1"><Eye size={10} /> {(reel.views || 0).toLocaleString()}</span>
                        </div>
                        {reel.url && (
                          <a href={reel.url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 hover:text-purple-300">View →</a>
                        )}
                      </div>
                      {reel.transcript && (
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                          "{reel.transcript.substring(0, 200)}{reel.transcript.length > 200 ? '...' : ''}"
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Generate Tab */}
        {activeTab === 'generate' && analysisResult && (
          <div className="max-w-2xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Generate a Script</h2>
              <p className="text-slate-400">Write a new reel script in @{analysisResult.analysis.creatorHandle}'s style.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">What is this reel about?</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Why most people fail at building a morning routine"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Additional Instructions <span className="text-slate-600">(optional)</span></label>
                <textarea
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  placeholder="e.g. Make it under 60 seconds, include a personal story, target entrepreneurs..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                />
              </div>

              {generateError && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{generateError}</p>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={generateLoading || !topic.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all"
              >
                {generateLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Writing Script...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate Script
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Script Tab */}
        {activeTab === 'script' && script && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Generated Script</h2>
                <p className="text-slate-400">Ready to record in @{analysisResult.analysis.creatorHandle}'s style</p>
              </div>
              <button
                onClick={() => { setActiveTab('generate'); setScript(null) }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-slate-300 font-medium text-sm transition-all"
              >
                <RefreshCw size={14} />
                Generate Another
              </button>
            </div>
            <ScriptPanel script={script} />
          </div>
        )}
      </div>
    </div>
  )
}
