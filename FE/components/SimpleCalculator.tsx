import React, { useState } from 'react';
import { X, Delete, GripHorizontal } from 'lucide-react';

interface SimpleCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimpleCalculator: React.FC<SimpleCalculatorProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [prevResult, setPrevResult] = useState<string | null>(null);
  const [waitingForNewOperand, setWaitingForNewOperand] = useState(false);

  if (!isOpen) return null;

  const handleNumber = (num: string) => {
    if (waitingForNewOperand) {
      setDisplay(num);
      setWaitingForNewOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (operator: string) => {
    const lastChar = display.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
      setDisplay(display.slice(0, -1) + operator);
      return;
    }
    setDisplay(display + operator);
    setWaitingForNewOperand(false);
  };

  const handleDecimal = () => {
    if (waitingForNewOperand) {
      setDisplay('0.');
      setWaitingForNewOperand(false);
      return;
    }
    
    const parts = display.split(/[\+\-\*\/]/);
    const currentPart = parts[parts.length - 1];
    if (!currentPart.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevResult(null);
    setWaitingForNewOperand(false);
  };

  const handleDelete = () => {
    if (waitingForNewOperand) {
        setDisplay('0');
        return;
    }
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  };

  const calculate = () => {
    try {
      // eslint-disable-next-line no-new-func
      const result = new Function('return ' + display)();
      const formattedResult = String(parseFloat(result.toFixed(4)));
      setPrevResult(display + ' =');
      setDisplay(formattedResult);
      setWaitingForNewOperand(true);
    } catch (error) {
      setDisplay('Error');
      setWaitingForNewOperand(true);
    }
  };

  const btnClass = "h-12 rounded-lg font-bold text-lg transition-all active:scale-95 flex items-center justify-center shadow-sm border border-slate-700/50";
  const numBtnClass = `${btnClass} bg-slate-700/80 text-white hover:bg-slate-600/80`;
  const opBtnClass = `${btnClass} bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-blue-500/20`;
  const actionBtnClass = `${btnClass} bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border-rose-500/20`;

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-40 w-[280px] sm:w-[300px] animate-fade-in">
      <div className="bg-surface/90 backdrop-blur-md border border-slate-600/80 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
        {/* Header */}
        <div className="flex justify-between items-center p-3 bg-slate-800/80 border-b border-slate-700">
          <div className="flex items-center gap-2 text-slate-300">
            <GripHorizontal size={16} className="opacity-50" />
            <h3 className="font-bold text-sm">Máy Tính</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Display */}
        <div className="p-3 bg-slate-900/50 text-right">
          <div className="text-slate-400 text-xs h-4 font-medium">{prevResult}</div>
          <div className="text-white text-2xl font-bold truncate tracking-wider font-mono">{display}</div>
        </div>

        {/* Keypad */}
        <div className="p-3 grid grid-cols-4 gap-2 bg-transparent">
          <button onClick={handleClear} className={`${actionBtnClass} col-span-2 text-sm`}>AC</button>
          <button onClick={handleDelete} className={actionBtnClass}><Delete size={18}/></button>
          <button onClick={() => handleOperator('/')} className={opBtnClass}>÷</button>

          <button onClick={() => handleNumber('7')} className={numBtnClass}>7</button>
          <button onClick={() => handleNumber('8')} className={numBtnClass}>8</button>
          <button onClick={() => handleNumber('9')} className={numBtnClass}>9</button>
          <button onClick={() => handleOperator('*')} className={opBtnClass}>×</button>

          <button onClick={() => handleNumber('4')} className={numBtnClass}>4</button>
          <button onClick={() => handleNumber('5')} className={numBtnClass}>5</button>
          <button onClick={() => handleNumber('6')} className={numBtnClass}>6</button>
          <button onClick={() => handleOperator('-')} className={opBtnClass}>-</button>

          <button onClick={() => handleNumber('1')} className={numBtnClass}>1</button>
          <button onClick={() => handleNumber('2')} className={numBtnClass}>2</button>
          <button onClick={() => handleNumber('3')} className={numBtnClass}>3</button>
          <button onClick={() => handleOperator('+')} className={opBtnClass}>+</button>

          <button onClick={() => handleNumber('0')} className={`${numBtnClass} col-span-2`}>0</button>
          <button onClick={handleDecimal} className={numBtnClass}>.</button>
          <button onClick={calculate} className={`${btnClass} bg-primary text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20`}>=</button>
        </div>
      </div>
    </div>
  );
};