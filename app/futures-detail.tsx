import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import {
  formatPrice,
  formatChangePercent,
  isRising,
  type Futures,
} from "@/lib/futures-data";
import { cn } from "@/lib/utils";

export default function FuturesDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    futuresJson?: string;
  }>();

  let futures: Futures | null = null;
  try {
    if (params.futuresJson) {
      futures = JSON.parse(params.futuresJson);
    }
  } catch (error) {
    console.error("Failed to parse futures data:", error);
  }

  if (!futures) {
    return (
      <ScreenContainer className="p-4">
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-muted">无法加载期货信息</Text>
          <Pressable
            onPress={() => router.back()}
            className="mt-4 px-6 py-3 bg-primary rounded-lg"
          >
            <Text className="text-background font-semibold">返回</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const changeColor = isRising(futures.changePercent)
    ? "text-success"
    : "text-error";
  const changeBgColor = isRising(futures.changePercent)
    ? "bg-success/10"
    : "bg-error/10";

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* 返回按钮 */}
        <Pressable
          onPress={() => router.back()}
          className="mb-6 flex-row items-center active:opacity-70"
        >
          <Text className="text-lg text-primary">← 返回</Text>
        </Pressable>

        {/* 品种基本信息 */}
        <View className="bg-surface rounded-2xl p-6 mb-6 border border-border">
          <View className="flex-row items-start justify-between mb-4">
            <View>
              <Text className="text-3xl font-bold text-foreground">
                {futures.name}
              </Text>
              <Text className="text-lg text-muted mt-2">{futures.code}</Text>
            </View>
            <View
              className={cn(
                "px-4 py-2 rounded-xl",
                changeBgColor
              )}
            >
              <Text className={cn("text-lg font-bold", changeColor)}>
                {formatChangePercent(futures.changePercent)}
              </Text>
            </View>
          </View>

          {/* 价格信息 */}
          <View className="border-t border-border pt-4">
            <View className="flex-row justify-between mb-4">
              <View>
                <Text className="text-sm text-muted mb-2">当前价格</Text>
                <Text className="text-3xl font-bold text-foreground">
                  {formatPrice(futures.price)}
                </Text>
              </View>
              <View>
                <Text className="text-sm text-muted mb-2">价格变化</Text>
                <Text className={cn("text-2xl font-bold", changeColor)}>
                  {futures.change > 0 ? "+" : ""}
                  {formatPrice(futures.change)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 交易信息 */}
        <View className="bg-surface rounded-2xl p-6 border border-border">
          <Text className="text-lg font-semibold text-foreground mb-4">
            交易信息
          </Text>

          <View className="space-y-4">
            <View className="flex-row justify-between items-center pb-4 border-b border-border">
              <Text className="text-base text-muted">交易时间</Text>
              <Text className="text-base font-semibold text-foreground">
                {futures.tradingHours}
              </Text>
            </View>

            <View className="flex-row justify-between items-center pb-4 border-b border-border">
              <Text className="text-base text-muted">交易日期</Text>
              <Text className="text-base font-semibold text-foreground">
                {futures.date}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-base text-muted">品种代码</Text>
              <Text className="text-base font-semibold text-foreground">
                {futures.code}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
