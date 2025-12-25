
import React, { useMemo } from 'react';
import { Unit, Lesson } from '../types';
import Mascot from './Mascot';

interface LessonTreeProps {
  units: Unit[];
  onStartLesson: (lesson: Lesson) => void;
  selectedMascotId: string;
}

const LessonTree: React.FC<LessonTreeProps> = ({ units, onStartLesson, selectedMascotId }) => {
  const globalCurrentLessonId = useMemo(() => {
    let lastCompleted = null;
    for (const unit of units) {
      for (const lesson of unit.lessons) {
        if (lesson.status === 'available') return lesson.id;
        if (lesson.status === 'completed') lastCompleted = lesson.id;
      }
    }
    return lastCompleted || (units[0]?.lessons[0]?.id);
  }, [units]);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-24">
      {units.map((unit, unitIdx) => (
        <div key={unit.id} className="relative space-y-16">
          {/* Unit Header */}
          <div className="w-full">
            <div className={`${unit.color} p-8 px-12 rounded-3xl text-white shadow-xl relative overflow-hidden group border-b-8 border-black/10`}>
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                 <span className="text-9xl">🎯</span>
               </div>
               <div className="relative z-10">
                  <h2 className="text-lg font-black opacity-80 uppercase tracking-[0.3em] mb-2">
                    Unit {unitIdx + 1}
                  </h2>
                  <h1 className="text-4xl font-black">{unit.title}</h1>
               </div>
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-y-20 relative px-4">
            {unit.lessons.map((lesson, idx) => {
              const isCharacterHere = lesson.id === globalCurrentLessonId;
              const isCompleted = lesson.status === 'completed';
              const isLocked = lesson.status === 'locked';
              const isLastInUnit = idx === unit.lessons.length - 1;

              const isEndOfRowDesktop = (idx + 1) % 5 === 0;
              const isEndOfRowMobile = (idx + 1) % 2 === 0;

              return (
                <div key={lesson.id} className="relative flex justify-center items-center h-24">
                  {/* Connecting Lines - Themed to Unit color */}
                  {!isLastInUnit && (
                    <>
                      {/* Desktop Line */}
                      <div className={`hidden md:block absolute h-3 bg-gray-200 -z-10 top-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${
                        isCompleted ? `${unit.color} opacity-40` : ''
                      } ${
                        isEndOfRowDesktop 
                        ? 'w-3 h-24 top-full left-1/2 -translate-x-1/2' 
                        : 'w-full left-1/2'
                      }`} />

                      {/* Mobile Line */}
                      <div className={`md:hidden absolute h-2 bg-gray-200 -z-10 top-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${
                        isCompleted ? `${unit.color} opacity-40` : ''
                      } ${
                        isEndOfRowMobile 
                        ? 'w-2 h-24 top-full left-1/2 -translate-x-1/2' 
                        : 'w-full left-1/2'
                      }`} />
                    </>
                  )}

                  {/* Inter-unit connecting line */}
                  {isLastInUnit && unitIdx < units.length - 1 && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-32 bg-gray-100 -z-20 rounded-full" />
                  )}

                  <div className="relative group">
                    {/* Character/Mascot Indicator */}
                    {isCharacterHere && (
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 drop-shadow-xl animate-bounce pointer-events-none">
                        <Mascot id={selectedMascotId} />
                        <div className="w-10 h-2 bg-black/10 rounded-[100%] mx-auto mt-2 blur-[1px]" />
                      </div>
                    )}

                    {/* Lesson Button - Themed to Unit color */}
                    <button
                      disabled={isLocked}
                      onClick={() => onStartLesson(lesson)}
                      className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 relative z-10 border-b-[6px] md:border-b-[8px] ${
                        isLocked
                          ? 'bg-gray-100 border-gray-200'
                          : `${unit.color} border-black/20`
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        {isCompleted ? (
                          <span className="text-4xl md:text-5xl text-white drop-shadow-md">✓</span>
                        ) : isLocked ? (
                          <span className="text-2xl md:text-3xl text-gray-400">🔒</span>
                        ) : (
                          <span className="text-3xl md:text-4xl text-white drop-shadow-md">⭐</span>
                        )}
                      </div>
                    </button>

                    {/* Active Pulsing Ring */}
                    {!isLocked && !isCompleted && (
                      <div className={`absolute inset-0 -m-2 border-4 rounded-full animate-pulse pointer-events-none opacity-40 ${
                        unit.color.replace('bg-', 'border-')
                      }`} />
                    )}

                    {/* Tooltip */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 opacity-0 group-hover:opacity-100 transition-all bg-white duo-card p-4 shadow-2xl z-50 w-64 pointer-events-none text-center rounded-2xl border-2 border-gray-100 translate-y-2 group-hover:translate-y-0">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t-2 border-l-2 border-gray-100" />
                      <p className="font-black text-gray-800 text-sm uppercase tracking-wider mb-1">
                        {isLocked ? "Keep Learning!" : lesson.title}
                      </p>
                      <p className="text-xs text-gray-400 font-bold leading-relaxed">{lesson.description}</p>
                      {!isLocked && !isCompleted && (
                        <div className="mt-3 text-[10px] font-black text-blue-500 uppercase flex items-center justify-center gap-1">
                          <span className="animate-bounce">⚡</span> Play Now
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LessonTree;
