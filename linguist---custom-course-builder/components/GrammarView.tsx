
import React from 'react';
import { GrammarLesson } from '../types';

interface GrammarViewProps {
  lessons?: GrammarLesson[];
}

const GrammarView: React.FC<GrammarViewProps> = ({ lessons = [] }) => {
  if (lessons.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6 text-left space-y-6">
        <span className="text-7xl">📚</span>
        <h1 className="text-4xl font-black text-gray-800">Grammar Lab</h1>
        <p className="text-xl text-gray-500 font-bold max-w-lg mx-auto md:mx-0">
          No grammar lessons found in this course. Grammar modules are added by course creators.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-12 animate-in fade-in duration-500 pb-32">
      <div className="text-left space-y-4">
        <h1 className="text-5xl font-black text-gray-800">Grammar Lab</h1>
        <p className="text-xl text-gray-500 font-bold max-w-2xl leading-relaxed">
          The skeleton of language. Understand the rules to bend the words to your will.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="duo-card p-10 bg-white hover:border-[#ce82ff] transition-all flex flex-col md:flex-row gap-10">
            <div className="md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
              <div className="w-16 h-16 bg-[#ce82ff] text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                📝
              </div>
              <h2 className="text-3xl font-black text-gray-800 leading-tight">{lesson.title}</h2>
              <div className="px-3 py-1 bg-purple-50 text-[#ce82ff] rounded-full text-xs font-black uppercase tracking-widest">
                Structure
              </div>
            </div>

            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">The Rule</h3>
                <p className="text-xl font-bold text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-2xl shadow-inner">
                  {lesson.content}
                </p>
              </div>

              {lesson.examples && lesson.examples.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Examples</h3>
                  <div className="space-y-3">
                    {lesson.examples.map((ex, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 border-l-4 border-[#ce82ff] bg-purple-50/30 rounded-r-xl">
                        <span className="text-xl">✨</span>
                        <p className="font-bold text-gray-700">{ex}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="duo-card p-12 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-100 flex flex-col md:flex-row items-center gap-10">
        <div className="text-7xl">🧠</div>
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-purple-800">Language Logic</h3>
          <p className="text-purple-600 font-bold leading-relaxed">
            Don't just memorize — understand. These rules are the foundation that allows you to express complex thoughts and emotions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GrammarView;
