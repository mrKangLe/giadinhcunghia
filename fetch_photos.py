import os
import json
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

def fetch_and_save():
    # Lấy token từ GitHub Secrets
    refresh_token = os.environ.get('G_REFRESH_TOKEN')
    client_id = os.environ.get('G_CLIENT_ID')
    client_secret = os.environ.get('G_CLIENT_SECRET')

    # Tạo đối tượng xác thực
    creds = Credentials(
        None,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=client_id,
        client_secret=client_secret,
    )

    # Kết nối API Google Photos
    service = build('photoslibrary', 'v1', credentials=creds, static_discovery=False)

    print("Đang lấy ảnh từ Google Photos...")
    
    # Lấy danh sách media items (ảnh)
    results = service.mediaItems().list(pageSize=10).execute()
    items = results.get('mediaItems', [])

    # Chuyển đổi dữ liệu sang định dạng Bố cần
    photos_data = []
    for item in items:
        photos_data.append({
            "id": item.get('id'),
            "url": item.get('productUrl'),
            "title": item.get('filename')
        })

    # Ghi vào file photos.json
    with open('photos.json', 'w', encoding='utf-8') as f:
        json.dump(photos_data, f, ensure_ascii=False, indent=2)
        
    print(f"Đã cập nhật {len(photos_data)} ảnh vào photos.json thành công!")

if __name__ == "__main__":
    fetch_and_save()