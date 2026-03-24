import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const FocusTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Simple notification logic or sound could go here
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (mode === 'focus' ? 25 * 60 : 5 * 60)) * 100;

  return (
    <div className="glass-dark p-8 rounded-2xl border border-white/10 flex flex-col items-center justify-center h-full">
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => switchMode('focus')}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2",
            mode === 'focus' ? "bg-cyber-blue text-black" : "bg-white/5 text-white/50"
          )}
        >
          <Brain className="w-4 h-4" /> Focus
        </button>
        <button
          onClick={() => switchMode('break')}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2",
            mode === 'break' ? "bg-cyber-purple text-white" : "bg-white/5 text-white/50"
          )}
        >
          <Coffee className="w-4 h-4" /> Break
        </button>
      </div>

      <div className="relative w-48 h-48 flex items-center justify-center mb-8">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/5"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={553}
            animate={{ strokeDashoffset: 553 - (553 * progress) / 100 }}
            className={cn(mode === 'focus' ? "text-cyber-blue" : "text-cyber-purple")}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold font-mono tracking-tighter">{formatTime(timeLeft)}</span>
          <span className="text-xs text-white/30 uppercase tracking-widest">{mode}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
        >
          {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
        <button
          onClick={resetTimer}
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
