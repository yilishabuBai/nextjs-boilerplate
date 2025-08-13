'use client';

import { useState, useEffect } from 'react';

interface SentryTestData {
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  message: string;
  project: string;
  url: string;
  username: string;
  email: string;
  browser: string;
  os: string;
  device: string;
}

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

export default function SentryTestPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [receivedEvents, setReceivedEvents] = useState<SentryEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SentryEvent | null>(null);
  const [testData, setTestData] = useState<SentryTestData>({
    level: 'error',
    message: '这是一个测试错误消息',
    project: 'nextjs-boilerplate',
    url: 'https://example.com/test',
    username: 'testuser',
    email: 'test@example.com',
    browser: 'Chrome 120.0',
    os: 'macOS 14.0',
    device: 'MacBook Pro'
  });

  // 生成模拟的 Sentry 事件数据
  const generateSentryEvent = (data: SentryTestData): SentryEvent => {
    return {
      id: `test-${Date.now()}`,
      project: data.project,
      project_name: data.project,
      message: data.message,
      url: data.url,
      culprit: 'testFunction()',
      level: data.level,
      timestamp: new Date().toISOString(),
      event: {
        id: `test-event-${Date.now()}`,
        title: data.message,
        message: data.message,
        tags: {
          environment: 'development',
          level: data.level,
          test: 'true'
        },
        extra: {
          test_data: true,
          timestamp: Date.now()
        },
        user: {
          id: 'test-user-id',
          username: data.username,
          email: data.email,
          ip_address: '127.0.0.1'
        },
        contexts: {
          device: {
            name: data.device,
            family: 'Desktop',
            model: 'MacBook Pro'
          },
          os: {
            name: data.os.split(' ')[0],
            version: data.os.split(' ')[1]
          },
          browser: {
            name: data.browser.split(' ')[0],
            version: data.browser.split(' ')[1]
          }
        },
        stacktrace: {
          frames: [
            {
              filename: 'test.tsx',
              function: 'testFunction',
              lineno: 42,
              colno: 10,
              in_app: true
            },
            {
              filename: 'index.tsx',
              function: 'main',
              lineno: 15,
              colno: 5,
              in_app: true
            }
          ]
        }
      }
    };
  };

  // 测试 Sentry webhook
  const testSentryWebhook = async () => {
    setLoading(true);
    setMessage('');

    try {
      const sentryEvent = generateSentryEvent(testData);

      const response = await fetch('/api/sentry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'sentry-hook-signature': 'test-signature' // 测试签名
        },
        body: JSON.stringify(sentryEvent)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ Sentry webhook 测试成功！\n事件ID: ${data.event_id}\n项目: ${data.project}`);
        // 将测试事件添加到接收列表
        setReceivedEvents(prev => [sentryEvent, ...prev]);
        setSelectedEvent(sentryEvent);
      } else {
        setMessage(`❌ 测试失败: ${data.error || '未知错误'}`);
      }
    } catch (error) {
      setMessage(`❌ 请求失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  // 健康检查
  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sentry');
      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ 健康检查通过: ${data.message}`);
      } else {
        setMessage(`❌ 健康检查失败: ${data.error || '未知错误'}`);
      }
    } catch (error) {
      setMessage(`❌ 健康检查失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  // 快速测试不同级别
  const quickTest = (level: SentryTestData['level']) => {
    setTestData(prev => ({
      ...prev,
      level,
      message: `这是一个 ${level} 级别的测试消息`
    }));
  };

  // 清空接收的事件
  const clearEvents = () => {
    setReceivedEvents([]);
    setSelectedEvent(null);
    setMessage('事件列表已清空');
  };

  // 获取事件级别的颜色
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'fatal': return 'bg-red-600';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      case 'debug': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Sentry Webhook 测试页面
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：测试配置和操作 */}
          <div className="space-y-6">
            {/* 快速测试按钮 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">快速测试</h2>
              <div className="flex flex-wrap gap-2">
                {(['fatal', 'error', 'warning', 'info', 'debug'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => quickTest(level)}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      testData.level === level
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {level.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* 测试数据配置 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">测试数据配置</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      错误级别
                    </label>
                    <select
                      value={testData.level}
                      onChange={(e) => setTestData({...testData, level: e.target.value as SentryTestData['level']})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="fatal">Fatal</option>
                      <option value="error">Error</option>
                      <option value="warning">Warning</option>
                      <option value="info">Info</option>
                      <option value="debug">Debug</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      项目名称
                    </label>
                    <input
                      type="text"
                      value={testData.project}
                      onChange={(e) => setTestData({...testData, project: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    错误消息
                  </label>
                  <input
                    type="text"
                    value={testData.message}
                    onChange={(e) => setTestData({...testData, message: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    value={testData.url}
                    onChange={(e) => setTestData({...testData, url: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      用户名
                    </label>
                    <input
                      type="text"
                      value={testData.username}
                      onChange={(e) => setTestData({...testData, username: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      邮箱
                    </label>
                    <input
                      type="email"
                      value={testData.email}
                      onChange={(e) => setTestData({...testData, email: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      浏览器
                    </label>
                    <input
                      type="text"
                      value={testData.browser}
                      onChange={(e) => setTestData({...testData, browser: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      操作系统
                    </label>
                    <input
                      type="text"
                      value={testData.os}
                      onChange={(e) => setTestData({...testData, os: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    设备
                  </label>
                  <input
                    type="text"
                    value={testData.device}
                    onChange={(e) => setTestData({...testData, device: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* 测试按钮 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">测试操作</h2>
              <div className="flex gap-4">
                <button
                  onClick={testSentryWebhook}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                  {loading ? '测试中...' : '测试 Sentry Webhook'}
                </button>
                <button
                  onClick={checkHealth}
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                >
                  健康检查
                </button>
              </div>
            </div>

            {/* 消息显示 */}
            {message && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <pre className="text-blue-800 whitespace-pre-wrap">{message}</pre>
              </div>
            )}
          </div>

          {/* 右侧：接收到的异常信息展示 */}
          <div className="space-y-6">
            {/* 事件列表 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">接收到的异常信息</h2>
                <button
                  onClick={clearEvents}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  清空列表
                </button>
              </div>

              {receivedEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>暂无异常信息</p>
                  <p className="text-sm">点击"测试 Sentry Webhook"按钮来生成测试数据</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {receivedEvents.map((event, index) => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedEvent?.id === event.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium text-white ${getLevelColor(event.level)}`}>
                          {event.level.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1 truncate">
                        {event.message}
                      </h3>
                      <p className="text-sm text-gray-600">
                        项目: {event.project_name} | 用户: {event.event.user.username || event.event.user.email || 'Unknown'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 事件详情 */}
            {selectedEvent && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">异常详情</h2>

                <div className="space-y-4">
                  {/* 基本信息 */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">基本信息</h3>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">事件ID:</span>
                        <span className="font-mono">{selectedEvent.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">级别:</span>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium text-white ${getLevelColor(selectedEvent.level)}`}>
                          {selectedEvent.level.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">项目:</span>
                        <span>{selectedEvent.project_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">时间:</span>
                        <span>{new Date(selectedEvent.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">URL:</span>
                        <span className="font-mono text-xs truncate max-w-48">{selectedEvent.url}</span>
                      </div>
                    </div>
                  </div>

                  {/* 错误信息 */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">错误信息</h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-800 mb-2">{selectedEvent.event.message}</p>
                      <p className="text-xs text-gray-600">Culprit: {selectedEvent.culprit}</p>
                    </div>
                  </div>

                  {/* 用户信息 */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">用户信息</h3>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">用户名:</span>
                        <span>{selectedEvent.event.user.username || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">邮箱:</span>
                        <span>{selectedEvent.event.user.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">IP地址:</span>
                        <span>{selectedEvent.event.user.ip_address || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* 环境信息 */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">环境信息</h3>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">浏览器:</span>
                        <span>{selectedEvent.event.contexts.browser?.name} {selectedEvent.event.contexts.browser?.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">操作系统:</span>
                        <span>{selectedEvent.event.contexts.os?.name} {selectedEvent.event.contexts.os?.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">设备:</span>
                        <span>{selectedEvent.event.contexts.device?.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* 堆栈跟踪 */}
                  {selectedEvent.event.stacktrace && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">堆栈跟踪</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="space-y-2 text-sm">
                          {selectedEvent.event.stacktrace.frames.map((frame, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <span className="text-gray-500 text-xs w-8">{index}</span>
                              <span className="font-mono text-xs">
                                {frame.function} at {frame.filename}:{frame.lineno}:{frame.colno}
                              </span>
                              {frame.in_app && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  in-app
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 标签信息 */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">标签信息</h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(selectedEvent.event.tags).map(([key, value]) => (
                          <span key={key} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 使用说明 */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">使用说明</h2>
          <div className="space-y-3 text-gray-600">
            <p>• 这个页面用于测试 Sentry webhook 接口的功能</p>
            <p>• 可以模拟不同级别的错误事件</p>
            <p>• 支持自定义错误消息、用户信息、环境信息等</p>
            <p>• 测试数据会发送到 <code className="bg-gray-100 px-2 py-1 rounded">/api/sentry</code> 接口</p>
            <p>• 右侧会实时显示接收到的异常信息</p>
            <p>• 点击事件卡片可以查看详细信息</p>
            <p>• 可以在浏览器控制台查看接口的日志输出</p>
          </div>
        </div>

        {/* 返回首页 */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 transition-colors"
          >
            返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
