import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Calendar, 
  Timer, 
  Search, 
  Bell, 
  User as UserIcon,
  BrainCircuit,
  Menu,
  X,
  ChevronRight,
  LogOut,
  LogIn,
  Loader2
} from 'lucide-react';
import { cn } from './lib/utils';
import { AIChatTutor } from './components/AIChatTutor';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { StudyPlanner } from './components/StudyPlanner';
import { FocusTimer } from './components/FocusTimer';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './AuthContext';
import { signInWithGoogle, logout } from './lib/firebase';

type Tab = 'dashboard' | 'tutor' | 'planner' | 'focus';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tutor', label: 'AI Tutor', icon: MessageSquare },
    { id: 'planner', label: 'Study Plan', icon: Calendar },
    { id: 'focus', label: 'Focus Mode', icon: Timer },
  ];

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-dark-bg">
        <Loader2 className="w-10 h-10 text-cyber-blue animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-dark-bg p-6">
        <div className="w-full max-w-md glass-dark p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-cyber-blue rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.4)] mb-6">
              <BrainCircuit className="text-black w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-2 neon-text">StudySynapse</h1>
            <p className="text-white/50 text-sm">
              {isSignUp ? 'Create your account to start learning' : 'Welcome back, scholar!'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="scholar@example.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyber-blue/50 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyber-blue/50 transition-all text-sm"
              />
            </div>

            {authError && (
              <p className="text-cyber-pink text-xs bg-cyber-pink/10 p-3 rounded-lg border border-cyber-pink/20">
                {authError}
              </p>
            )}

            <button 
              type="submit"
              disabled={isAuthLoading}
              className="w-full bg-cyber-blue text-black font-bold py-4 rounded-xl hover:bg-cyber-blue/90 transition-all shadow-[0_0_15px_rgba(0,255,255,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAuthLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-white/40 hover:text-cyber-blue transition-all"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-dark-bg text-white selection:bg-cyber-blue/30">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.aside 
          initial={false}
          animate={{ width: isSidebarOpen ? 260 : 80 }}
          className="glass-dark border-r border-white/10 flex flex-col z-50 relative"
        >
          <div className="p-6 flex items-center gap-3 overflow-hidden">
            <div className="shrink-0 w-10 h-10 bg-cyber-blue rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.4)]">
              <BrainCircuit className="text-black w-6 h-6" />
            </div>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-bold text-xl tracking-tight neon-text whitespace-nowrap"
                >
                  StudySynapse
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative overflow-hidden",
                  activeTab === item.id 
                    ? "bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20" 
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", activeTab === item.id && "neon-text")} />
                {isSidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-cyber-blue rounded-r-full"
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10 space-y-2">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-4 px-4 py-3 text-white/50 hover:text-cyber-pink transition-all rounded-xl hover:bg-cyber-pink/5"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span className="whitespace-nowrap">Logout</span>}
            </button>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full flex items-center gap-4 px-4 py-3 text-white/50 hover:text-white transition-all rounded-xl hover:bg-white/5"
            >
              {isSidebarOpen ? <X className="w-5 h-5 shrink-0" /> : <Menu className="w-5 h-5 shrink-0" />}
              {isSidebarOpen && <span className="whitespace-nowrap">Collapse</span>}
            </button>
          </div>
        </motion.aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 lg:h-20 flex items-center justify-between px-4 lg:px-8 border-b border-white/10 bg-black/20 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            {isMobile && (
              <div className="w-8 h-8 bg-cyber-blue rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                <BrainCircuit className="text-black w-5 h-5" />
              </div>
            )}
            <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 w-64 lg:w-96 focus-within:border-cyber-blue/50 transition-all">
              <Search className="w-4 h-4 text-white/30" />
              <input 
                type="text" 
                placeholder="Search topics..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <button className="relative p-2 text-white/50 hover:text-white transition-all hover:bg-white/5 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-cyber-pink rounded-full shadow-[0_0_5px_rgba(255,0,255,0.8)] border border-black" />
            </button>
            
            <div className="flex items-center gap-3 pl-3 lg:pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none mb-1">{profile?.displayName || user.displayName}</p>
                <p className="text-[10px] text-cyber-blue uppercase tracking-tighter font-bold opacity-70 leading-none">Level {profile?.level || 1} Scholar</p>
              </div>
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-cyber-blue to-cyber-purple p-[1.5px] cursor-pointer hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-5 h-5 lg:w-6 lg:h-6 text-white/50" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto pb-24 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full max-w-7xl mx-auto w-full"
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-6 lg:space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold mb-1 lg:mb-2">Welcome back, {user.displayName?.split(' ')[0]}!</h1>
                      <p className="text-sm lg:text-base text-white/50">You've completed 85% of your weekly study goals. Keep it up!</p>
                    </div>
                    <div className="flex gap-3 lg:gap-4">
                      <div className="glass-dark px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl border border-white/10 flex-1 md:flex-none">
                        <p className="text-[10px] text-white/50 uppercase tracking-widest mb-0.5 lg:mb-1">Daily Streak</p>
                        <p className="text-lg lg:text-xl font-bold text-cyber-blue">🔥 {profile?.streak || 0} Days</p>
                      </div>
                      <div className="glass-dark px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl border border-white/10 flex-1 md:flex-none">
                        <p className="text-[10px] text-white/50 uppercase tracking-widest mb-0.5 lg:mb-1">Study Points</p>
                        <p className="text-lg lg:text-xl font-bold text-cyber-purple">✨ {profile?.xp || 0} XP</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                      <div className="h-[300px] lg:h-[400px]">
                        <PerformanceDashboard />
                      </div>
                      <div className="glass-dark p-4 lg:p-6 rounded-2xl border border-white/10">
                        <div className="flex items-center justify-between mb-4 lg:mb-6">
                          <h3 className="text-lg font-semibold">Upcoming Tasks</h3>
                          <button className="text-xs text-cyber-blue hover:underline flex items-center gap-1">View All <ChevronRight className="w-3 h-3" /></button>
                        </div>
                        <div className="space-y-3">
                          {[
                            { title: 'Quantum Mechanics Quiz', date: 'Tomorrow, 10:00 AM', priority: 'high' },
                            { title: 'Organic Chemistry Lab Report', date: 'Friday, 11:59 PM', priority: 'medium' },
                            { title: 'History Essay Draft', date: 'Next Monday', priority: 'low' },
                          ].map((task, i) => (
                            <div key={i} className="flex items-center justify-between p-3 lg:p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer group">
                              <div className="flex items-center gap-3 lg:gap-4">
                                <div className={cn(
                                  "w-2 h-2 rounded-full shrink-0",
                                  task.priority === 'high' ? "bg-cyber-pink shadow-[0_0_8px_rgba(255,0,255,0.6)]" :
                                  task.priority === 'medium' ? "bg-yellow-400" : "bg-green-400"
                                )} />
                                <div>
                                  <p className="text-sm lg:text-base font-medium group-hover:text-cyber-blue transition-colors line-clamp-1">{task.title}</p>
                                  <p className="text-[10px] lg:text-xs text-white/50">{task.date}</p>
                                </div>
                              </div>
                              <button className="text-[10px] lg:text-xs bg-white/10 hover:bg-white/20 px-2 lg:px-3 py-1 rounded-lg transition-all whitespace-nowrap ml-2">Mark Done</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6 lg:space-y-8">
                      <div className="h-[300px] lg:h-[350px]">
                        <FocusTimer />
                      </div>
                      <div className="glass-dark p-4 lg:p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-cyber-blue/5 to-cyber-purple/5">
                        <h3 className="text-base lg:text-lg font-semibold mb-2 flex items-center gap-2">
                          <BrainCircuit className="w-5 h-5 text-cyber-blue" />
                          AI Insight
                        </h3>
                        <p className="text-xs lg:text-sm text-white/70 leading-relaxed">
                          Based on your recent performance, you're most productive between 10 AM and 1 PM. Try scheduling your hardest subjects during this window!
                        </p>
                        <button className="mt-4 text-[10px] lg:text-xs text-cyber-blue hover:underline">View detailed analytics →</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="h-full">
                {activeTab === 'tutor' && <AIChatTutor />}
                {activeTab === 'planner' && <StudyPlanner />}
                {activeTab === 'focus' && <FocusTimer />}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <nav className="fixed bottom-0 left-0 right-0 h-16 glass-dark border-t border-white/10 flex items-center justify-around px-4 z-50">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all",
                  activeTab === item.id ? "text-cyber-blue" : "text-white/40"
                )}
              >
                <item.icon className={cn("w-5 h-5", activeTab === item.id && "neon-text")} />
                <span className="text-[10px] font-medium">{item.label}</span>
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="mobile-active"
                    className="absolute -top-[1px] w-8 h-[2px] bg-cyber-blue rounded-full"
                  />
                )}
              </button>
            ))}
          </nav>
        )}
      </main>
    </div>
  );
}
