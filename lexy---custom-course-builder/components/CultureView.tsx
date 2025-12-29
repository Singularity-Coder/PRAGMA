
import React, { useState } from 'react';
import { BookRecommendation, CultureItem, CultureAsset } from '../types';

interface CultureViewProps {
  books?: BookRecommendation[];
  cultureItems?: CultureItem[];
  onSelectItem: (item: CultureItem | BookRecommendation) => void;
}

const CultureView: React.FC<CultureViewProps> = ({ books = [], cultureItems = [], onSelectItem }) => {
  const categories = [
    'Famous people',
    'Art & Masterpieces',
    'Books',
    'Movies & TV series',
    'Music & Artists',
    'Folklore & Traditions',
    'Icons & Landmarks',
    'Religion & Beliefs',
    'Festivals'
  ] as const;

  const renderCard = (item: CultureItem | BookRecommendation, category: string) => {
    const isBook = 'author' in item;
    const title = item.title;
    const description = item.description;
    const thumb = isBook ? (item as BookRecommendation).imageUrl : (item as CultureItem).thumbnailUrl;
    const subtitle = isBook ? `by ${(item as BookRecommendation).author}` : (item as CultureItem).subtitle;
    const platform = !isBook ? (item as CultureItem).platform || '' : 'Book';

    // If it's a "Test" or user-added item with assets but no explicit platform, use "MEDIA"
    const displayPlatform = platform || (('assets' in item && item.assets && item.assets.length > 0) ? 'MEDIA' : 'INFO');

    return (
      <div 
        key={item.id} 
        className="duo-card overflow-hidden group hover:border-[#ad46ff] transition-all flex flex-col cursor-pointer bg-white shrink-0 w-72 sm:w-80"
        onClick={() => onSelectItem(item)}
      >
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <img 
            src={thumb} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 right-4 bg-black/70 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase backdrop-blur-sm">
            {displayPlatform}
          </div>
        </div>
        <div className="p-5 space-y-1 flex-1 flex flex-col">
          <span className="text-[10px] font-black text-[#ad46ff] uppercase tracking-widest">{category}</span>
          <h3 className="text-lg font-black text-gray-800 leading-tight truncate">{title}</h3>
          {subtitle && <p className="text-[10px] font-bold text-gray-400 truncate">{subtitle}</p>}
          <p className="text-gray-500 font-bold text-xs line-clamp-2 mt-2">{description}</p>
        </div>
      </div>
    );
  };

  const renderSection = (category: typeof categories[number]) => {
    let items: (CultureItem | BookRecommendation)[] = [];
    
    if (category === 'Books') {
      items = books;
    } else {
      items = cultureItems.filter(item => item.category === category);
    }

    if (items.length === 0) return null;

    return (
      <div key={category} className="space-y-6">
        <div className="flex items-center justify-between px-2 border-l-4 border-[#ad46ff] pl-4">
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-widest">{category}</h2>
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{items.length} Items</span>
        </div>
        <div className="flex overflow-x-auto pb-6 gap-6 scrollbar-hide snap-x px-2 -mx-2">
          {items.map((item) => renderCard(item, category))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 space-y-16 animate-in fade-in slide-in-from-bottom duration-500 pb-32">
      <div className="text-left space-y-4">
        <h1 className="text-4xl font-black text-gray-800 tracking-tight">Culture Explorer</h1>
        <p className="text-lg text-gray-500 font-bold mt-1 max-w-2xl">
          Deepen your learning by discovering the cultural soul behind the language.
        </p>
      </div>

      <div className="space-y-20">
        {categories.map(renderSection)}
      </div>
    </div>
  );
};

/* --- CULTURE DETAIL VIEW OVERLAY --- */

export const CultureDetailView: React.FC<{ item: CultureItem | BookRecommendation; onClose: () => void }> = ({ item, onClose }) => {
  const [quizMode, setQuizMode] = useState(false);

  const renderAsset = (asset: CultureAsset, index: number) => {
    switch (asset.type) {
      case 'youtube':
        const getYouTubeId = (url: string) => {
          if (!url) return '';
          // Robust Regex for various YouTube URL formats
          const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

          const match = url.match(regExp);
          if (match && match[1] && match[1].length === 11) {
            return match[1];
          }
          // If match failed but input looks like a raw 11-char ID
          const trimmed = url.trim();
          if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('.')) {
            return trimmed;
          }
          return url;
        };
        const videoId = getYouTubeId(asset.value);
        // Clean redundant labeling
        const youtubeLabel = asset.name.toLowerCase().includes('youtube') ? asset.name : `YouTube: ${asset.name}`;
        
        return (
          <div key={index} className="w-full space-y-3">
            <div className="w-full aspect-video rounded-3xl overflow-hidden border-2 border-gray-100 shadow-xl bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={asset.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">{youtubeLabel}</p>
          </div>
        );
      case 'video':
        return (
          <div key={index} className="w-full space-y-3">
            <div className="w-full aspect-video rounded-3xl overflow-hidden border-2 border-gray-100 shadow-xl bg-black">
              <video src={asset.value} controls className="w-full h-full" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Video: {asset.name}</p>
          </div>
        );
      case 'image':
        return (
          <div key={index} className="w-full space-y-3">
            <div className="w-full rounded-3xl overflow-hidden border-2 border-gray-100 shadow-xl bg-white">
              <img src={asset.value} alt={asset.name} className="w-full object-contain bg-gray-50 max-h-[80vh]" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Image: {asset.name}</p>
          </div>
        );
      case 'audio':
        return (
          <div key={index} className="w-full p-8 bg-gradient-to-br from-purple-50 to-white rounded-[2.5rem] border-2 border-purple-100 flex flex-col items-center gap-6 shadow-sm">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-inner border-2 border-purple-50">
              🎵
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-black text-purple-800 leading-tight">{asset.name}</p>
              <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest">Audio Recording</p>
            </div>
            <audio src={asset.value} controls className="w-full custom-audio" />
          </div>
        );
      case 'pdf':
        const openPdf = () => {
          try {
            const base64Content = asset.value.split(',')[1] || asset.value;
            const byteCharacters = atob(base64Content);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setTimeout(() => URL.revokeObjectURL(url), 1000);
          } catch (e) {
            console.error("Failed to open PDF:", e);
            alert("Could not open PDF. The file may be corrupted or too large.");
          }
        };

        return (
          <div key={index} className="w-full group">
            <div
              onClick={openPdf}
              className="w-full p-8 bg-white rounded-[2.5rem] border-2 border-gray-100 flex items-center justify-between hover:border-red-400 hover:bg-red-50/30 transition-all shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  📄
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-gray-800 group-hover:text-red-700">{asset.name}</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PDF Document</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-red-100 text-red-600 p-2 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest">
                VIEW
              </div>
            </div>
          </div>
        );
      case 'link':
        return (
          <div key={index} className="w-full group">
            <a
              href={asset.value}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-8 bg-white rounded-[2.5rem] border-2 border-gray-100 flex items-center justify-between hover:border-blue-400 hover:bg-blue-50/30 transition-all shadow-sm"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🔗
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-gray-800 group-hover:text-blue-700">{asset.name}</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">External Resource</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-blue-100 text-blue-600 p-2 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest">
                OPEN
              </div>
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  if (quizMode) {
    return (
      <div className="fixed inset-0 z-[1000] bg-white flex flex-col animate-in fade-in duration-300">
        <div className="max-w-4xl mx-auto w-full p-6 flex items-center justify-between border-b-2 border-gray-100">
          <button onClick={() => setQuizMode(false)} className="text-3xl text-gray-400 hover:text-gray-600 font-bold transition-colors">✕</button>
          <div className="flex-1 mx-8 h-4 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 w-1/3 transition-all duration-500" />
          </div>
          <div className="text-purple-600 font-black">1/3</div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-10 space-y-10">
          <span className="text-8xl animate-bounce">🤔</span>
          <div className="text-center space-y-4 max-w-lg">
            <h2 className="text-3xl font-black text-gray-800">Knowledge Check: {item.title}</h2>
            <p className="text-xl font-bold text-gray-500 leading-relaxed">
              Based on the content you just explored, which of these is the most significant takeaway?
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 w-full max-w-md">
            {["Answer Option A", "Answer Option B", "Answer Option C"].map((opt, i) => (
              <button 
                key={i} 
                onClick={() => { alert("Correct! Great job."); setQuizMode(false); }}
                className="p-5 border-2 border-gray-100 rounded-2xl font-black text-gray-600 hover:border-purple-400 hover:bg-purple-50 transition-all text-left"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col animate-in fade-in duration-300">
      {/* Immersive Header - Truly end-to-end at the top */}
      <div className="w-full bg-white border-b-2 border-gray-50 px-4 py-4 md:px-10 flex items-center justify-between sticky top-0 z-[1010]">
        <div className="flex items-center gap-6">
          {/* Back Arrow Button */}
          <button 
            onClick={onClose}
            className="w-12 h-12 bg-gray-50 hover:bg-gray-100 rounded-2xl flex items-center justify-center text-xl transition-all shadow-sm active:scale-90"
          >
            ←
          </button>
          
          {/* Category & Title - Left Aligned */}
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#ad46ff] uppercase tracking-[0.2em] leading-none mb-1">
              {'category' in item ? (item as CultureItem).category : 'Culture Explorer'}
            </span>
            <h2 className="text-lg md:text-xl font-black text-gray-800 leading-tight truncate max-w-[150px] sm:max-w-xs md:max-w-lg">
              {item.title}
            </h2>
          </div>
        </div>

        {/* Removed TAKE QUIZ button from header as requested */}
        <div className="flex items-center">
          <div className="w-12 h-12" />
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
        <div className="flex flex-col lg:flex-row min-h-full">
          
          {/* Left Side: Media Gallery (Take 2/3 space) */}
          <div className="lg:w-2/3 p-4 md:p-10 space-y-10 lg:border-r-2 border-gray-100 bg-gray-50/10">
            {(!('assets' in item) || !item.assets || item.assets.length === 0) ? (
               <div className="space-y-6">
                  <div className="w-full rounded-[2.5rem] overflow-hidden border-2 border-gray-100 shadow-xl bg-white animate-in zoom-in duration-500">
                    <img 
                      src={'author' in item ? (item as BookRecommendation).imageUrl : (item as CultureItem).thumbnailUrl} 
                      className="w-full object-contain max-h-[75vh]" 
                      alt={item.title} 
                    />
                  </div>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest text-center">Featured Visual</p>
               </div>
            ) : (
              <div className="space-y-12 animate-in slide-in-from-bottom duration-500">
                {(item as CultureItem).assets?.map((asset, idx) => renderAsset(asset, idx))}
              </div>
            )}
            
            {/* Legacy Link Fallback - Only if no assets at all and mediaUrl exists */}
            {(!('assets' in item) || !item.assets?.length) && 'mediaUrl' in item && (item as any).mediaUrl && (
              <div className="pt-10 flex justify-center">
                <a 
                  href={(item as any).mediaUrl as string} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white border-2 border-gray-200 text-[#ad46ff] p-5 px-10 rounded-[2rem] font-black shadow-[0_6px_0_#f3f4f6] hover:bg-gray-50 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-xs"
                >
                  <span>📺</span> EXPLORE EXTERNAL CONTENT
                </a>
              </div>
            )}
          </div>

          {/* Right Side: Text Information (Take 1/3 space) */}
          <div className="lg:w-1/3 p-8 md:p-12 space-y-12 bg-white">
            <div className="space-y-6">
              <span className="px-3 py-1 bg-purple-50 text-[#ad46ff] rounded-full text-[11px] font-black uppercase tracking-widest">
                Information
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-gray-800 leading-tight tracking-tight">
                {item.title}
              </h1>
              {'author' in item && <p className="text-xl font-bold text-gray-500">by {item.author}</p>}
              {'subtitle' in item && (item as CultureItem).subtitle && (
                <p className="text-xl font-bold text-purple-400 leading-tight">{(item as CultureItem).subtitle}</p>
              )}
            </div>

            <div className="space-y-8">
              <div className="h-1.5 w-16 bg-[#ad46ff] rounded-full" />
              <p className="text-gray-600 text-lg md:text-xl font-bold leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>

            <div className="pt-12 border-t-2 border-gray-50 space-y-8">
              <div className="flex items-start gap-4 p-6 bg-yellow-50 rounded-[2rem] border-2 border-yellow-100 shadow-sm">
                 <span className="text-3xl">💡</span>
                 <p className="text-sm font-bold text-yellow-700 leading-relaxed">
                    Ready to test your knowledge? Take the cultural quiz and earn bonus gems!
                 </p>
              </div>
              <button 
                onClick={() => setQuizMode(true)}
                className="w-full p-6 bg-[#ad46ff] text-white rounded-[2rem] font-black shadow-[0_8px_0_#8439a3] hover:bg-[#8439a3] active:translate-y-2 active:shadow-none transition-all uppercase tracking-[0.2em] text-sm"
              >
                START CULTURAL QUIZ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CultureView;
