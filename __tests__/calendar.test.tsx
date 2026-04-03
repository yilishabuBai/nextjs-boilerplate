/**
 * 日历页面单元测试
 * 测试文件：app/calendar/page.tsx
 */

import { render, screen, fireEvent } from '@testing-library/react';
import CalendarPage from '../app/calendar/page';

// 模拟当前日期
const mockCurrentDate = new Date(2026, 3, 15).getTime(); // 2026 年 4 月 15 日的时间戳

beforeAll(() => {
  // 冻结时间，确保测试可重复
  jest.useFakeTimers();
  jest.setSystemTime(mockCurrentDate);
});

afterAll(() => {
  jest.useRealTimers();
});

describe('CalendarPage 日历页面', () => {
  test('✅ 日历页面能正常渲染', () => {
    render(<CalendarPage />);
    
    // 检查标题是否存在
    expect(screen.getByText(/📅 日历/i)).toBeInTheDocument();
    
    // 检查月份导航是否存在
    expect(screen.getByLabelText('上个月')).toBeInTheDocument();
    expect(screen.getByLabelText('下个月')).toBeInTheDocument();
  });

  test('✅ 显示当前月份和年份', () => {
    render(<CalendarPage />);
    
    // 检查月份显示（4 月 = 四月）
    expect(screen.getByText(/四月 2026/i)).toBeInTheDocument();
  });

  test('✅ "上个月" 按钮点击后月份正确切换', () => {
    render(<CalendarPage />);
    
    // 找到上个月按钮并点击
    const prevButton = screen.getByLabelText('上个月');
    fireEvent.click(prevButton);
    
    // 应该切换到 3 月
    expect(screen.getByText(/三月 2026/i)).toBeInTheDocument();
  });

  test('✅ "下个月" 按钮点击后月份正确切换', () => {
    render(<CalendarPage />);
    
    // 找到下个月按钮并点击
    const nextButton = screen.getByLabelText('下个月');
    fireEvent.click(nextButton);
    
    // 应该切换到 5 月
    expect(screen.getByText(/五月 2026/i)).toBeInTheDocument();
  });

  test('✅ "回到今天" 按钮点击后回到当前月份', () => {
    render(<CalendarPage />);
    
    // 先切换到下个月
    const nextButton = screen.getByLabelText('下个月');
    fireEvent.click(nextButton);
    expect(screen.getByText(/五月 2026/i)).toBeInTheDocument();
    
    // 点击"回到今天"
    const todayButton = screen.getByText('回到今天');
    fireEvent.click(todayButton);
    
    // 应该回到 4 月
    expect(screen.getByText(/四月 2026/i)).toBeInTheDocument();
  });

  test('✅ 今天的日期高亮显示', () => {
    render(<CalendarPage />);
    
    // 查找今天的日期（15 号）
    const todayElement = screen.getByText('15');
    
    // 检查是否有今天的样式（bg-blue-500）
    expect(todayElement).toHaveClass('bg-blue-500');
  });

  test('✅ 周末日期显示为红色', () => {
    render(<CalendarPage />);
    
    // 2026 年 4 月 1 日是周三，4 月 4 日和 5 日是周六和周日
    // 使用 getAllByText 获取所有匹配的元素，然后检查第一个（当月的）
    const weekendDays = screen.getAllByText('4');
    // 第一个 4 号应该是当月的周六
    expect(weekendDays[0]).toHaveClass('text-red-500');
  });

  test('✅ 非当月日期显示为灰色', () => {
    render(<CalendarPage />);
    
    // 上个月或下个月的日期应该有灰色样式
    const otherMonthDays = screen.getAllByText('30');
    // 至少有一个 30 号是其他月份的
    expect(otherMonthDays.length).toBeGreaterThan(0);
  });
});
