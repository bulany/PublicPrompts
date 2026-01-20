import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const AIVideoTimeline = () => {
  const [activeView, setActiveView] = useState('timeline');
  
  // Data for timeline projection
  const timelineData = [
    { 
      year: 2025, 
      daysToGenerate: 2190, // ~6 years worth of daily generation
      clipLength: 8,
      costPerSecond: 0.15,
      freeTierPerWeek: 2, // 2 clips per week
      characterConsistency: 'Manual reference needed'
    },
    { 
      year: 2027, 
      daysToGenerate: 730, // ~2 years
      clipLength: 20,
      costPerSecond: 0.08,
      freeTierPerWeek: 5,
      characterConsistency: 'Good with tools'
    },
    { 
      year: 2030, 
      daysToGenerate: 180, // ~6 months
      clipLength: 45,
      costPerSecond: 0.03,
      freeTierPerWeek: 15,
      characterConsistency: 'Excellent built-in'
    },
    { 
      year: 2033, 
      daysToGenerate: 30, // 1 month
      clipLength: 90,
      costPerSecond: 0.01,
      freeTierPerWeek: 50,
      characterConsistency: 'Perfect'
    },
    { 
      year: 2037, 
      daysToGenerate: 3, // 3 days
      clipLength: 180,
      costPerSecond: 0.003,
      freeTierPerWeek: 200,
      characterConsistency: 'Perfect'
    },
    { 
      year: 2042, 
      daysToGenerate: 0.007, // ~10 minutes
      clipLength: 600,
      costPerSecond: 0.0005,
      freeTierPerWeek: 1000,
      characterConsistency: 'Perfect'
    }
  ];

  const costData = [
    { year: 2025, paidCost: 810, freeCost: 0 },
    { year: 2027, paidCost: 432, freeCost: 0 },
    { year: 2030, paidCost: 162, freeCost: 0 },
    { year: 2033, paidCost: 54, freeCost: 0 },
    { year: 2037, paidCost: 16, freeCost: 0 },
    { year: 2042, paidCost: 3, freeCost: 0 }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-blue-500 p-4 rounded-lg shadow-xl">
          <p className="text-blue-400 font-bold mb-2">{data.year}</p>
          <p className="text-white text-sm">Time needed: <span className="text-yellow-400 font-semibold">
            {data.daysToGenerate >= 365 ? `${(data.daysToGenerate/365).toFixed(1)} years` : 
             data.daysToGenerate >= 30 ? `${Math.round(data.daysToGenerate/30)} months` :
             data.daysToGenerate >= 1 ? `${Math.round(data.daysToGenerate)} days` :
             `${Math.round(data.daysToGenerate * 24 * 60)} minutes`}
          </span></p>
          <p className="text-white text-sm">Clip length: <span className="text-green-400 font-semibold">{data.clipLength}s</span></p>
          <p className="text-white text-sm">Cost/sec: <span className="text-purple-400 font-semibold">${data.costPerSecond}</span></p>
          <p className="text-white text-sm">Free tier: <span className="text-cyan-400 font-semibold">{data.freeTierPerWeek} clips/week</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">AI Video Generation Evolution</h1>
        <p className="text-blue-300 text-center mb-6">Path to Feature-Length Film Generation (90 minutes / 5,400 seconds)</p>
        
        {/* View Selector */}
        <div className="flex gap-2 mb-6 justify-center">
          <button
            onClick={() => setActiveView('timeline')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeView === 'timeline' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Generation Timeline
          </button>
          <button
            onClick={() => setActiveView('cost')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeView === 'cost' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Cost Projection
          </button>
          <button
            onClick={() => setActiveView('details')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeView === 'details' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Detailed Analysis
          </button>
        </div>

        {/* Timeline View */}
        {activeView === 'timeline' && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Days to Generate a Feature Film (Free Tier)</h2>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorDays" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="year" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" scale="log" domain={[0.001, 10000]} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="daysToGenerate" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorDays)" 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-gray-400 text-sm mt-4 text-center">
              Note: Y-axis uses logarithmic scale to show the dramatic improvement
            </p>
          </div>
        )}

        {/* Cost View */}
        {activeView === 'cost' && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Cost to Generate Feature Film (Paid Tier)</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="year" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #3b82f6',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value) => [`$${value}`, 'Cost']}
                />
                <Line 
                  type="monotone" 
                  dataKey="paidCost" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 6 }}
                  name="Paid tier cost"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-300 text-sm">2025 Cost</p>
                <p className="text-3xl font-bold text-purple-400">$810</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-300 text-sm">2042 Cost</p>
                <p className="text-3xl font-bold text-green-400">$3</p>
              </div>
            </div>
          </div>
        )}

        {/* Details View */}
        {activeView === 'details' && (
          <div className="space-y-4">
            {timelineData.map((data, idx) => (
              <div key={idx} className="bg-gray-800 rounded-xl p-6 shadow-xl border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white">{data.year}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    idx === 0 ? 'bg-red-900 text-red-200' :
                    idx <= 2 ? 'bg-yellow-900 text-yellow-200' :
                    'bg-green-900 text-green-200'
                  }`}>
                    {idx === 0 ? 'Current' : idx === timelineData.length - 1 ? 'Instant' : 'Improving'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Time to Generate</p>
                    <p className="text-xl font-semibold text-blue-400">
                      {data.daysToGenerate >= 365 ? `${(data.daysToGenerate/365).toFixed(1)} years` : 
                       data.daysToGenerate >= 30 ? `${Math.round(data.daysToGenerate/30)} months` :
                       data.daysToGenerate >= 1 ? `${Math.round(data.daysToGenerate)} days` :
                       `${Math.round(data.daysToGenerate * 24 * 60)} minutes`}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Max Clip Length</p>
                    <p className="text-xl font-semibold text-green-400">{data.clipLength} seconds</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Cost per Second</p>
                    <p className="text-xl font-semibold text-purple-400">${data.costPerSecond}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Free Tier Access</p>
                    <p className="text-xl font-semibold text-cyan-400">{data.freeTierPerWeek} clips/week</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Character Consistency</p>
                    <p className="text-xl font-semibold text-yellow-400">{data.characterConsistency}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Clips Needed</p>
                    <p className="text-xl font-semibold text-orange-400">
                      {Math.ceil(5400 / data.clipLength)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Key Insights */}
        <div className="mt-8 bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">Key Assumptions & Insights</h2>
          <div className="grid md:grid-cols-2 gap-4 text-white">
            <div>
              <h3 className="font-semibold text-blue-300 mb-2">📈 Clip Length Growth</h3>
              <p className="text-sm text-gray-300">
                Current: 8-20 seconds. Projected to reach 10+ minutes by 2042 based on exponential improvements
                in model efficiency and compute optimization.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-300 mb-2">💰 Cost Reduction</h3>
              <p className="text-sm text-gray-300">
                Following historical trends (similar to image generation 2020-2024), costs should drop 99%+ over 
                20 years due to algorithm improvements and hardware advances.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-300 mb-2">🎭 Character Consistency</h3>
              <p className="text-sm text-gray-300">
                Currently requires manual reference images. Native consistency already emerging (Veo 3.1, Runway Gen-4).
                Expected to be solved by 2028-2030.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-300 mb-2">🎬 Quality Threshold</h3>
              <p className="text-sm text-gray-300">
                "Decent watch" quality likely achievable around 2030-2033 for feature films, with Hollywood-level
                quality by 2035-2038.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIVideoTimeline;