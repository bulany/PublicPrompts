import React, { useState, useEffect, useRef } from 'react';
import { Clock, Target, Award, Mail, Download } from 'lucide-react';

// Mock departments data (simplified for demo - mainland + Corsica)
const DEPARTMENTS = [
  { num: '01', name: 'Ain' },
  { num: '02', name: 'Aisne' },
  { num: '03', name: 'Allier' },
  { num: '04', name: 'Alpes-de-Haute-Provence' },
  { num: '05', name: 'Hautes-Alpes' },
  { num: '06', name: 'Alpes-Maritimes' },
  { num: '07', name: 'Ardèche' },
  { num: '08', name: 'Ardennes' },
  // Add more departments here in production
  { num: '2A', name: 'Corse-du-Sud' },
  { num: '2B', name: 'Haute-Corse' },
].slice(0, 10); // Demo with just 10 for brevity

const SECONDS_PER_DEPT = 4;
const TOTAL_TIME = DEPARTMENTS.length * SECONDS_PER_DEPT;

export default function BenchmarkTest() {
  const [gameState, setGameState] = useState('intro'); // intro, playing, complete
  const [currentIndex, setCurrentIndex] = useState(0);
  const [randomOrder, setRandomOrder] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(SECONDS_PER_DEPT);
  const [results, setResults] = useState({
    clicks: [],
    startTime: null,
    endTime: null,
  });
  const [showFeedback, setShowFeedback] = useState(null);
  
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Initialize random order
  useEffect(() => {
    const shuffled = [...DEPARTMENTS]
      .map((d, i) => i)
      .sort(() => Math.random() - 0.5);
    setRandomOrder(shuffled);
  }, []);

  // Timer logic
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0.1) {
            handleTimeout();
            return SECONDS_PER_DEPT;
          }
          return prev - 0.1;
        });
      }, 100);
    }
    
    return () => clearInterval(timerRef.current);
  }, [gameState, currentIndex]);

  const startGame = () => {
    setGameState('playing');
    setCurrentIndex(0);
    setTimeRemaining(SECONDS_PER_DEPT);
    startTimeRef.current = Date.now();
    setResults({
      clicks: [],
      startTime: Date.now(),
      endTime: null,
    });
  };

  const handleTimeout = () => {
    recordClick(null, false);
    showFeedbackBriefly(randomOrder[currentIndex], null, false);
    advanceToNext();
  };

  const handleDepartmentClick = (clickedIndex) => {
    if (gameState !== 'playing') return;
    
    const targetIndex = randomOrder[currentIndex];
    const correct = clickedIndex === targetIndex;
    
    recordClick(clickedIndex, correct);
    showFeedbackBriefly(targetIndex, clickedIndex, correct);
    
    if (correct) {
      advanceToNext();
    }
  };

  const recordClick = (clickedIndex, correct) => {
    const click = {
      timestamp: Date.now(),
      targetDepartment: DEPARTMENTS[randomOrder[currentIndex]].num,
      clickedDepartment: clickedIndex !== null ? DEPARTMENTS[clickedIndex].num : null,
      correct,
      timeElapsed: Date.now() - startTimeRef.current,
    };
    
    setResults(prev => ({
      ...prev,
      clicks: [...prev.clicks, click],
    }));
  };

  const showFeedbackBriefly = (targetIndex, clickedIndex, correct) => {
    setShowFeedback({ targetIndex, clickedIndex, correct });
    setTimeout(() => setShowFeedback(null), 500);
  };

  const advanceToNext = () => {
    if (currentIndex < DEPARTMENTS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimeRemaining(SECONDS_PER_DEPT);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameState('complete');
    setResults(prev => ({ ...prev, endTime: Date.now() }));
  };

  const calculateScore = () => {
    const correct = results.clicks.filter(c => c.correct).length;
    const totalTime = (results.endTime - results.startTime) / 1000;
    const timeScore = Math.max(0, (TOTAL_TIME - totalTime) * 10);
    return Math.round(correct * 100 + timeScore);
  };

  const exportResults = () => {
    const correct = results.clicks.filter(c => c.correct).length;
    const data = {
      ...results,
      summary: {
        totalCorrect: correct,
        totalIncorrect: results.clicks.length - correct,
        totalTimeSeconds: (results.endTime - results.startTime) / 1000,
        finalScore: calculateScore(),
      }
    };
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `benchmark-${Date.now()}.json`;
    a.click();
  };

  const shareResults = () => {
    const correct = results.clicks.filter(c => c.correct).length;
    const totalTime = ((results.endTime - results.startTime) / 1000).toFixed(1);
    const text = `French Departments Benchmark\n\nScore: ${calculateScore()}\nCorrect: ${correct}/${DEPARTMENTS.length}\nTime: ${totalTime}s\n\nTry it yourself!`;
    
    if (navigator.share) {
      navigator.share({ title: 'My Benchmark Score', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  };

  // Intro Screen
  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex items-center justify-center">
        <div className="max-w-2xl bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            French Departments Benchmark Test
          </h1>
          <p className="text-gray-700 mb-6 text-lg">
            Test your knowledge of French departments! You'll have <strong>{SECONDS_PER_DEPT} seconds</strong> to identify each department number shown.
          </p>
          
          <div className="bg-blue-50 p-6 rounded-xl mb-6 space-y-2">
            <div className="flex items-center gap-2">
              <Target className="text-blue-600" />
              <span className="font-medium">Click the correct department when its number appears</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-blue-600" />
              <span className="font-medium">{SECONDS_PER_DEPT} seconds per department</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="text-blue-600" />
              <span className="font-medium">Brief feedback shown for each click</span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition"
          >
            Start Benchmark Test
          </button>
        </div>
      </div>
    );
  }

  // Complete Screen
  if (gameState === 'complete') {
    const correct = results.clicks.filter(c => c.correct).length;
    const totalTime = ((results.endTime - results.startTime) / 1000).toFixed(1);
    const accuracy = ((correct / DEPARTMENTS.length) * 100).toFixed(1);

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8 flex items-center justify-center">
        <div className="max-w-2xl bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
              <Award className="w-16 h-16 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-green-900 mb-2">
              Test Complete!
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 p-6 rounded-xl text-center">
              <div className="text-4xl font-bold text-blue-900 mb-2">
                {calculateScore()}
              </div>
              <div className="text-gray-600 font-medium">Final Score</div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-xl text-center">
              <div className="text-4xl font-bold text-green-900 mb-2">
                {correct}/{DEPARTMENTS.length}
              </div>
              <div className="text-gray-600 font-medium">Correct ({accuracy}%)</div>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl text-center">
              <div className="text-4xl font-bold text-purple-900 mb-2">
                {totalTime}s
              </div>
              <div className="text-gray-600 font-medium">Total Time</div>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-xl text-center">
              <div className="text-4xl font-bold text-orange-900 mb-2">
                {(totalTime / DEPARTMENTS.length).toFixed(1)}s
              </div>
              <div className="text-gray-600 font-medium">Avg per Dept</div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={shareResults}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
            >
              <Mail size={20} />
              Share Results
            </button>
            
            <button
              onClick={exportResults}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Export Data (JSON)
            </button>
            
            <button
              onClick={() => setGameState('intro')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  const currentTarget = DEPARTMENTS[randomOrder[currentIndex]];
  const progress = ((currentIndex + 1) / DEPARTMENTS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">
              Department {currentIndex + 1} of {DEPARTMENTS.length}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-blue-600" size={20} />
              <span className="text-xl font-bold text-blue-900">
                {timeRemaining.toFixed(1)}s
              </span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Target Display */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center sticky top-4">
            <div className="text-gray-600 mb-2">Find Department</div>
            <div className="text-7xl font-bold text-blue-900 mb-2">
              {currentTarget.num}
            </div>
            <div className="text-2xl text-gray-700">
              {currentTarget.name}
            </div>
          </div>
        </div>

        {/* Map Area (simplified grid for demo) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-5 gap-2">
              {DEPARTMENTS.map((dept, index) => {
                const isTarget = showFeedback && index === showFeedback.targetIndex;
                const isClicked = showFeedback && index === showFeedback.clickedIndex;
                const isCorrect = showFeedback?.correct;
                
                let bgColor = 'bg-blue-100 hover:bg-blue-200';
                if (isTarget && showFeedback) {
                  bgColor = isCorrect ? 'bg-green-400' : 'bg-yellow-300';
                } else if (isClicked && !isCorrect) {
                  bgColor = 'bg-red-400';
                }

                return (
                  <button
                    key={dept.num}
                    onClick={() => handleDepartmentClick(index)}
                    className={`${bgColor} rounded-lg p-4 transition-all duration-200 transform hover:scale-105 cursor-pointer`}
                  >
                    <div className="font-bold text-blue-900">{dept.num}</div>
                    <div className="text-xs text-gray-600 truncate">{dept.name}</div>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-4 text-sm text-gray-500 text-center">
              Click on the department matching the number shown
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
