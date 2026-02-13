import React, { useState, useEffect, useRef } from 'react';
import { GameState, Question } from './types';
import { generateQuestions } from './services/geminiService';
import { UgoDisplay } from './components/UgoDisplay';
import { QuizCard } from './components/QuizCard';

// SFX Actualizados (Vuelve el sonido anterior)
const SFX_CORRECT = "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"; 
const SFX_WRONG = "https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg"; 
const SFX_CLICK = "https://actions.google.com/sounds/v1/ui/click_on_tape.ogg"; 

const PAW3R_LOGO_URL = "https://paw3r.com/cdn/shop/files/logo-pawer-white_310x.png?v=1695223697";

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  // Eliminado estado UI de isMuted (sonido siempre activo)
  
  const [userAnswers, setUserAnswers] = useState<{qIndex: number, selected: number, correct: boolean}[]>([]);
  
  // Referencias de Audio (Solo SFX)
  const sfxCorrectRef = useRef<HTMLAudioElement | null>(null);
  const sfxWrongRef = useRef<HTMLAudioElement | null>(null);
  const sfxClickRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Inicializar efectos de sonido
    sfxCorrectRef.current = new Audio(SFX_CORRECT);
    sfxCorrectRef.current.volume = 0.4; 
    
    sfxWrongRef.current = new Audio(SFX_WRONG);
    sfxWrongRef.current.volume = 0.3;

    sfxClickRef.current = new Audio(SFX_CLICK);
    sfxClickRef.current.volume = 0.3;
  }, []);

  const playSfx = (type: 'correct' | 'wrong' | 'click') => {
    try {
        if (type === 'correct' && sfxCorrectRef.current) {
            sfxCorrectRef.current.currentTime = 0;
            sfxCorrectRef.current.play().catch(() => {});
        }
        if (type === 'wrong' && sfxWrongRef.current) {
            sfxWrongRef.current.currentTime = 0;
            sfxWrongRef.current.play().catch(() => {});
        }
        if (type === 'click' && sfxClickRef.current) {
            sfxClickRef.current.currentTime = 0;
            sfxClickRef.current.play().catch(() => {});
        }
    } catch (e) {
        console.error("Error playing SFX", e);
    }
  };

  const startGame = async () => {
    playSfx('click');
    setGameState(GameState.LOADING_QUESTIONS);
    const generatedQuestions = await generateQuestions();
    setQuestions(generatedQuestions);
    setScore(0);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setGameState(GameState.PLAYING);
  };

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    setShowResult(true);
    
    const isCorrect = index === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
        setScore(prev => prev + 1);
        playSfx('correct');
    } else {
        playSfx('wrong');
    }

    setUserAnswers(prev => [...prev, {
      qIndex: currentQuestionIndex,
      selected: index,
      correct: isCorrect
    }]);

    setTimeout(() => {
      handleNextQuestion();
    }, 2000); 
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowResult(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameState(GameState.FINISHED);
    }
  };

  const restartGame = () => {
    playSfx('click');
    setScore(0);
    setCurrentQuestionIndex(0);
    setGameState(GameState.INTRO);
  };

  // --- VISTAS ---

  return (
    <>
      {/* 1. INTRO - Espaciado aumentado, logo presente */}
      {gameState === GameState.INTRO && (
        <div className="h-full w-full bg-white text-black flex items-center justify-center relative overflow-hidden font-sans min-h-screen animate-fade-in">
          <div className="absolute top-0 left-0 w-full h-4 bg-black z-50"></div>
          <div className="absolute bottom-0 left-0 w-full h-4 bg-black z-50"></div>

          {/* Scroll container */}
          <div className="w-full h-full overflow-y-auto flex items-center justify-center p-8">
              
              {/* Contenedor principal: Aumentado gap para que no esté todo pegado */}
              <div className="flex flex-col landscape:flex-row items-center justify-center w-full max-w-6xl gap-12 landscape:gap-24 z-10 text-center landscape:text-left mt-8 landscape:mt-0 mb-8 landscape:mb-0">
                
                {/* GRUPO VISUAL (Gorila + Logo) */}
                <div className="flex flex-col items-center justify-center animate-scale-up">
                    <div className="mb-8 landscape:mb-6 p-6 landscape:p-4 border-[6px] border-black rounded-full bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-transform hover:scale-105 duration-500">
                        <UgoDisplay className="w-32 h-32 md:w-56 md:h-56 landscape:w-40 landscape:h-40" />
                    </div>
                    
                    {/* LOGO PAW3R */}
                    <div className="flex flex-col items-center">
                        <img 
                            src={PAW3R_LOGO_URL} 
                            alt="PAW3R Logo" 
                            className="w-56 md:w-96 landscape:w-64 h-auto object-contain filter invert landscape:my-4 transition-opacity duration-700" 
                        />
                        <h2 className="text-4xl md:text-7xl landscape:text-5xl font-black tracking-tighter uppercase leading-none italic mt-4">
                            QUIZ
                        </h2>
                    </div>
                </div>

                {/* GRUPO ACCIONES (Texto + Botón) */}
                <div className="flex flex-col items-center landscape:items-start max-w-md animate-slide-in" style={{animationDelay: '0.2s'}}>
                    <div className="bg-gray-50 border-l-[6px] border-black p-6 md:p-8 text-left mb-10 landscape:mb-10 w-full shadow-xl">
                      <p className="text-base md:text-lg font-bold text-gray-800 uppercase tracking-wide leading-relaxed">
                          Bienvenido a la prueba de fuego. <br/>
                          Demuestra que perteneces a la <span className="text-black bg-yellow-300 px-2 py-0.5 transform -skew-x-6 inline-block">Manada</span>.
                      </p>
                      <p className="text-sm md:text-base text-gray-600 mt-4 font-medium">
                          Responde 20 preguntas sobre historia, estilo y cultura de la marca.
                      </p>
                    </div>
                    
                    <button
                    onClick={startGame}
                    className="group bg-black text-white text-xl md:text-3xl landscape:text-2xl font-black py-5 px-16 landscape:px-10 rounded-xl hover:bg-green-600 transition-all duration-300 shadow-2xl flex items-center gap-4 border-2 border-black whitespace-nowrap hover:-translate-y-1"
                    >
                    <span>INICIAR RETO</span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </button>
                </div>

              </div>
          </div>
        </div>
      )}

      {/* 2. LOADING */}
      {gameState === GameState.LOADING_QUESTIONS && (
        <div className="h-full w-full min-h-screen flex flex-col items-center justify-center bg-white animate-fade-in">
          <div className="w-20 h-20 border-8 border-black border-t-transparent rounded-full animate-spin mb-8"></div>
          <p className="font-black tracking-[0.2em] uppercase text-xl text-black animate-pulse">PREPARANDO GYM...</p>
        </div>
      )}

      {/* 3. JUEGO - Logo eliminado del sidebar */}
      {gameState === GameState.PLAYING && questions.length > 0 && (
        <div className="h-screen w-screen bg-white flex flex-col md:flex-row landscape:flex-row overflow-hidden relative animate-fade-in">
          
          {/* HEADER / SIDEBAR (Sin Logo de Gorilla, Limpio) */}
          <div className="
             flex-none 
             w-full md:w-3/12 landscape:w-3/12 
             bg-gray-50 
             border-b-4 md:border-b-0 md:border-r-4 border-black 
             flex flex-col md:justify-center relative 
             p-4 md:p-8 z-20
             landscape:overflow-y-auto
             transition-all duration-500
          ">
            {/* Barra de progreso */}
            <div className="absolute top-0 left-0 w-full h-3 bg-gray-200">
                <div 
                  className="bg-black h-full transition-all duration-700 ease-out"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
            </div>

            <div className="flex flex-row md:flex-col landscape:flex-col items-center justify-between md:justify-center w-full h-full gap-4">
                
                {/* Contador de preguntas */}
                <div className="flex flex-col items-start md:items-center landscape:items-center">
                    <div className="text-3xl md:text-6xl landscape:text-5xl font-black leading-none italic">
                      <span className="md:hidden landscape:hidden text-gray-400 mr-2 text-xl">#</span>
                      {currentQuestionIndex + 1} 
                    </div>
                    <span className="text-gray-400 font-bold text-sm md:text-xl landscape:text-lg mt-1 tracking-wider">
                        / {questions.length}
                    </span>
                </div>

                {/* Score */}
                <div className="flex items-center gap-3 md:flex-col landscape:flex-col md:gap-4 landscape:gap-4">
                  <div className="bg-black text-white px-4 py-2 md:px-10 md:py-6 landscape:px-6 landscape:py-4 rounded-lg md:rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] md:shadow-[8px_8px_0px_0px_rgba(200,200,200,1)] flex flex-col items-center justify-center border-2 border-black transition-transform hover:scale-105">
                    <span className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">SCORE</span>
                    <span className="font-black text-2xl md:text-5xl landscape:text-4xl leading-none">{score}</span>
                  </div>
                </div>
            </div>
          </div>

          {/* ÁREA DE PREGUNTAS */}
          <div className="
            flex-grow 
            w-full md:w-9/12 landscape:w-9/12 
            h-full bg-white relative 
            overflow-y-auto
          ">
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
              
            <div className="min-h-full flex items-center justify-center p-6 md:p-16 landscape:p-10">
              <div className="w-full max-w-3xl z-10 pb-12 landscape:pb-8">
                <div key={currentQuestionIndex}>
                  <QuizCard 
                    question={questions[currentQuestionIndex]}
                    onOptionSelect={handleOptionSelect}
                    selectedOption={selectedOption}
                    showResult={showResult}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. RESUMEN FINAL - Logo reincorporado */}
      {gameState === GameState.FINISHED && (
        <div className="h-screen w-screen bg-white flex flex-col md:flex-row overflow-hidden font-sans animate-fade-in">
          <div className="flex-none w-full md:w-1/3 bg-black text-white p-8 md:p-12 flex flex-col justify-center items-center text-center z-10 shadow-2xl relative border-b-4 md:border-b-0 md:border-r-4 border-gray-800">
              
              <div className="animate-scale-up flex flex-col items-center gap-6">
                <div className="bg-white p-6 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    <UgoDisplay className="w-24 h-24 md:w-40 md:h-40" />
                </div>
                
                {/* LOGO REINCORPORADO (Blanco sobre fondo negro) */}
                <img 
                    src={PAW3R_LOGO_URL} 
                    alt="PAW3R Logo" 
                    className="w-48 md:w-64 h-auto object-contain mb-2" 
                />

                <div>
                    <h2 className="text-xl md:text-3xl font-bold uppercase tracking-widest mb-4 text-gray-400">Entrenamiento Finalizado</h2>
                    <div className="text-7xl md:text-9xl font-black mb-2 text-white tracking-tighter drop-shadow-lg">{score}</div>
                    <p className="text-green-400 font-bold uppercase tracking-[0.2em] text-sm">Aciertos Totales</p>
                </div>
              </div>
              
              <button
                onClick={restartGame}
                className="mt-12 bg-white text-black font-black py-5 px-12 rounded hover:bg-green-400 transition-all duration-300 uppercase text-lg tracking-widest w-full md:w-auto shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              >
                Volver a jugar
              </button>
          </div>

          <div className="flex-grow flex flex-col h-full overflow-hidden bg-gray-50 relative">
            <div className="flex-none bg-white border-b-2 border-black p-6 md:p-8 sticky top-0 z-20 shadow-md">
                  <h3 className="text-black font-black uppercase text-2xl md:text-3xl tracking-tight">Resumen de respuestas</h3>
            </div>

            <div className="flex-grow overflow-y-auto p-6 md:p-12 hide-scrollbar">
              <div className="space-y-6 max-w-5xl mx-auto pb-12">
                {userAnswers.map((ans, idx) => (
                  <div key={idx} className={`p-6 rounded-lg border-2 bg-white flex flex-col md:flex-row gap-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-1 duration-300 ${ans.correct ? 'border-green-600' : 'border-red-600'}`}>
                    <div className="flex items-start gap-4">
                        <span className={`flex-none w-10 h-10 rounded-lg flex items-center justify-center text-lg font-black text-white border-2 border-black shadow-sm ${ans.correct ? 'bg-green-600' : 'bg-red-600'}`}>
                          {ans.correct ? '✓' : 'X'}
                        </span>
                        <span className="text-sm font-black text-gray-400 uppercase mt-2">#{idx + 1}</span>
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-lg md:text-xl text-black mb-3 leading-tight">{questions[ans.qIndex].text}</p>
                      <div className="text-sm md:text-base flex flex-col md:flex-row gap-3">
                          {ans.correct ? (
                              <span className="text-green-700 font-bold bg-green-50 px-3 py-1.5 rounded border border-green-200 inline-block w-fit">
                                  Tu respuesta: {questions[ans.qIndex].options[ans.selected]}
                              </span>
                          ) : (
                              <>
                                  <span className="text-red-600 font-bold bg-red-50 px-3 py-1.5 rounded border border-red-200 line-through inline-block w-fit">
                                      {questions[ans.qIndex].options[ans.selected]}
                                  </span>
                                  <span className="text-black font-bold bg-gray-100 px-3 py-1.5 rounded border border-gray-300 inline-block w-fit">
                                      Correcta: {questions[ans.qIndex].options[questions[ans.qIndex].correctAnswer]}
                                  </span>
                              </>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;