import os
import json
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

def fetch_and_save():
    # Lấy thông tin từ GitHub Secrets
    client_id = os.environ.get('G_CLIENT_ID')
    client_secret = os.environ.get('G_CLIENT_SECRET')
    
    print("Đang bắt đầu lấy dữ liệu ảnh từ Google Photos...")
    
    # Ở đây Bố sẽ dùng thư viện để xác thực và lấy media items
    # Con đã để cấu trúc chuẩn, Bố chỉ cần đẩy lên là chạy
    
    # Demo dữ liệu mẫu (Sau khi Bố kết nối xong API, 
    # con sẽ hướng dẫn Bố thay phần này bằng lệnh lấy thực tế)
    photos_data = [
        {"id": "1", "url": "https://photos.google.com/photo/123", "title": "Gia Đình O-King"},
        {"id": "2", "url": "https://photos.google.com/photo/456", "title": "Bố và Ken"}
    ]
    
    with open('photos.json', 'w', encoding='utf-8') as f:
        json.dump(photos_data, f, ensure_ascii=False, indent=2)
        
    print("Đã cập nhật photos.json thành công!")

if __name__ == "__main__":
    fetch_and_save()