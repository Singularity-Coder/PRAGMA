
import React, { useState } from 'react';
import { CourseData } from '../types';

interface UploadManagerProps {
  onCourseLoaded: (course: CourseData, mediaMap: Map<string, string>) => void;
}

const UploadManager: React.FC<UploadManagerProps> = ({ onCourseLoaded }) => {
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJsonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setJsonFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!jsonFile) {
      setError("Please select a course JSON file.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const jsonText = await jsonFile.text();
      const courseData: CourseData = JSON.parse(jsonText);
      // Media map is empty as folder upload is removed per request
      onCourseLoaded(courseData, new Map());
    } catch (err) {
      console.error(err);
      setError("Failed to process JSON file. Ensure it follows the required format.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-0 bg-transparent space-y-4">
      <div className="space-y-2">
        <input 
          type="file" 
          accept=".json"
          onChange={handleJsonChange}
          className="w-full p-4 border-2 border-dashed rounded-2xl border-gray-100 focus:border-[#58cc02] outline-none text-xs font-bold text-gray-400 bg-gray-50/50 cursor-pointer"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold border-2 border-red-100 flex items-center gap-3">
          <span>⚠️</span>
          {error}
        </div>
      )}

      <div className="pt-2">
        <button
          onClick={handleUpload}
          disabled={isLoading || !jsonFile}
          className={`w-full p-4 rounded-2xl font-extrabold text-white transition-all transform active:scale-95 uppercase tracking-wider text-xs ${
            !jsonFile ? 'bg-gray-200 cursor-not-allowed' : 'bg-[#1cb0f6] border-b-4 border-[#1899d6]'
          }`}
        >
          {isLoading ? 'Processing...' : 'Import Course'}
        </button>
      </div>
    </div>
  );
};

export default UploadManager;
