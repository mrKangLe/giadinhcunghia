'use client';

import React, { useState, useMemo, useEffect } from 'react';
import myPhotosRaw from './photos.json';

interface PhotoItem {
  src: string;
  categories: string[];
  caption?: string;
  comments?: string[];
}

interface MemberInfo {
  date: string;
  birthYear: number;
}

const FAMILY_MEMBERS: { [key: string]: MemberInfo } = {
  'Mickey': { date: '07-13', birthYear: 2020 },
  'Ken': { date: '10-31', birthYear: 2012 },
  'Kin': { date: '07-03', birthYear: 2007 },
  'Mẹ Zún': { date: '03-18', birthYear: 1992 },
  'Bố Huy': { date: '06-13', birthYear: 1983 },
  'Cụ Nghĩa': { date: '05-05', birthYear: 1951 },
  'Cụ Tình': { date: '06-10', birthYear: 1955 },
  'Chú Hiệu': { date: '06-09', birthYear: 1990 }
};

export default function PhotoGallery() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('Tất Cả');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  useEffect(() => { setIsClient(true); }, []);

  const birthdayInfo = useMemo(() => {
    if (!isClient) return null;
    const today = new Date();
    const currentMonthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const currentYear = today.getFullYear();
    const match = Object.entries(FAMILY_MEMBERS).find(([_, info]) => info.date === currentMonthDay);
    if (match) {
      return { name: match[0], age: currentYear - match[1].birthYear };
    }
    return null;
  }, [isClient]);

  const photos: PhotoItem[] = useMemo(() => {
    return (myPhotosRaw as any[]).map((item: any) => {
      if (typeof item === 'string') return { src: item, categories: ['Tất Cả'], caption: '', comments: [] };
      return {
        src: item.src || '',
        categories: item.categories || ['Tất Cả'],
        caption: item.caption || '',
        comments: item.comments || []
      };
    }).filter(p => p.src && p.src.length > 5);
  }, []);

  const allTabs = useMemo(() => {
    const tabs = new Set<string>(['Tất Cả']);
    photos.forEach(photo => photo.categories.forEach(cat => { if (cat) tabs.add(cat); }));
    return Array.from(tabs);
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    if (activeTab === 'Tất Cả') return photos;
    return photos.filter(photo => photo.categories.includes(activeTab));
  }, [activeTab, photos]);

  if (!isClient) return <div className="min-h-screen bg-slate-950" />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      <header className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl font-extrabold text-amber-400 mb-2">HUY O-KING ECOSYSTEM</h1>
        <p className="text-slate-400">Kho lưu trữ khoảnh khắc gia đình</p>
      </header>

      {birthdayInfo && (
        <div className="max-w-7xl mx-auto mb-8 p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30">
          <h2 className="text-2xl font-black text-amber-200">🎂 Chúc mừng {birthdayInfo.name} tròn {birthdayInfo.age} tuổi!</h2>
        </div>
      )}

      <div className="max-w-7xl mx-auto mb-8 flex gap-3 overflow-x-auto pb-2">
        {allTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-bold ${activeTab === tab ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto columns-2 md:columns-4 gap-4 space-y-4">
        {filteredPhotos.map((photo, index) => (
          <div 
            key={index} 
            className="break-inside-avoid overflow-hidden rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:opacity-80 transition"
            onClick={() => setSelectedPhoto(photo)}
          >
            <img src={photo.src} alt="Ảnh gia đình" className="w-full h-auto object-cover" />
          </div>
        ))}
      </main>

      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedPhoto.src} 
              className="max-h-[70vh] w-full object-contain rounded-lg" 
              alt="Ảnh chi tiết" 
            />
            {selectedPhoto.caption && (
              <p className="mt-4 text-center text-lg text-white font-medium bg-white/10 p-4 rounded-xl">
                {selectedPhoto.caption}
              </p>
            )}
          </div>
          <div className="flex gap-4 mt-6">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = filteredPhotos.findIndex(p => p.src === selectedPhoto.src);
                const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
                setSelectedPhoto(filteredPhotos[prevIndex]);
              }}
              className="px-6 py-2 bg-slate-800 rounded-full text-white font-bold"
            >
              Trước
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = filteredPhotos.findIndex(p => p.src === selectedPhoto.src);
                const nextIndex = (currentIndex + 1) % filteredPhotos.length;
                setSelectedPhoto(filteredPhotos[nextIndex]);
              }}
              className="px-6 py-2 bg-amber-500 rounded-full text-slate-950 font-bold"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}