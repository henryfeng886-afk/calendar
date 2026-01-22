import { ScrollView, Text, View } from "react-native";
import { useState, useMemo } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { Calendar } from "@/components/calendar";
import { FuturesList } from "@/components/futures-list";
import { generateMockFuturesData, getFuturesForDate, type Futures } from "@/lib/futures-data";
import { formatDate } from "@/lib/date-utils";

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const futuresData = useMemo(() => generateMockFuturesData(), []);

  const selectedDateStr = formatDate(selectedDate);
  const futuresForSelectedDate = getFuturesForDate(futuresData, selectedDateStr);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const router = useRouter();

  const handleFuturesPress = (futures: Futures) => {
    router.push({
      pathname: "/futures-detail",
      params: {
        futuresJson: JSON.stringify(futures),
      },
    });
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 pt-4">
          {/* 标题 */}
          <View className="mb-4">
            <Text className="text-3xl font-bold text-foreground">期货日历</Text>
            <Text className="text-sm text-muted mt-1">点击日期查看期货品种</Text>
          </View>

          {/* 日历组件 */}
          <Calendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />

          {/* 选中日期标题 */}
          <View className="mb-4">
            <Text className="text-lg font-semibold text-foreground">
              {selectedDateStr} 的期货品种
            </Text>
          </View>

          {/* 期货品种列表 */}
          <FuturesList
            futures={futuresForSelectedDate}
            onFuturesPress={handleFuturesPress}
            date={selectedDateStr}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
