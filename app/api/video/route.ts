import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const scene = searchParams.get('scene') || 'scene1';

  // 这里应该返回实际的视频文件
  // 目前返回一个示例响应
  return NextResponse.json({
    message: '视频API端点',
    scene: scene,
    note: '请配置实际的视频文件路径'
  });
}
