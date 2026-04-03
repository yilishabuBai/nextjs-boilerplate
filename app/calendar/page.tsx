"use client";

import { useState } from "react";

/**
 * 日历页面组件
 * 实现月视图日历，支持月份切换和响应式设计
 */
export default function CalendarPage() {
  // 获取当前日期
  const today = new Date();
  
  // 状态：当前显示的年份和月份
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  /**
   * 获取指定月份的日历数据
   * @param year 年份
   * @param month 月份 (0-11)
   * @returns 日历数据对象
   */
  const getCalendarData = (year: number, month: number) => {
    // 获取当月第一天是星期几 (0-6, 0 表示周日)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // 获取当月有多少天
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // 获取上个月有多少天
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // 生成日历网格数据
    const calendarDays: Array<{
      day: number;
      month: "prev" | "current" | "next";
      isToday?: boolean;
    }> = [];

    // 添加上个月的日期（填充前面的空格）
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      calendarDays.push({
        day: daysInPrevMonth - i,
        month: "prev",
      });
    }

    // 添加当月的日期
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();
      
      calendarDays.push({
        day,
        month: "current",
        isToday,
      });
    }

    // 添加下个月的日期（填充后面的空格，确保总共 42 个格子）
    const remainingDays = 42 - calendarDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      calendarDays.push({
        day,
        month: "next",
      });
    }

    return calendarDays;
  };

  /**
   * 切换到上一个月
   */
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  /**
   * 切换到下一个月
   */
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  /**
   * 跳转到今天
   */
  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  /**
   * 格式化月份名称
   */
  const formatMonthName = (month: number) => {
    const monthNames = [
      "一月", "二月", "三月", "四月", "五月", "六月",
      "七月", "八月", "九月", "十月", "十一月", "十二月"
    ];
    return monthNames[month];
  };

  /**
   * 星期标题
   */
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  // 获取日历数据
  const calendarDays = getCalendarData(currentYear, currentMonth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📅 日历
          </h1>
          <p className="text-gray-600">
            查看和管理您的日程安排
          </p>
        </div>

        {/* 日历卡片 */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* 日历头部 - 月份选择和导航 */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              {/* 上个月按钮 */}
              <button
                onClick={goToPrevMonth}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white"
                aria-label="上个月"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* 当前月份和年份显示 */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white">
                  {formatMonthName(currentMonth)} {currentYear}
                </h2>
              </div>

              {/* 下个月按钮 */}
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white"
                aria-label="下个月"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* 今天按钮 */}
            <div className="mt-4 text-center">
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-colors"
              >
                回到今天
              </button>
            </div>
          </div>

          {/* 日历主体 */}
          <div className="p-6">
            {/* 星期标题 */}
            <div className="grid grid-cols-7 mb-4">
              {weekDays.map((day, index) => (
                <div
                  key={day}
                  className={`text-center py-2 text-sm font-semibold ${
                    index === 0 || index === 6
                      ? "text-red-500"
                      : "text-gray-700"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 日期网格 */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((date, index) => {
                const isWeekend = index % 7 === 0 || index % 7 === 6;
                
                return (
                  <div
                    key={index}
                    className={`
                      aspect-square flex items-center justify-center rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${date.month === "current"
                        ? "bg-white border border-gray-200 hover:border-blue-400 hover:shadow-md cursor-pointer"
                        : "bg-gray-50 text-gray-400"
                      }
                      ${date.isToday
                        ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                        : ""
                      }
                      ${isWeekend && date.month === "current" && !date.isToday
                        ? "text-red-500"
                        : ""
                      }
                    `}
                  >
                    {date.day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 日历底部图例 */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                <span className="text-gray-600">今天</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white border border-gray-200 rounded mr-2"></div>
                <span className="text-gray-600">当前月份</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-50 rounded mr-2"></div>
                <span className="text-gray-600">其他月份</span>
              </div>
            </div>
          </div>
        </div>

        {/* 返回首页链接 */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
