import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, CheckCircle2, Plus, Trash2, ArrowRight, Target } from 'lucide-react';
import { generateStudyPlan } from '../services/gemini';
import { StudyPlan } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const StudyPlanner: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [timeframe, setTimeframe] = useState('1 week');
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    setIsGenerating(true);
    const result = await generateStudyPlan(goal, timeframe);
    setPlan(result);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6 lg:space-y-8 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 pb-10">
      <div className="glass-dark p-5 lg:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-blue/5 blur-[100px] -z-10" />
        
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <div className="w-10 h-10 rounded-xl bg-cyber-blue/20 flex items-center justify-center border border-cyber-blue/30">
            <Sparkles className="w-5 h-5 text-cyber-blue" />
          </div>
          <div>
            <h3 className="text-xl lg:text-2xl font-bold">AI Study Architect</h3>
            <p className="text-xs lg:text-sm text-white/40">Generate a personalized roadmap for any subject</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-7">
            <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mb-2 block">Learning Objective</label>
            <div className="relative">
              <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Master React Hooks and State Management"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-cyber-blue/50 transition-all text-sm lg:text-base"
              />
            </div>
          </div>
          
          <div className="md:col-span-3">
            <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mb-2 block">Duration</label>
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 focus:outline-none focus:border-cyber-blue/50 transition-all text-sm lg:text-base appearance-none cursor-pointer"
            >
              <option value="1 week">1 Week</option>
              <option value="2 weeks">2 Weeks</option>
              <option value="1 month">1 Month</option>
              <option value="3 months">3 Months</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !goal.trim()}
              className="w-full bg-cyber-blue text-black h-[58px] rounded-2xl font-bold hover:bg-cyber-blue/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
            >
              {isGenerating ? (
                <span className="animate-pulse">Architecting...</span>
              ) : (
                <>Build <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {plan ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between px-2">
              <h4 className="font-bold text-xl lg:text-2xl text-white flex items-center gap-3">
                <Calendar className="w-6 h-6 text-cyber-purple" />
                Your Roadmap
              </h4>
              <button 
                onClick={() => setPlan(null)} 
                className="text-xs font-bold text-white/30 hover:text-cyber-pink transition-colors uppercase tracking-widest"
              >
                Clear Plan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {plan.schedule.map((day, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-dark p-5 rounded-3xl border border-white/10 hover:border-cyber-blue/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-cyber-purple uppercase tracking-widest">{day.day}</span>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                      <Clock className="w-3 h-3 text-white/40" />
                      <span className="text-[10px] font-bold text-white/60">{day.duration}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {day.topics.map((topic, j) => (
                      <div key={j} className="flex items-start gap-2 group/item">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyber-blue/40 group-hover/item:bg-cyber-blue transition-colors shrink-0" />
                        <span className="text-sm text-white/70 group-hover/item:text-white transition-colors leading-tight">
                          {topic}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : !isGenerating && (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <Calendar className="w-16 h-16 mb-4" />
            <p className="text-sm font-bold uppercase tracking-[0.3em]">Awaiting Objective</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
