import React, { useEffect, useState } from 'https://esm.sh/react@latest';
import { createRoot } from 'https://esm.sh/react-dom@latest/client';
import { CheckCircle, Lightbulb, XCircle } from 'https://esm.sh/lucide-react@latest';

function MultiplicationGame() {
  const [currentQuestion, setCurrentQuestion] = useState({ a: 2, b: 3 });
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [lastAnswer, setLastAnswer] = useState(null);
  const [highlightHint, setHighlightHint] = useState(false);

  const generateQuestion = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCurrentQuestion({ a, b });
    setFeedback(null);
    setLastAnswer(null);
  };

  const playSound = (isCorrect) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (isCorrect) {
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    } else {
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  };

  const handleAnswer = (number) => {
    const correct = currentQuestion.a * currentQuestion.b;
    setAttempts((prev) => prev + 1);
    setLastAnswer(number);

    if (number === correct) {
      setScore((prev) => prev + 1);
      setFeedback('correct');
      playSound(true);
      setTimeout(() => generateQuestion(), 2000);
    } else {
      setFeedback('incorrect');
      playSound(false);
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const handleHintHover = () => {
    setHighlightHint(true);
    setTimeout(() => setHighlightHint(false), 1000);
  };

  const getNumberColor = (num) => {
    const ones = num % 10 === 0 ? 10 : num % 10;
    const tens = Math.floor((num - 1) / 10);

    const onesColors = ['bg-red-200', 'bg-orange-200', 'bg-yellow-200', 'bg-green-200', 'bg-teal-200',
                        'bg-blue-200', 'bg-indigo-200', 'bg-purple-200', 'bg-pink-200', 'bg-rose-200'];
    const tensColors = ['border-4 border-red-500', 'border-4 border-orange-500', 'border-4 border-yellow-500',
                        'border-4 border-green-500', 'border-4 border-teal-500', 'border-4 border-blue-500',
                        'border-4 border-indigo-500', 'border-4 border-purple-500', 'border-4 border-pink-500',
                        'border-4 border-rose-500'];

    const bgColor = onesColors[ones - 1];
    const borderColor = tensColors[tens];

    return `${bgColor} ${borderColor}`;
  };

  const getCellColor = (row, col) => {
    const product = row * col;
    const ones = product % 10 === 0 ? 10 : product % 10;
    const tens = Math.floor((product - 1) / 10);

    const onesColors = ['bg-red-100', 'bg-orange-100', 'bg-yellow-100', 'bg-green-100', 'bg-teal-100',
                        'bg-blue-100', 'bg-indigo-100', 'bg-purple-100', 'bg-pink-100', 'bg-rose-100'];
    const tensColors = ['border-l-4 border-red-400', 'border-l-4 border-orange-400', 'border-l-4 border-yellow-400',
                        'border-l-4 border-green-400', 'border-l-4 border-teal-400', 'border-l-4 border-blue-400',
                        'border-l-4 border-indigo-400', 'border-l-4 border-purple-400', 'border-l-4 border-pink-400',
                        'border-l-4 border-rose-400'];

    return `${onesColors[ones - 1]} ${tensColors[tens]}`;
  };

  const isHintCell = (row, col) => {
    return highlightHint && (row === currentQuestion.a || col === currentQuestion.b);
  };

  const isHintIntersection = (row, col) => {
    return highlightHint && row === currentQuestion.a && col === currentQuestion.b;
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 overflow-hidden flex flex-col">
      <div className="flex-shrink-0">
        <h1 className="text-3xl font-bold text-center mb-2 text-purple-800">
          Multiplication Table Lookup Game
        </h1>

        <div className="text-center mb-3">
          <div className="inline-block bg-white rounded-lg shadow px-4 py-2">
            <span className="text-xl font-bold text-green-600">Score: {score}</span>
            <span className="text-gray-400 mx-2">|</span>
            <span className="text-lg text-gray-600">Questions: {attempts}</span>
          </div>
        </div>

        <div className="bg-yellow-100 border-4 border-yellow-400 rounded-xl p-3 mb-4 text-center">
          <div className="flex items-center justify-center gap-4">
            <h2 className="text-4xl font-bold text-gray-800">
              What is {currentQuestion.a} × {currentQuestion.b}?
            </h2>
            <button
              onMouseEnter={handleHintHover}
              className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-full p-3 shadow-lg transition-all hover:scale-110"
              title="Hover for hint"
            >
              <Lightbulb size={28} />
            </button>
          </div>
          {feedback === 'correct' && (
            <div className="mt-2">
              <div className="flex items-center justify-center text-green-600 text-xl font-bold">
                <CheckCircle className="mr-2" size={28} />
                Great job! That's correct!
              </div>
              <div className="text-2xl font-bold text-green-700 mt-1">
                {currentQuestion.a} × {currentQuestion.b} = {lastAnswer}
              </div>
            </div>
          )}
          {feedback === 'incorrect' && (
            <div className="mt-2">
              <div className="flex items-center justify-center text-red-600 text-xl font-bold">
                <XCircle className="mr-2" size={28} />
                Try again!
              </div>
              <div className="text-xl font-bold text-red-700 mt-1">
                {currentQuestion.a} × {currentQuestion.b} ≠ {lastAnswer}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold mb-2 text-center text-purple-700 flex-shrink-0">
            Multiplication Table
          </h3>
          <div className="bg-white rounded-lg shadow-lg p-2 overflow-auto">
            <table className="border-collapse text-sm w-full">
              <thead>
                <tr>
                  <th className="border-2 border-gray-400 p-1 bg-gray-200 font-bold text-xs">×</th>
                  {[1,2,3,4,5,6,7,8,9,10].map(col => (
                    <th 
                      key={col} 
                      className={`border-2 border-gray-400 p-1 font-bold text-xs transition-all ${
                        isHintCell(0, col) ? 'bg-yellow-300 scale-110 shadow-lg' : 'bg-gray-100'
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1,2,3,4,5,6,7,8,9,10].map(row => (
                  <tr key={row}>
                    <th className={`border-2 border-gray-400 p-1 font-bold text-xs transition-all ${
                      isHintCell(row, 0) ? 'bg-yellow-300 scale-110 shadow-lg' : 'bg-gray-100'
                    }`}>
                      {row}
                    </th>
                    {[1,2,3,4,5,6,7,8,9,10].map(col => (
                      <td 
                        key={col} 
                        className={`border-2 border-gray-300 p-1 text-center font-semibold transition-all ${
                          getCellColor(row, col)
                        } ${
                          isHintIntersection(row, col) 
                            ? 'ring-4 ring-yellow-400 scale-125 shadow-2xl z-10 relative' 
                            : isHintCell(row, col)
                            ? 'bg-yellow-200 scale-105 shadow-md'
                            : ''
                        }`}
                      >
                        {row * col}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="text-xl font-bold mb-2 text-center text-purple-700 flex-shrink-0">
            Click the Answer
          </h3>
          <div className="bg-white rounded-lg shadow-lg p-2 overflow-auto">
            <div className="grid grid-cols-10 gap-1">
              {Array.from({ length: 100 }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => handleAnswer(num)}
                  className={`p-2 rounded-lg font-bold text-sm hover:scale-110 transition-transform ${getNumberColor(num)}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const container = document.getElementById('multiplication-game-root');
if (container) {
  const root = createRoot(container);
  root.render(<MultiplicationGame />);
}
