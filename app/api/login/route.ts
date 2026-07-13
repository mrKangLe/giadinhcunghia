import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = formData.get('password');
  const ADMIN_PASSWORD = "555155"; // Mật khẩu mới của bố

  if (password === ADMIN_PASSWORD) {
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('family_password', ADMIN_PASSWORD, { 
      httpOnly: true, 
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    });
    return response;
  }

  return new NextResponse(
    `<!DOCTYPE html>
    <html lang="vi">
      <head><meta charset="UTF-8"></head>
      <body style="background:#f2f2f7; font-family:sans-serif; text-align:center; padding-top:50px;">
        <h1>Mật khẩu sai rồi bố ơi!</h1>
        <a href="/" style="color:#007aff; text-decoration:none;">Thử lại nhé</a>
      </body>
    </html>`, 
    { status: 401, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}