"use client";

import { useState } from "react";

/**
 * 日历页面组件 - 紧凑尺寸版
 * 实现月视图日历，支持月份切换和响应式设计
 * 
 * 尺寸规格：
 * - 按钮高度：16-18px
 * - 日期格子：12-16px
 * - 字体：text-[8px]/[10px]/xs
 * - padding: p-0.5/p-1/p-1.5
 * - 圆角：rounded-sm/rounded
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-2 sm:py-3 lg:py-4 px-2 sm:px-3 lg:px-4">
      <div className="max-w-3xl sm:max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-2 sm:mb-3 lg:mb-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-1">
            📅 日历
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            查看和管理您的日程安排
          </p>
        </div>

        {/* 日历卡片 */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden border border-slate-200">
          {/* 日历头部 - 月份选择和导航 */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-between">
              {/* 上个月按钮 */}
              <button
                onClick={goToPrevMonth}
                className="p-1 sm:p-1.5 lg:p-2 rounded-md bg-white/20 hover:bg-white/30 transition-colors text-white min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="上个月"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
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
              <div className="text-center flex-1 mx-2 sm:mx-3">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white">
                  {formatMonthName(currentMonth)} {currentYear}
                </h2>
              </div>

              {/* 下个月按钮 */}
              <button
                onClick={goToNextMonth}
                className="p-1 sm:p-1.5 lg:p-2 rounded-md bg-white/20 hover:bg-white/30 transition-colors text-white min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="下个月"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
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
            <div className="mt-2 sm:mt-3 text-center">
              <button
                onClick={goToToday}
                className="px-2 sm:px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md text-white font-medium transition-colors min-h-[36px]"
              >
                回到今天
              </button>
            </div>
          </div>

          {/* 日历主体 */}
          <div className="p-2 sm:p-3 lg:p-4">
            {/* 星期标题 */}
            <div className="grid grid-cols-7 mb-1 sm:mb-2 lg:mb-3">
              {weekDays.map((day, index) => {
                const isWeekend = index === 0 || index === 6;
                return (
                  <div
                    key={day}
                    className={`text-center py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold ${
                      isWeekend
                        ? "text-emerald-600"
                        : "text-slate-700"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {/* 日期网格 */}
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 lg:gap-1.5">
              {calendarDays.map((date, index) => {
                const isWeekend = index % 7 === 0 || index % 7 === 6;
                
                return (
                  <div
                    key={index}
                    className={`
                      aspect-square flex items-center justify-center rounded-sm sm:rounded-md 
                      text-[10px] sm:text-xs lg:text-sm font-medium
                      transition-all duration-200
                      min-h-[28px] sm:min-h-[32px] lg:min-h-[36px]
                      ${date.month === "current"
                        ? "bg-white border border-slate-200 hover:border-teal-400 hover:shadow-sm cursor-pointer"
                        : "bg-slate-50 text-slate-400 border border-transparent"
                      }
                      ${date.isToday
                        ? "bg-gradient-to-br from-teal-400 to-emerald-500 text-white border-teal-500 hover:from-teal-500 hover:to-emerald-600 shadow-sm"
                        : ""
                      }
                      ${isWeekend && date.month === "current" && !date.isToday
                        ? "text-emerald-600 font-semibold"
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
          <div className="bg-slate-50 px-3 sm:px-4 py-2 sm:py-3 border-t border-slate-200">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:gap-4 text-[10px] sm:text-xs">
              <div className="flex items-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-teal-400 to-emerald-500 rounded mr-1.5"></div>
                <span className="text-slate-600">今天</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white border border-slate-200 rounded mr-1.5"></div>
                <span className="text-slate-600">当前月份</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-slate-50 rounded mr-1.5"></div>
                <span className="text-slate-600">其他月份</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white text-emerald-600 border border-slate-200 rounded mr-1.5 flex items-center justify-center text-[10px] sm:text-xs font-semibold">6</div>
                <span className="text-slate-600">周末</span>
              </div>
            </div>
          </div>
        </div>

        {/* 返回首页链接 */}
        <div className="text-center mt-3 sm:mt-4 lg:mt-6">
          <a
            href="/"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium text-xs sm:text-sm"
          >
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5"
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
