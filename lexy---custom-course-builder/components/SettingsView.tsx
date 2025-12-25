
import React, { useState } from 'react';
import UploadManager from './UploadManager';
import { CourseData, ProficiencyLevel, NotificationSettings } from '../types';
import { PROFICIENCY_LEVELS, MASCOTS } from '../constants';
import Mascot from './Mascot';

interface SettingsViewProps {
  availableCourses: CourseData[];
  onCourseSwitch: (courseId: string) => void;
  onCourseLoaded: (course: CourseData, mediaMap: Map<string, string>) => void;
  onResetProgress: () => void;
  currentProficiency: ProficiencyLevel;
  onUpdateProficiency: (level: ProficiencyLevel) => void;
  currentCourseId: string;
  selectedMascotId: string;
  onUpdateMascot: (mascotId: string) => void;
  onCreateCourse?: () => void;
  notificationSettings: NotificationSettings;
  onUpdateNotifications: (settings: NotificationSettings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  availableCourses,
  onCourseSwitch,
  onCourseLoaded, 
  onResetProgress, 
  currentProficiency, 
  onUpdateProficiency,
  currentCourseId,
  selectedMascotId,
  onUpdateMascot,
  onCreateCourse,
  notificationSettings,
  onUpdateNotifications
}) => {
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const LanguageSelector = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {availableCourses.map((course) => (
        <button
          key={course.id}
          onClick={() => {
            onCourseSwitch(course.id);
            setIsLanguageModalOpen(false);
          }}
          className={`p-5 rounded-2xl flex items-center space-x-4 border-2 transition-all group ${
            currentCourseId === course.id 
              ? 'bg-purple-50 border-[#ad46ff] shadow-[0_4px_0_#ad46ff]' 
              : 'bg-white border-gray-100 hover:border-gray-300 shadow-[0_4px_0_#e5e5e5]'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-sm">
            🌐
          </div>
          <div className="text-left">
            <p className="font-black text-gray-800">{course.language}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase">{course.courseTitle}</p>
          </div>
          {currentCourseId === course.id && (
            <div className="ml-auto text-[#ad46ff] font-black">✓</div>
          )}
        </button>
      ))}
    </div>
  );

  const togglePreference = (key: keyof NotificationSettings) => {
    onUpdateNotifications({
      ...notificationSettings,
      [key]: !notificationSettings[key]
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 animate-in fade-in slide-in-from-bottom duration-500 pb-32">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-gray-800 tracking-tight">Settings</h1>
        <p className="text-lg text-gray-500 font-bold mt-1">Customize your learning experience and manage course data.</p>
      </div>

      {/* Language Switcher Section */}
      <section className="space-y-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-black text-gray-700 uppercase tracking-widest">My Languages</h2>
          <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
        </div>
        
        <div className="duo-card p-6 bg-purple-50/30 border-purple-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-4xl shadow-sm">🌐</div>
            <div>
              <p className="text-xs font-black text-purple-400 uppercase tracking-widest">Active Language</p>
              <h3 className="text-2xl font-black text-purple-700">{availableCourses.find(c => c.id === currentCourseId)?.language || 'None'}</h3>
            </div>
          </div>
          <button 
            onClick={() => setIsLanguageModalOpen(true)}
            className="w-full md:w-auto p-4 px-8 rounded-xl font-black bg-white text-[#ad46ff] border-2 border-[#ad46ff] hover:bg-purple-50 transition-all shadow-[0_4px_0_#ad46ff] active:translate-y-1 active:shadow-none"
          >
            SWITCH LANGUAGE
          </button>
        </div>

        {/* Modal Popup */}
        {isLanguageModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full space-y-8 shadow-2xl animate-in zoom-in duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-gray-800">Select Language</h2>
                <button onClick={() => setIsLanguageModalOpen(false)} className="text-2xl text-gray-400 hover:text-gray-600 font-bold">✕</button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <LanguageSelector />
              </div>
              <button 
                onClick={() => setIsLanguageModalOpen(false)}
                className="w-full p-4 rounded-2xl font-black text-white bg-[#ad46ff] border-b-4 border-[#8439a3] active:translate-y-1 active:border-b-0 transition-all uppercase tracking-widest"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Proficiency Stage Selection */}
      <section className="space-y-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-black text-gray-700 uppercase tracking-widest">Learning Stage</h2>
          <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PROFICIENCY_LEVELS.map((info) => (
            <button
              key={info.level}
              onClick={() => onUpdateProficiency(info.level)}
              className={`duo-card p-4 flex flex-col items-center text-center space-y-3 transition-all transform active:scale-95 group border-2 ${
                currentProficiency === info.level
                  ? 'border-[#ad46ff] bg-purple-50 shadow-[0_4px_0_#ad46ff]'
                  : 'border-gray-100 hover:border-gray-300 shadow-[0_4px_0_#e5e5e5]'
              }`}
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white">
                <img src={info.imageUrl} className="w-full h-full object-cover" alt={info.name} />
              </div>
              <div>
                <h3 className={`font-black text-sm ${currentProficiency === info.level ? 'text-[#ad46ff]' : 'text-gray-700'}`}>
                  {info.name}
                </h3>
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                  {info.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Mascot Selection */}
      <section className="space-y-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-black text-gray-700 uppercase tracking-widest">Choose Your Mascot</h2>
          <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MASCOTS.map((mascot) => (
            <button
              key={mascot.id}
              onClick={() => onUpdateMascot(mascot.id)}
              className={`duo-card p-6 flex flex-col items-center text-center space-y-3 transition-all transform active:scale-95 group border-2 ${
                selectedMascotId === mascot.id
                  ? 'border-[#ad46ff] bg-purple-50 shadow-[0_4px_0_#ad46ff]'
                  : 'border-gray-100 hover:border-gray-300 shadow-[0_4px_0_#e5e5e5]'
              }`}
            >
              <div className="mb-2 group-hover:scale-110 transition-transform">
                <Mascot id={mascot.id} size={50} />
              </div>
              <h3 className={`font-black text-sm ${selectedMascotId === mascot.id ? 'text-[#ad46ff]' : 'text-gray-700'}`}>
                {mascot.name}
              </h3>
              {selectedMascotId === mascot.id && (
                <div className="text-[10px] font-black text-[#ad46ff] uppercase">Active</div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Course Management */}
      <section className="space-y-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-black text-gray-700 uppercase tracking-widest">Course Management</h2>
          <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create New Course Card */}
          <div className="duo-card p-8 bg-purple-50 border-purple-200/50 flex flex-col justify-between">
             <div className="space-y-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border-2 border-purple-200 text-[#ad46ff]">🛠️</div>
                <div>
                   <h3 className="text-xl font-black text-[#ad46ff]">Build New Course</h3>
                   <p className="text-sm text-[#ad46ff]/70 font-bold leading-relaxed">Design your own curriculum step-by-step with characters, words, and grammar.</p>
                </div>
             </div>
             <button 
              onClick={onCreateCourse}
              className="mt-8 p-4 bg-[#ad46ff] text-white rounded-2xl font-black shadow-[0_4px_0_#8439a3] hover:scale-105 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-xs"
             >
                CREATE COURSE
             </button>
          </div>

          {/* Import JSON Card */}
          <div className="duo-card p-8 bg-white flex flex-col justify-between">
             <div className="space-y-4">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm border-2 border-gray-100">📂</div>
                <div>
                   <h3 className="text-xl font-black text-gray-700">Import JSON</h3>
                   <p className="text-sm text-gray-400 font-bold leading-relaxed">Upload a .json file containing course data to instantly add it to your library.</p>
                </div>
             </div>
             <div className="mt-8">
                <UploadManager onCourseLoaded={onCourseLoaded} />
             </div>
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="space-y-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-black text-gray-700 uppercase tracking-widest">Preferences</h2>
          <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="duo-card p-6 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-black text-gray-800">Sound Effects</h3>
              <p className="text-xs text-gray-400 font-bold">Play sounds during lessons</p>
            </div>
            <button 
              onClick={() => togglePreference('soundEnabled')}
              className={`w-14 h-8 rounded-full relative transition-colors ${notificationSettings.soundEnabled ? 'bg-purple-50' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full transition-all shadow-sm ${notificationSettings.soundEnabled ? 'right-1 bg-[#ad46ff]' : 'left-1 bg-white'}`} />
            </button>
          </div>
          <div className="duo-card p-6 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-black text-gray-800">Motivational Messages</h3>
              <p className="text-xs text-gray-400 font-bold">Show cheers from characters</p>
            </div>
            <button 
              onClick={() => togglePreference('motivationalAlerts')}
              className={`w-14 h-8 rounded-full relative transition-colors ${notificationSettings.motivationalAlerts ? 'bg-purple-50' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full transition-all shadow-sm ${notificationSettings.motivationalAlerts ? 'right-1 bg-[#ad46ff]' : 'left-1 bg-white'}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-black text-red-500 uppercase tracking-widest">Danger Zone</h2>
          <div className="h-1 flex-1 bg-red-50 rounded-full"></div>
        </div>
        <div className="duo-card border-red-100 p-8 flex flex-col md:flex-row items-center justify-between bg-red-50/30">
          <div className="text-center md:text-left space-y-2 mb-6 md:mb-0">
            <h3 className="text-xl font-black text-red-600">Reset All Progress</h3>
            <p className="text-sm text-red-400 font-bold max-w-sm">
              This will permanently delete your XP, streaks, achievements, and saved words.
            </p>
          </div>
          <button 
            onClick={() => {
              if (confirm("Are you absolutely sure? All progress will be lost!")) {
                onResetProgress();
              }
            }}
            className="p-4 px-10 rounded-2xl font-black text-white bg-red-500 border-b-4 border-red-700 active:translate-y-1 active:border-b-0 transition-all uppercase tracking-widest text-xs"
          >
            Reset Progress
          </button>
        </div>
      </section>
    </div>
  );
};

export default SettingsView;
