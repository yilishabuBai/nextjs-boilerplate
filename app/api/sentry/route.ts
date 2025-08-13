import { NextRequest, NextResponse } from 'next/server';

// Sentry webhook 事件类型
interface SentryEvent {
  id: string;
  project: string;
  project_name: string;
  message: string;
  url: string;
  culprit: string;
  level: string;
  timestamp: string;
  event: {
    id: string;
    title: string;
    message: string;
    tags: Record<string, string>;
    extra: Record<string, any>;
    user: {
      id?: string;
      username?: string;
      email?: string;
      ip_address?: string;
    };
    contexts: {
      device?: {
        name?: string;
        family?: string;
        model?: string;
      };
      os?: {
        name?: string;
        version?: string;
      };
      browser?: {
        name?: string;
        version?: string;
      };
    };
    stacktrace?: {
      frames: Array<{
        filename: string;
        function: string;
        lineno: number;
        colno: number;
        in_app: boolean;
      }>;
    };
  };
}

// 验证 Sentry webhook 签名（可选，需要配置 SENTRY_WEBHOOK_SECRET）
function verifySignature(request: NextRequest, body: string): boolean {
  const signature = request.headers.get('sentry-hook-signature');
  if (!signature) return true; // 如果没有配置签名验证，则跳过

  // 这里可以添加 HMAC 签名验证逻辑
  // const expectedSignature = crypto
  //   .createHmac('sha256', process.env.SENTRY_WEBHOOK_SECRET!)
  //   .update(body)
  //   .digest('hex');

  return true; // 简化版本，实际使用时应该验证签名
}

// 处理 Sentry 事件
function processSentryEvent(event: SentryEvent) {
  // 根据事件级别进行分类处理
  const level = event.level.toLowerCase();

  // 记录事件到控制台（实际项目中应该记录到日志系统）
  console.log(`[SENTRY] ${level.toUpperCase()}: ${event.message}`);
  console.log(`Project: ${event.project_name}`);
  console.log(`URL: ${event.url}`);
  console.log(`User: ${event.event.user.username || event.event.user.email || 'Unknown'}`);

  // 根据级别进行不同的处理
  switch (level) {
    case 'fatal':
    case 'error':
      // 严重错误：可以发送通知、记录到数据库等
      console.error('🚨 严重错误需要立即关注');
      break;
    case 'warning':
      // 警告：记录并监控
      console.warn('⚠️ 警告信息');
      break;
    case 'info':
      // 信息：正常记录
      console.info('ℹ️ 信息记录');
      break;
    case 'debug':
      // 调试：开发环境记录
      console.debug('🐛 调试信息');
      break;
  }

  // 可以在这里添加更多处理逻辑：
  // - 发送 Slack/钉钉通知
  // - 记录到数据库
  // - 触发告警系统
  // - 性能指标统计
}

// POST: 接收 Sentry webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // 验证请求签名
    if (!verifySignature(request, body)) {
      return NextResponse.json(
        { error: '无效的签名' },
        { status: 401 }
      );
    }

    // 解析 JSON 数据
    let data: any;
    try {
      data = JSON.parse(body);
    } catch (error) {
      return NextResponse.json(
        { error: '无效的 JSON 数据' },
        { status: 400 }
      );
    }

    // 验证必要字段
    if (!data.id || !data.project || !data.message) {
      return NextResponse.json(
        { error: '缺少必要字段' },
        { status: 400 }
      );
    }

    // 处理 Sentry 事件
    processSentryEvent(data as SentryEvent);

    // 返回成功响应
    return NextResponse.json({
      message: 'Sentry webhook 接收成功',
      event_id: data.id,
      project: data.project,
      timestamp: new Date().toISOString(),
      status: 'success'
    }, { status: 200 });

  } catch (error) {
    console.error('Sentry webhook 处理错误:', error);

    return NextResponse.json(
      {
        error: '内部服务器错误',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

// GET: 健康检查接口
export async function GET() {
  return NextResponse.json({
    message: 'Sentry webhook 接口正常运行',
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
}

// 可选：添加其他 HTTP 方法支持
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST, GET, OPTIONS',
      'Content-Type': 'application/json',
    },
  });
}
