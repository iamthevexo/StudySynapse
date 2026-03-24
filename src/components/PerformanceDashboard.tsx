import React from 'react';
import { 
  CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, XAxis, YAxis
} from 'recharts';

const data = [
  { name: 'Mon', hours: 2.5, focus: 85 },
  { name: 'Tue', hours: 4, focus: 92 },
  { name: 'Wed', hours: 3, focus: 78 },
  { name: 'Thu', hours: 5, focus: 95 },
  { name: 'Fri', hours: 2, focus: 88 },
  { name: 'Sat', hours: 6, focus: 90 },
  { name: 'Sun', hours: 4, focus: 82 },
];

export const PerformanceDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 h-full">
      <div className="glass-dark p-4 lg:p-6 rounded-2xl border border-white/10 flex flex-col">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h3 className="text-sm lg:text-base font-semibold">Study Hours</h3>
          <span className="text-[10px] font-normal text-white/30 uppercase tracking-widest">Last 7 Days</span>
        </div>
        <div className="flex-1 min-h-[180px] lg:min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ffff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ffff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#ffffff30" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="#ffffff30" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#00ffff' }}
                cursor={{ stroke: '#00ffff20', strokeWidth: 1 }}
              />
              <Area 
                type="monotone" 
                dataKey="hours" 
                stroke="#00ffff" 
                fillOpacity={1} 
                fill="url(#colorHours)" 
                strokeWidth={2} 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-dark p-4 lg:p-6 rounded-2xl border border-white/10 flex flex-col">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h3 className="text-sm lg:text-base font-semibold">Focus Score</h3>
          <span className="text-[10px] font-normal text-white/30 uppercase tracking-widest">Avg: 87%</span>
        </div>
        <div className="flex-1 min-h-[180px] lg:min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#ffffff30" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="#ffffff30" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#bc13fe' }}
                cursor={{ fill: '#ffffff05' }}
              />
              <Bar 
                dataKey="focus" 
                fill="#bc13fe" 
                radius={[4, 4, 0, 0]} 
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
