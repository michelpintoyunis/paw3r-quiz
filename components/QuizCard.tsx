import React from 'react';
import { Question } from '../types';

interface QuizCardProps {
  question: Question;
  onOptionSelect: (index: number) => void;
  selectedOption: number | null;
  showResult: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({ question, onOptionSelect, selectedOption, showResult }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center animate-scale-up">
      {/* Título */}
      <h2 className="text-xl md:text-4xl font-black mb-8 md:mb-12 text-black leading-tight uppercase tracking-tight italic drop-shadow-sm">
        {question.text}
      </h2>

      <div className="grid gap-4 md:gap-6 w-full">
        {question.options.map((option, index) => {
          let buttonClass = "w-full p-4 md:p-6 text-left border-2 rounded-xl transition-all duration-300 font-bold text-sm md:text-xl relative overflow-hidden group ";
          let content = option;

          if (showResult) {
            if (index === question.correctAnswer) {
              // CORRECTA (Siempre verde, sea seleccionada o no)
              buttonClass += "bg-green-600 text-white border-green-700 shadow-xl animate-pulse-success z-10 scale-[1.03] ";
            } else if (selectedOption === index) {
              // INCORRECTA SELECCIONADA
              buttonClass += "bg-red-600 text-white border-red-700 animate-shake ";
            } else {
              // OTRAS OPCIONES
              buttonClass += "bg-gray-100 text-gray-400 border-gray-200 opacity-40 ";
            }
          } else {
            // ESTADO NORMAL
            if (selectedOption === index) {
              buttonClass += "bg-black text-white border-black";
            } else {
              buttonClass += "bg-white text-black border-gray-300 md:hover:border-black md:hover:bg-black md:hover:text-white active:bg-gray-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]";
            }
          }

          return (
            <button
              key={index}
              onClick={() => !showResult && onOptionSelect(index)}
              disabled={showResult}
              className={buttonClass}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="leading-tight uppercase tracking-wide">{content}</span>
                {showResult && index === question.correctAnswer && (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 animate-pop-in" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                   </svg>
                )}
                {showResult && selectedOption === index && index !== question.correctAnswer && (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 animate-pop-in" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                   </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showResult && question.explanation && (
        <div className="mt-6 md:mt-10 p-6 md:p-8 bg-black text-white rounded-lg border-l-[10px] border-green-500 animate-fade-in text-sm md:text-lg shadow-2xl">
          <p className="font-black text-green-400 mb-2 uppercase tracking-widest text-xs md:text-sm">Dato PAW3R:</p>
          <p className="font-bold leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};