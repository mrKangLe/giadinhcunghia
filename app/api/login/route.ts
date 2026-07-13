import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = formData.get('password');
  const ADMIN_PASSWORD = "555155";

  if (password === ADMIN_PASSWORD) {
    // Thay vì redirect trực tiếp, ta trả về thông tin thành công
    const response = NextResponse.json({ success: true });
    
    response.cookies.set('family_password', ADMIN_PASSWORD, { 
      httpOnly: true, 
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    });
    
    return response;
  }

  return new NextResponse(
    `<h1>Mật khẩu sai rồi bố ơi!</h1><a href="/">Thử lại nhé</a>`, 
    { status: 401, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}