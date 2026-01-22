import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getMonthName,
  getWeekdayName,
  isSameDay,
} from "@/lib/date-utils";
import { cn } from "@/lib/utils";

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

export function Calendar({ onDateSelect, selectedDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // 构建日历网格
  const calendarDays: (number | null)[] = [];

  // 添加前一个月的空白日期
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // 添加当前月份的日期
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // 添加后一个月的空白日期
  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDatePress = (day: number) => {
    const selectedDateObj = new Date(year, month, day);
    onDateSelect(selectedDateObj);
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    const dateObj = new Date(year, month, day);
    return isSameDay(dateObj, selectedDate);
  };

  const isToday = (day: number) => {
    const dateObj = new Date(year, month, day);
    return isSameDay(dateObj, new Date());
  };

  return (
    <View className="bg-surface rounded-2xl p-4 mb-6">
      {/* 月份导航 */}
      <View className="flex-row items-center justify-between mb-4">
        <Pressable
          onPress={handlePrevMonth}
          className="px-3 py-2 rounded-lg active:bg-border"
        >
          <Text className="text-lg font-semibold text-primary">←</Text>
        </Pressable>

        <Text className="text-lg font-semibold text-foreground">
          {getMonthName(month)} {year}
        </Text>

        <Pressable
          onPress={handleNextMonth}
          className="px-3 py-2 rounded-lg active:bg-border"
        >
          <Text className="text-lg font-semibold text-primary">→</Text>
        </Pressable>
      </View>

      {/* 星期标题 */}
      <View className="flex-row mb-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <View key={index} className="flex-1 items-center py-2">
            <Text className="text-xs font-semibold text-muted">
              {getWeekdayName(index)}
            </Text>
          </View>
        ))}
      </View>

      {/* 日期网格 */}
      <View>
        {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map(
          (_, weekIndex) => (
            <View key={weekIndex} className="flex-row">
              {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map(
                (day, dayIndex) => (
                  <View
                    key={`${weekIndex}-${dayIndex}`}
                    className="flex-1 items-center py-2"
                  >
                    {day !== null ? (
                      <Pressable
                        onPress={() => handleDatePress(day)}
                        className={cn(
                          "w-10 h-10 rounded-lg items-center justify-center",
                          isDateSelected(day) && "bg-primary",
                          isToday(day) && !isDateSelected(day) && "border border-primary"
                        )}
                      >
                        <Text
                          className={cn(
                            "text-sm font-semibold",
                            isDateSelected(day)
                              ? "text-background"
                              : "text-foreground"
                          )}
                        >
                          {day}
                        </Text>
                      </Pressable>
                    ) : (
                      <View className="w-10 h-10" />
                    )}
                  </View>
                )
              )}
            </View>
          )
        )}
      </View>
    </View>
  );
}
