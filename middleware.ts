import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const password = request.cookies.get('family_password');
  const ADMIN_PASSWORD = "555155"; // Mật khẩu mới của bố

  if (password?.value === ADMIN_PASSWORD) return NextResponse.next();

  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head><meta charset="UTF-8"><style>
        body { background: #f2f2f7; font-family: -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .title { font-size: 24px; font-weight: 600; margin-bottom: 20px; color: #1c1c1e; }
        .dots { display: flex; gap: 10px; margin-bottom: 40px; }
        .dot { width: 14px; height: 14px; border-radius: 50%; border: 2px solid #8e8e93; }
        .dot.filled { background: #1c1c1e; }
        .grid { display: grid; grid-template-columns: repeat(3, 80px); gap: 20px; justify-items: center; }
        .btn { width: 80px; height: 80px; border-radius: 50%; background: #e5e5ea; border: none; font-size: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #1c1c1e; }
        .btn:active { background: #c7c7cc; }
        .zero-container { display: flex; justify-content: center; gap: 20px; margin-top: 20px; }
      </style></head>
      <body>
        <div class="title">Album Gia Đình</div>
        <div class="dots" id="dots">${Array(6).fill('<div class="dot"></div>').join('')}</div>
        <form method="POST" action="/api/login" id="pinForm">
            <input type="hidden" name="password" id="pinInput">
            <div class="grid">
                ${[1,2,3,4,5,6,7,8,9].map(n => `<button type="button" class="btn" onclick="addDigit(${n})">${n}</button>`).join('')}
            </div>
            <div class="zero-container">
                <button type="button" class="btn" onclick="addDigit(0)">0</button>
                <button type="button" class="btn" style="background:transparent; font-size:16px;" onclick="deleteDigit()">Xóa</button>
            </div>
        </form>
        <script>
          let pin = "";
          function addDigit(n) {
            if (pin.length < 6) {
              pin += n;
              document.querySelectorAll('.dot')[pin.length-1].classList.add('filled');
            }
            if (pin.length === 6) {
              document.getElementById('pinInput').value = pin;
              document.getElementById('pinForm').submit();
            }
          }
          function deleteDigit() {
            if (pin.length > 0) {
              pin = pin.slice(0, -1);
              document.querySelectorAll('.dot')[pin.length].classList.remove('filled');
            }
          }
        </script>
      </body>
    </html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

export const config = { matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)' };