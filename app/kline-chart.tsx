import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View, Pressable } from "react-native";
import { useMemo } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { KlineChart } from "@/components/kline-chart";
import type { Futures } from "@/lib/futures-data";
import {
  generateMockKlineData,
  getKlineStats,
  calculateSMA,
  calculateRSI,
} from "@/lib/kline-data";
import { cn } from "@/lib/utils";

export default function KlineChartScreen() {
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

  // 生成模拟K线数据
  const klineData = useMemo(() => {
    if (!futures) return [];
    // 使用期货的当前价格作为基础价格
    return generateMockKlineData(futures.price, 60, 60000); // 60条1分钟K线
  }, [futures]);

  const stats = useMemo(() => {
    if (klineData.length === 0) return { high: 0, low: 0, avg: 0, volume: 0 };
    const closes = klineData.map((k: any) => k.close);
    const highs = klineData.map((k: any) => k.high);
    const lows = klineData.map((k: any) => k.low);
    const volumes = klineData.map((k: any) => k.volume);

    return {
      high: Math.max(...highs),
      low: Math.min(...lows),
      avg: closes.reduce((a: number, b: number) => a + b, 0) / closes.length,
      volume: volumes.reduce((a: number, b: number) => a + b, 0),
    };
  }, [klineData]);

  const sma20 = useMemo(() => {
    if (klineData.length === 0) return [];
    return calculateSMA(klineData, 20);
  }, [klineData]);

  const rsi = useMemo(() => {
    if (klineData.length === 0) return [];
    return calculateRSI(klineData, 14);
  }, [klineData]);

  const currentRSI = rsi.length > 0 ? rsi[rsi.length - 1] : 50;

  if (!futures || klineData.length === 0) {
    return (
      <ScreenContainer className="p-4">
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-muted">无法加载K线数据</Text>
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

  const changeColor =
    futures.changePercent > 0 ? "text-success" : "text-error";
  const changeBgColor =
    futures.changePercent > 0 ? "bg-success/10" : "bg-error/10";

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* 返回按钮 */}
        <Pressable
          onPress={() => router.back()}
          className="mb-4 flex-row items-center active:opacity-70"
        >
          <Text className="text-lg text-primary">← 返回</Text>
        </Pressable>

        {/* 品种信息 */}
        <View className="bg-surface rounded-2xl p-6 mb-4 border border-border">
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
                {futures.changePercent > 0 ? "+" : ""}
                {futures.changePercent.toFixed(2)}%
              </Text>
            </View>
          </View>

          {/* 价格信息 */}
          <View className="border-t border-border pt-4">
            <View className="flex-row justify-between">
              <View>
                <Text className="text-sm text-muted mb-2">当前价格</Text>
                <Text className="text-2xl font-bold text-foreground">
                  {futures.price.toFixed(2)}
                </Text>
              </View>
              <View>
                <Text className="text-sm text-muted mb-2">价格变化</Text>
                <Text className={cn("text-2xl font-bold", changeColor)}>
                  {futures.change > 0 ? "+" : ""}
                  {futures.change.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* K线图表 */}
        <KlineChart data={klineData} height={300} showSMA={true} />

        {/* 技术指标 */}
        <View className="bg-surface rounded-2xl p-6 border border-border mb-4">
          <Text className="text-lg font-semibold text-foreground mb-4">
            技术指标
          </Text>

          <View className="space-y-3">
            <View className="flex-row justify-between items-center pb-3 border-b border-border">
              <Text className="text-base text-muted">最高价</Text>
              <Text className="text-base font-semibold text-foreground">
                {stats.high.toFixed(2)}
              </Text>
            </View>

            <View className="flex-row justify-between items-center pb-3 border-b border-border">
              <Text className="text-base text-muted">最低价</Text>
              <Text className="text-base font-semibold text-foreground">
                {stats.low.toFixed(2)}
              </Text>
            </View>

            <View className="flex-row justify-between items-center pb-3 border-b border-border">
              <Text className="text-base text-muted">平均价</Text>
              <Text className="text-base font-semibold text-foreground">
                {stats.avg.toFixed(2)}
              </Text>
            </View>

            <View className="flex-row justify-between items-center pb-3 border-b border-border">
              <Text className="text-base text-muted">成交量</Text>
              <Text className="text-base font-semibold text-foreground">
                {(stats.volume / 1000000).toFixed(2)}M
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-base text-muted">RSI(14)</Text>
                <Text className="text-xs text-muted mt-1">相对强弱指数</Text>
              </View>
              <View
                className={cn(
                  "px-3 py-1 rounded-lg",
                  currentRSI > 70
                    ? "bg-error/10"
                    : currentRSI < 30
                      ? "bg-success/10"
                      : "bg-border"
                )}
              >
                <Text
                  className={cn(
                    "text-sm font-semibold",
                    currentRSI > 70
                      ? "text-error"
                      : currentRSI < 30
                        ? "text-success"
                        : "text-foreground"
                  )}
                >
                  {currentRSI.toFixed(2)}
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

          <View className="space-y-3">
            <View className="flex-row justify-between items-center pb-3 border-b border-border">
              <Text className="text-base text-muted">交易时间</Text>
              <Text className="text-base font-semibold text-foreground">
                {futures.tradingHours}
              </Text>
            </View>

            <View className="flex-row justify-between items-center pb-3 border-b border-border">
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
