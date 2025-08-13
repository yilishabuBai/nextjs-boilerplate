import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: '你好！这是一个 Next.js API 接口',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    return NextResponse.json({
      message: '数据接收成功',
      receivedData: body,
      timestamp: new Date().toISOString(),
      status: 'success'
    });
  } catch (error) {
    return NextResponse.json(
      { error: '无效的 JSON 数据' },
      { status: 400 }
    );
  }
}
