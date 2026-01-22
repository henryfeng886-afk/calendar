import React, { useMemo } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import Svg, { Line, Rect, G, Text as SvgText } from "react-native-svg";
import type { KlineData } from "@/lib/kline-data";
import { calculateSMA, formatTimestamp, getKlineStats } from "@/lib/kline-data";

interface KlineChartProps {
  data: KlineData[];
  height?: number;
  showSMA?: boolean;
}

export function KlineChart({
  data,
  height = 300,
  showSMA = true,
}: KlineChartProps) {
  const { width } = Dimensions.get("window");
  const chartWidth = width - 32; // 减去padding
  const chartHeight = height;
  const padding = 40;

  const stats = useMemo(() => getKlineStats(data), [data]);
  const sma20 = useMemo(() => (showSMA ? calculateSMA(data, 20) : []), [data, showSMA]);

  // 计算缩放因子
  const priceRange = stats.high - stats.low;
  const priceScale = (chartHeight - padding * 2) / priceRange;
  const timeScale = (chartWidth - padding * 2) / (data.length - 1);

  // 将价格转换为Y坐标
  const priceToY = (price: number) => {
    return chartHeight - padding - (price - stats.low) * priceScale;
  };

  // 将索引转换为X坐标
  const indexToX = (index: number) => {
    return padding + index * timeScale;
  };

  // 计算K线宽度
  const klineWidth = Math.max(2, timeScale * 0.6);
  const wickWidth = Math.max(0.5, timeScale * 0.1);

  return (
    <View className="bg-surface rounded-xl p-4 border border-border mb-4">
      {/* 标题 */}
      <View className="mb-4">
        <Text className="text-lg font-semibold text-foreground">K线走势</Text>
        <View className="flex-row gap-4 mt-2">
          <View>
            <Text className="text-xs text-muted">最高</Text>
            <Text className="text-sm font-semibold text-foreground">
              {stats.high.toFixed(2)}
            </Text>
          </View>
          <View>
            <Text className="text-xs text-muted">最低</Text>
            <Text className="text-sm font-semibold text-foreground">
              {stats.low.toFixed(2)}
            </Text>
          </View>
          <View>
            <Text className="text-xs text-muted">平均</Text>
            <Text className="text-sm font-semibold text-foreground">
              {stats.avg.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* K线图表 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Svg width={chartWidth} height={chartHeight}>
          {/* 背景网格 */}
          <G>
            {Array.from({ length: 5 }).map((_, i) => {
              const y = padding + (i * (chartHeight - padding * 2)) / 4;
              const price = stats.high - (i * priceRange) / 4;
              return (
                <G key={`grid-${i}`}>
                  <Line
                    x1={padding}
                    y1={y}
                    x2={chartWidth - padding}
                    y2={y}
                    stroke="#E5E7EB"
                    strokeWidth="0.5"
                    opacity="0.5"
                  />
                  <SvgText
                    x={padding - 5}
                    y={y + 4}
                    fontSize="10"
                    fill="#687076"
                    textAnchor="end"
                  >
                    {price.toFixed(0)}
                  </SvgText>
                </G>
              );
            })}
          </G>

          {/* SMA20线 */}
          {showSMA && sma20.length > 0 && (
            <G>
              {sma20.map((sma, i) => {
                if (i === 0 || sma === 0) return null;
                const prevSma = sma20[i - 1];
                if (prevSma === 0) return null;

                return (
                  <Line
                    key={`sma-${i}`}
                    x1={indexToX(i - 1)}
                    y1={priceToY(prevSma)}
                    x2={indexToX(i)}
                    y2={priceToY(sma)}
                    stroke="#0a7ea4"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                );
              })}
            </G>
          )}

          {/* K线 */}
          <G>
            {data.map((kline, index) => {
              const x = indexToX(index);
              const openY = priceToY(kline.open);
              const closeY = priceToY(kline.close);
              const highY = priceToY(kline.high);
              const lowY = priceToY(kline.low);

              const isRising = kline.close >= kline.open;
              const bodyColor = isRising ? "#22C55E" : "#EF4444";
              const bodyTop = Math.min(openY, closeY);
              const bodyHeight = Math.abs(closeY - openY) || 1;

              return (
                <G key={`kline-${index}`}>
                  {/* 影线 (High-Low) */}
                  <Line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={bodyColor}
                    strokeWidth={wickWidth}
                  />

                  {/* 实体 (Open-Close) */}
                  <Rect
                    x={x - klineWidth / 2}
                    y={bodyTop}
                    width={klineWidth}
                    height={bodyHeight}
                    fill={bodyColor}
                    opacity="0.8"
                  />
                </G>
              );
            })}
          </G>

          {/* 时间轴标签 */}
          <G>
            {data.map((kline, index) => {
              // 每10个K线显示一个时间标签
              if (index % 10 !== 0) return null;

              const x = indexToX(index);
              const timeStr = formatTimestamp(kline.timestamp);

              return (
                <SvgText
                  key={`time-${index}`}
                  x={x}
                  y={chartHeight - 5}
                  fontSize="10"
                  fill="#687076"
                  textAnchor="middle"
                >
                  {timeStr}
                </SvgText>
              );
            })}
          </G>
        </Svg>
      </ScrollView>

      {/* 图例 */}
      <View className="flex-row gap-4 mt-4 pt-4 border-t border-border">
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 bg-success rounded-sm" />
          <Text className="text-xs text-muted">上涨</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 bg-error rounded-sm" />
          <Text className="text-xs text-muted">下跌</Text>
        </View>
        {showSMA && (
          <View className="flex-row items-center gap-2">
            <View className="w-3 h-0.5 bg-primary" />
            <Text className="text-xs text-muted">SMA20</Text>
          </View>
        )}
      </View>
    </View>
  );
}
