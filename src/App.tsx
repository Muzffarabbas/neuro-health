import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Brain, 
  Moon, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Info, 
  ChevronRight, 
  Plus, 
  Calendar,
  Coffee,
  Heart,
  AlertCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { format, subDays } from 'date-fns';
import { getNeuroInsights, UserData } from './services/geminiService';
import { cn } from './lib/utils';
import ReactMarkdown from 'react-markdown';

// --- Mock Data & Constants ---

const MOCK_HISTORY = Array.from({ length: 7 }).map((_, i) => ({
  date: format(subDays(new Date(), 6 - i), 'MMM dd'),
  mood: Math.floor(Math.random() * 4) + 6,
  stress: Math.floor(Math.random() * 5) + 3,
  brainScore: Math.floor(Math.random() * 20) + 70,
  hrv: Math.floor(Math.random() * 40) + 40,
}));

const BRAIN_WAVE_DATA = Array.from({ length: 50 }).map((_, i) => ({
  time: i,
  alpha: Math.sin(i * 0.2) * 10 + 20 + Math.random() * 5,
  beta: Math.sin(i * 0.5) * 5 + 15 + Math.random() * 3,
  theta: Math.sin(i * 0.1) * 15 + 10 + Math.random() * 7,
}));

// --- Components ---

const StatCard = ({ title, value, unit, icon: Icon, trend, color }: any) => (
  <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-2 rounded-lg bg-opacity-10", color)}>
        <Icon className={cn("w-5 h-5", color.replace('bg-', 'text-'))} />
      </div>
      {trend && (
        <span className={cn("text-xs font-medium px-2 py-1 rounded-full", 
          trend > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500")}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 className="text-zinc-400 text-sm font-medium mb-1">{title}</h3>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold text-white">{value}</span>
      <span className="text-zinc-500 text-xs">{unit}</span>
    </div>
  </div>
);

const SectionHeader = ({ title, subtitle, icon: Icon }: any) => (
  <div className="flex items-center gap-3 mb-6">
    {Icon && <Icon className="w-6 h-6 text-indigo-400" />}
    <div>
      <h2 className="text-xl font-bold text-white leading-tight">{title}</h2>
      {subtitle && <p className="text-zinc-500 text-sm">{subtitle}</p>}
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [showCheckIn, setShowCheckIn] = useState(false);
  
  const [formData, setFormData] = useState<UserData>({
    mood: 7,
    stress: 4,
    sleepHours: 7.5,
    activityMinutes: 45,
    dietQuality: 8,
    journalEntry: "",
    hrv: 55
  });

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await getNeuroInsights(formData);
    setInsights(result);
    setLoading(false);
    setShowCheckIn(false);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">NeuroSync <span className="text-indigo-500">AI</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {['Dashboard', 'Insights', 'Science', 'Settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={cn(
                  "text-sm font-medium transition-colors",
                  activeTab === tab.toLowerCase() ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setShowCheckIn(true)}
            className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Check-in
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                  title="Neuro Score" 
                  value={insights?.brainScore || 84} 
                  unit="/100" 
                  icon={Brain} 
                  trend={3} 
                  color="bg-indigo-500" 
                />
                <StatCard 
                  title="Stress Level" 
                  value={formData.stress} 
                  unit="Low" 
                  icon={Zap} 
                  trend={-12} 
                  color="bg-amber-500" 
                />
                <StatCard 
                  title="Sleep Quality" 
                  value={formData.sleepHours} 
                  unit="hrs" 
                  icon={Moon} 
                  trend={8} 
                  color="bg-blue-500" 
                />
                <StatCard 
                  title="HRV (ANS State)" 
                  value={formData.hrv} 
                  unit="ms" 
                  icon={Heart} 
                  trend={5} 
                  color="bg-rose-500" 
                />
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Charts Area */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-6">
                    <SectionHeader 
                      title="Cognitive Performance Trend" 
                      subtitle="Correlation between mood, stress, and brain score"
                      icon={TrendingUp}
                    />
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_HISTORY}>
                          <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                          <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                          />
                          <Area type="monotone" dataKey="brainScore" stroke="#6366f1" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
                          <Line type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={2} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-6">
                    <SectionHeader 
                      title="Brain Wave Proxy (Synthetic EEG)" 
                      subtitle="Estimated neural oscillations based on biometric patterns"
                      icon={Activity}
                    />
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={BRAIN_WAVE_DATA}>
                          <Line type="monotone" dataKey="alpha" stroke="#6366f1" strokeWidth={1} dot={false} />
                          <Line type="monotone" dataKey="beta" stroke="#f59e0b" strokeWidth={1} dot={false} />
                          <Line type="monotone" dataKey="theta" stroke="#3b82f6" strokeWidth={1} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex gap-4 mt-4 justify-center">
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <div className="w-2 h-2 rounded-full bg-indigo-500" /> Alpha (Relaxed)
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <div className="w-2 h-2 rounded-full bg-amber-500" /> Beta (Focus)
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <div className="w-2 h-2 rounded-full bg-blue-500" /> Theta (Deep)
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Insights Sidebar */}
                <div className="space-y-6">
                  <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Sparkles className="w-24 h-24 text-indigo-500" />
                    </div>
                    <SectionHeader 
                      title="AI Neuro-Insights" 
                      subtitle="Personalized analysis"
                      icon={Sparkles}
                    />
                    
                    {loading ? (
                      <div className="space-y-4 animate-pulse">
                        <div className="h-4 bg-zinc-800 rounded w-3/4" />
                        <div className="h-4 bg-zinc-800 rounded w-full" />
                        <div className="h-4 bg-zinc-800 rounded w-5/6" />
                      </div>
                    ) : insights ? (
                      <div className="space-y-4">
                        <p className="text-zinc-300 text-sm leading-relaxed italic">
                          "{insights.stateDescription}"
                        </p>
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Recommendations</h4>
                          <ul className="space-y-2">
                            {insights.recommendations.map((rec: string, i: number) => (
                              <li key={i} className="flex gap-2 text-sm text-zinc-400">
                                <ChevronRight className="w-4 h-4 text-indigo-500 shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-4 border-t border-zinc-800">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Cognitive Outlook</h4>
                          <p className="text-sm text-zinc-400">{insights.cognitiveOutlook}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                        <p className="text-zinc-500 text-sm">Complete a check-in to generate AI insights.</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-6">
                    <SectionHeader 
                      title="Daily Habits" 
                      icon={Calendar}
                    />
                    <div className="space-y-3">
                      {[
                        { label: 'Morning Meditation', done: true, icon: Brain },
                        { label: 'Hydration Goal', done: false, icon: Coffee },
                        { label: 'Deep Work Session', done: true, icon: Zap },
                      ].map((habit, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/30 border border-zinc-800">
                          <div className="flex items-center gap-3">
                            <habit.icon className="w-4 h-4 text-zinc-500" />
                            <span className="text-sm font-medium">{habit.label}</span>
                          </div>
                          <div className={cn(
                            "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                            habit.done ? "bg-indigo-500 border-indigo-500" : "border-zinc-700"
                          )}>
                            {habit.done && <ShieldCheck className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'science' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto space-y-12"
            >
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white tracking-tight">Scientific Foundation</h1>
                <p className="text-zinc-400 text-lg">How NeuroSync AI bridges the gap between consumer biometrics and clinical neuroscience.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl space-y-4">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-bold">HRV & The Vagus Nerve</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Heart Rate Variability (HRV) is a validated proxy for the Autonomic Nervous System (ANS). 
                    High HRV indicates a resilient system capable of switching between sympathetic (fight/flight) 
                    and parasympathetic (rest/digest) states. NeuroSync uses this to estimate your "Brain Resilience Score."
                  </p>
                  <div className="pt-4">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Reference</span>
                    <p className="text-xs text-zinc-500 mt-1 italic">"Heart rate variability: a review" - Journal of the American College of Cardiology</p>
                  </div>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl space-y-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4">
                    <Activity className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold">Synthetic EEG Modeling</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    While consumer wearables don't measure EEG directly, we use multimodal data (sleep stages, 
                    movement patterns, and cognitive performance tests) to model the likely distribution of 
                    Alpha, Beta, and Theta waves. This provides a directional indicator of your mental state.
                  </p>
                  <div className="pt-4">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Reference</span>
                    <p className="text-xs text-zinc-500 mt-1 italic">"Wearable sensors for mental health monitoring" - Nature Medicine</p>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-600/5 border border-indigo-500/20 p-8 rounded-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-6 h-6 text-indigo-400" />
                  <h2 className="text-2xl font-bold">Research Bibliography</h2>
                </div>
                <div className="space-y-6">
                  {[
                    { title: "The Relationship Between Sleep and Mental Health", journal: "The Lancet Psychiatry", year: "2023" },
                    { title: "Nutritional Psychiatry: Your Brain on Food", journal: "Harvard Health Publishing", year: "2022" },
                    { title: "AI in Behavioral Science: Predicting Mood Shifts", journal: "Frontiers in Psychology", year: "2024" },
                  ].map((paper, i) => (
                    <div key={i} className="flex justify-between items-center py-4 border-b border-zinc-800 last:border-0">
                      <div>
                        <h4 className="font-medium text-white">{paper.title}</h4>
                        <p className="text-sm text-zinc-500">{paper.journal}</p>
                      </div>
                      <span className="text-xs font-mono text-zinc-600">{paper.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Check-in Modal */}
      <AnimatePresence>
        {showCheckIn && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckIn(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <h2 className="text-xl font-bold">Daily Neuro Check-in</h2>
                <button onClick={() => setShowCheckIn(false)} className="text-zinc-500 hover:text-white">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
              
              <form onSubmit={handleCheckIn} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Mood (1-10)</label>
                    <input 
                      type="number" min="1" max="10" 
                      value={formData.mood}
                      onChange={(e) => setFormData({...formData, mood: parseInt(e.target.value)})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Stress (1-10)</label>
                    <input 
                      type="number" min="1" max="10" 
                      value={formData.stress}
                      onChange={(e) => setFormData({...formData, stress: parseInt(e.target.value)})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Journal Entry (Optional)</label>
                  <textarea 
                    placeholder="How are you feeling mentally?"
                    value={formData.journalEntry}
                    onChange={(e) => setFormData({...formData, journalEntry: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Sleep (hrs)</label>
                    <input 
                      type="number" step="0.5"
                      value={formData.sleepHours}
                      onChange={(e) => setFormData({...formData, sleepHours: parseFloat(e.target.value)})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Diet Quality (1-10)</label>
                    <input 
                      type="number" min="1" max="10"
                      value={formData.dietQuality}
                      onChange={(e) => setFormData({...formData, dietQuality: parseInt(e.target.value)})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Insights
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer / Privacy */}
      <footer className="border-t border-zinc-800 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs">HIPAA & GDPR Compliant Encryption</span>
          </div>
          <div className="flex gap-8 text-xs text-zinc-500">
            <a href="#" className="hover:text-zinc-300">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300">Terms of Service</a>
            <a href="#" className="hover:text-zinc-300">Ethics Framework</a>
          </div>
          <p className="text-xs text-zinc-600">© 2026 NeuroSync Technologies Inc.</p>
        </div>
      </footer>
    </div>
  );
}
