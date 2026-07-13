'use client';

import React, { useState, useMemo, useEffect } from 'react';
import myPhotosRaw from './photos.json';

// Cấu trúc dữ liệu ảnh
interface PhotoItem {
  src: string;
  categories: string[];
  caption?: string;
  comments?: string[];
}

// Cấu trúc thông tin thành viên (Ngày sinh format: 'Tháng-Ngày', Năm sinh để tính tuổi)
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => { setIsClient(true); }, []);

  // Logic tự động kiểm tra sinh nhật hôm nay và tính số tuổi thật
  const birthdayInfo = useMemo(() => {
    if (!isClient) return null;
    const today = new Date();
    const currentMonthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const currentYear = today.getFullYear();
    
    const match = Object.entries(FAMILY_MEMBERS).find(([_, info]) => info.date === currentMonthDay);
    if (match) {
      const name = match[0];
      const age = currentYear - match[1].birthYear; // Tự động tính tuổi
      return { name, age };
    }
    return null;
  }, [isClient]);

  // Tự động nhảy sang danh mục của người có sinh nhật hôm nay
  useEffect(() => {
    if (birthdayInfo) {
      setActiveTab(birthdayInfo.name);
    }
  }, [birthdayInfo]);

  // Chuẩn hóa dữ liệu từ file JSON - GIỮ NGUYÊN BẢN CHUẨN CỦA BỐ
  const photos: PhotoItem[] = useMemo(() => {
    return (myPhotosRaw as any[]).map((item: any) => {
      if (typeof item === 'string') {
        return { src: item, categories: ['Tất Cả'], caption: '', comments: [] };
      }
      return {
        src: item.src || '',
        categories: item.categories || ['Tất Cả'],
        caption: item.caption || '',
        comments: item.comments || []
      };
    }).filter(p => p.src && p.src.length > 5);
  }, []);

  // Tự động gom danh sách Tab danh mục
  const allTabs = useMemo(() => {
    const tabs = new Set<string>(['Tất Cả']);
    photos.forEach(photo => {
      photo.categories.forEach(cat => { if (cat) tabs.add(cat); });
    });
    if (birthdayInfo) tabs.add(birthdayInfo.name);
    return Array.from(tabs);
  }, [photos, birthdayInfo]);

  // Lọc ảnh theo Tab
  const filteredPhotos = useMemo(() => {
    if (activeTab === 'Tất Cả') return photos;
    return photos.filter(photo => photo.categories.includes(activeTab));
  }, [activeTab, photos]);

  const selectedPhoto = selectedIndex !== null ? filteredPhotos[selectedIndex] : null;

  const handleNext = () => { if (selectedIndex !== null) setSelectedIndex((selectedIndex + 1) % filteredPhotos.length); };
  const handlePrev = () => { if (selectedIndex !== null) setSelectedIndex((selectedIndex - 1 + filteredPhotos.length) % filteredPhotos.length); };

  // Điều khiển bằng phím mũi tên bàn phím
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredPhotos]);

  // Vuốt màn hình điện thoại
  const onTouchStart = (e: React.TouchEvent) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e: React.TouchEvent) => { setTouchEnd(e.targetTouches[0].clientX); };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) handleNext();
    else if (distance < -50) handlePrev();
  };

  if (!isClient) return <div className="min-h-screen bg-slate-950" />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-12 select-none relative overflow-hidden">
      
      {/* BANNER TỰ ĐỘNG HIỂN THỊ CHÚC MỪNG SINH NHẬT KÈM SỐ TUỔI THẬT CỦA THÀNH VIÊN */}
      {birthdayInfo && (
        <div className="max-w-7xl mx-auto mb-8 p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-rose-500/10 to-transparent border border-amber-500/30 relative overflow-hidden animate-pulse">
          <div className="absolute -right-10 -top-10 text-8xl opacity-10 pointer-events-none">🎂</div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 bg-amber-400 text-slate-950 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                🎉 GIA ĐÌNH SỰ KIỆN
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-amber-200">
                CHÚC MỪNG {birthdayInfo.name.toUpperCase()} TRÒN {birthdayInfo.age} TUỔI! 🌟
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Hôm nay cả nhà cùng chúc mừng cột mốc tuổi mới thật ý nghĩa của {birthdayInfo.name}. Hãy cùng ngắm nhìn và lưu giữ lại những khoảnh khắc tuyệt vời nhất nhé!
              </p>
            </div>
            <div className="text-amber-400 font-mono text-sm tracking-widest bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800">
              Mừng tuổi {birthdayInfo.age} ✨
            </div>
          </div>
        </div>
      )}

      {/* Header trang lịch lãm */}
      <header className="max-w-7xl mx-auto mb-8 sm:mb-12 text-center sm:text-left">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent mb-2 sm:mb-3">
          HUY O-KING ECOSYSTEM
        </h1>
        <p className="text-slate-400 text-xs sm:text-base max-w-xl">
          Kho lưu trữ khoảnh khắc gia đình dạng Pinterest nghệ thuật, đồng bộ tự động và ngăn nắp.
        </p>
      </header>

      {/* Thanh Menu chọn Danh mục (Tabs Filter) */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8 overflow-x-auto scrollbar-none flex gap-2.5 pb-2 border-b border-slate-800">
        {allTabs.map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSelectedIndex(null);
            }}
            className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap relative ${
              activeTab === tab
                ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 scale-105'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {tab}
            {/* Chấm tròn đỏ nhấp nháy báo hiệu sự kiện */}
            {birthdayInfo && tab === birthdayInfo.name && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            )}
          </button>
        ))}
      </div>

      {/* GIAO DIỆN PINTEREST CHUẨN CỦA BỐ */}
      <main className="max-w-7xl mx-auto">
        <div className="columns-2 md:columns-4 gap-4 space-y-4">
          {filteredPhotos.map((photo, index) => (
            <div
              key={index}
              onClick={() => setSelectedIndex(index)}
              className="break-inside-avoid cursor-pointer group overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl"
            >
              <img
                src={photo.src}
                alt={photo.caption || `Ảnh gia đình ${index + 1}`}
                loading="lazy"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300 ease-out"
              />
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-24 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
            <p className="text-slate-500 text-sm sm:text-base">Danh mục này hiện chưa có ảnh nào được đồng bộ.</p>
          </div>
        )}
      </main>

      {/* GIAO DIỆN PHÓNG TO ẢNH (LIGHTBOX ĐẦY ĐỦ THÔNG TIN VÀ CẢM ỨNG) */}
      {selectedPhoto && selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col md:flex-row items-center justify-center p-4 sm:p-8 touch-none"
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
          onClick={() => setSelectedIndex(null)}
        >
          {/* Nút đóng */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 z-50 p-2.5 sm:p-3 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {/* Nút chuyển ảnh trước */}
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300 hidden md:block"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          {/* Nút chuyển ảnh tiếp theo */}
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-[420px] top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300 hidden md:block"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Khung hiển thị ảnh */}
          <div className="flex-1 w-full h-[50vh] md:h-full flex flex-col items-center justify-center relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPhoto.src}
              alt="Phóng to"
              key={selectedPhoto.src}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-all duration-300"
            />
            <div className="text-slate-500 text-xs mt-2 md:hidden">
              {selectedIndex + 1} / {filteredPhotos.length}
            </div>
          </div>

          {/* Khung Sidebar hiển thị thông tin và bình luận */}
          <div className="w-full md:w-[400px] h-[35vh] md:h-full md:border-l border-slate-800/80 p-4 sm:p-6 flex flex-col justify-between bg-slate-900/40 md:bg-transparent rounded-2xl md:rounded-none mt-2 md:mt-0" onClick={(e) => e.stopPropagation()}>
            <div className="overflow-y-auto space-y-5 flex-1 pr-2 scrollbar-thin">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80 mb-1">Ghi nhớ khoảnh khắc</h3>
                <p className="text-slate-200 text-sm sm:text-base font-medium leading-relaxed">
                  {selectedPhoto.caption || "Khoảnh khắc gia đình chưa có chú thích mô tả."}
                </p>
              </div>

              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Thành viên xuất hiện</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPhoto.categories.filter(c => c !== 'Tất Cả').map(cat => (
                    <span key={cat} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-medium text-slate-300">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Lời nhắn từ gia đình</h3>
                <div className="space-y-2">
                  {selectedPhoto.comments && selectedPhoto.comments.map((comment, cIdx) => {
                    const parts = comment.split(':');
                    return (
                      <div key={cIdx} className="bg-slate-900/80 border border-slate-800/60 p-2.5 rounded-xl text-xs">
                        <span className="font-bold text-amber-300 block mb-0.5">{parts[0]}</span>
                        <span className="text-slate-300 leading-relaxed">{parts.slice(1).join(':')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="text-[9px] text-slate-600 text-center pt-2 border-t border-slate-900/60">
              Huy O-King Digital Album Portfolio System
            </div>
          </div>
        </div>
      )}
    </div>
  );
}