import fs from 'fs';
import path from 'path';

// Định nghĩa kiểu dữ liệu cho ảnh
type Photo = {
  id: string;
  url: string;
  title: string;
};

export default function GalleryPage() {
  // Đọc file photos.json từ thư mục gốc
  const filePath = path.join(process.cwd(), 'photos.json');
  
  // Kiểm tra xem file có tồn tại không để tránh lỗi khi build
  if (!fs.existsSync(filePath)) {
    return <main style={{ padding: '2rem', textAlign: 'center' }}>Chưa có dữ liệu ảnh.</main>;
  }

  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const photos: Photo[] = JSON.parse(jsonData);

  return (
    <main style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '4rem 2rem', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
    }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '300', color: '#1a1a1a', marginBottom: '1rem' }}>
          O-King Family Gallery
        </h1>
        <p style={{ color: '#666', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem' }}>
          Khoảnh khắc gia đình quý giá
        </p>
      </header>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '2.5rem' 
      }}>
        {photos.map((photo) => (
          <article key={photo.id} style={{ 
            background: '#fff',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}>
            <div style={{ 
              height: '300px', 
              background: '#f8f8f8', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: '4px',
              marginBottom: '1rem',
              border: '1px solid #f0f0f0'
            }}>
              <span style={{ color: '#aaa' }}>{photo.title}</span>
            </div>
            
            <h2 style={{ fontSize: '1.1rem', fontWeight: '500', margin: '0 0 0.5rem 0', color: '#333' }}>
              {photo.title}
            </h2>
            <a 
              href={photo.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#000', fontSize: '0.85rem', textDecoration: 'none', borderBottom: '1px solid #000' }}
            >
              Xem chi tiết
            </a>
          </article>
        ))}
      </div>
    </main>
  );
}