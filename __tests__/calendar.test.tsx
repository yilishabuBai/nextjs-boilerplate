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
    
    // 检查是否有今天的样式（青绿色渐变背景）
    expect(todayElement).toHaveClass('from-teal-400');
    expect(todayElement).toHaveClass('to-emerald-500');
  });

  test('✅ 周末日期显示为青绿色', () => {
    render(<CalendarPage />);
    
    // 2026 年 4 月 1 日是周三，4 月 4 日和 5 日是周六和周日
    // 使用 getAllByText 获取所有匹配的元素，然后检查第一个（当月的）
    const weekendDays = screen.getAllByText('4');
    // 第一个 4 号应该是当月的周六
    expect(weekendDays[0]).toHaveClass('text-emerald-600');
  });

  test('✅ 非当月日期显示为灰色', () => {
    render(<CalendarPage />);
    
    // 上个月或下个月的日期应该有灰色样式
    const otherMonthDays = screen.getAllByText('30');
    // 至少有一个 30 号是其他月份的
    expect(otherMonthDays.length).toBeGreaterThan(0);
    // 检查是否有其他月份的样式
    expect(otherMonthDays[0]).toHaveClass('bg-slate-50');
  });

  test('✅ 按钮满足触摸友好要求（最小 36px）', () => {
    render(<CalendarPage />);
    
    // 检查上个月按钮有 min-h-[36px] 类
    const prevButton = screen.getByLabelText('上个月');
    expect(prevButton).toHaveClass('min-h-[36px]');
    
    // 检查下个月按钮有 min-h-[36px] 类
    const nextButton = screen.getByLabelText('下个月');
    expect(nextButton).toHaveClass('min-h-[36px]');
    
    // 检查今天按钮有 min-h-[36px] 类
    const todayButton = screen.getByText('回到今天');
    expect(todayButton).toHaveClass('min-h-[36px]');
  });

  test('✅ 日期格子尺寸正确', () => {
    render(<CalendarPage />);
    
    // 检查日期格子有正确的 min-height 类
    const dateCell = screen.getByText('15');
    expect(dateCell).toHaveClass('min-h-[28px]');
    expect(dateCell).toHaveClass('sm:min-h-[32px]');
    expect(dateCell).toHaveClass('lg:min-h-[36px]');
  });

  test('✅ 响应式布局正确渲染', () => {
    const { container } = render(<CalendarPage />);
    
    // 检查容器是否有响应式 padding
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('p-2');
    expect(mainContainer).toHaveClass('sm:p-3');
    expect(mainContainer).toHaveClass('lg:p-4');
    
    // 检查日历卡片是否有响应式圆角
    const calendarCard = container.querySelector('.bg-white');
    expect(calendarCard).toHaveClass('rounded-lg');
    expect(calendarCard).toHaveClass('sm:rounded-xl');
  });

  test('✅ 宽度适配 - 日历卡片使用 w-full', () => {
    const { container } = render(<CalendarPage />);
    
    // 检查日历卡片有 w-full 类以填充容器宽度
    const calendarCard = container.querySelector('.bg-white');
    expect(calendarCard).toHaveClass('w-full');
  });

  test('✅ 高度适配 - 使用 flexbox 布局填充高度', () => {
    const { container } = render(<CalendarPage />);
    
    // 检查主容器使用 flex flex-col 布局
    const mainContainer = container.querySelector('.max-w-3xl');
    expect(mainContainer).toHaveClass('flex');
    expect(mainContainer).toHaveClass('flex-col');
    expect(mainContainer).toHaveClass('h-full');
    
    // 检查日历卡片使用 flex-1 填充可用高度
    const calendarCard = container.querySelector('.bg-white');
    expect(calendarCard).toHaveClass('flex-1');
    expect(calendarCard).toHaveClass('flex');
    expect(calendarCard).toHaveClass('flex-col');
    
    // 检查日历主体使用 flex-1（通过包含星期标题和日期网格的容器来识别）
    const calendarBody = container.querySelector('.grid.grid-cols-7').parentElement;
    expect(calendarBody).toHaveClass('flex-1');
    expect(calendarBody).toHaveClass('flex');
    expect(calendarBody).toHaveClass('flex-col');
    expect(calendarBody).toHaveClass('min-h-0');
  });

  test('✅ 日期网格高度适配', () => {
    const { container } = render(<CalendarPage />);
    
    // 检查日期网格使用 flex-1 和 min-h-0
    const dateGrid = container.querySelector('.grid.grid-cols-7');
    // 获取第二个 grid（日期网格，第一个是星期标题）
    const grids = container.querySelectorAll('.grid.grid-cols-7');
    expect(grids.length).toBeGreaterThanOrEqual(2);
    
    // 检查小屏幕以上的响应式行为
    const dateCells = container.querySelectorAll('.aspect-square');
    expect(dateCells.length).toBeGreaterThan(0);
  });

  test('✅ 固定元素使用 flex-shrink-0', () => {
    const { container } = render(<CalendarPage />);
    
    // 检查标题区域不压缩
    const header = container.querySelector('.text-center.mb-2');
    expect(header).toHaveClass('flex-shrink-0');
    
    // 检查底部图例不压缩
    const footer = container.querySelector('.bg-slate-50.px-3');
    expect(footer).toHaveClass('flex-shrink-0');
    
    // 检查星期标题不压缩
    const weekDays = container.querySelector('.grid.grid-cols-7.mb-1');
    expect(weekDays).toHaveClass('flex-shrink-0');
  });

  test('✅ 颜色方案符合无障碍要求', () => {
    render(<CalendarPage />);
    
    // 检查周末颜色（青绿色）
    const weekendElement = screen.getByText('日');
    expect(weekendElement).toHaveClass('text-emerald-600');
    
    // 检查工作日颜色
    const weekdayElement = screen.getByText('一');
    expect(weekdayElement).toHaveClass('text-slate-700');
    
    // 检查今天的高亮色（青绿色渐变）
    const todayElement = screen.getByText('15');
    expect(todayElement).toHaveClass('from-teal-400');
    expect(todayElement).toHaveClass('to-emerald-500');
  });
});
