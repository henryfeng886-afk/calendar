import React, { useEffect } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import type { Futures } from "@/lib/futures-data";
import { formatPrice, formatChangePercent, isRising } from "@/lib/futures-data";
import { cn } from "@/lib/utils";

interface FuturesListProps {
  futures: Futures[];
  onFuturesPress?: (futures: Futures) => void;
  date: string;
}

export function FuturesList({
  futures,
  onFuturesPress,
  date,
}: FuturesListProps) {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // 动画：从下方滑入
    translateY.value = withTiming(0, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(1, {
      duration: 400,
    });
  }, [date, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const renderFuturesItem = ({ item }: { item: Futures }) => {
    const changeColor = isRising(item.changePercent) ? "text-success" : "text-error";
    const changeBgColor = isRising(item.changePercent) ? "bg-success/10" : "bg-error/10";

    return (
      <Pressable
        onPress={() => onFuturesPress?.(item)}
        className="mb-3 active:opacity-70"
      >
        <View className="bg-surface rounded-xl p-4 border border-border">
          {/* 品种名称和代码 */}
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-base font-semibold text-foreground">
                {item.name}
              </Text>
              <Text className="text-xs text-muted mt-1">{item.code}</Text>
            </View>
            <View
              className={cn(
                "px-3 py-1 rounded-full",
                changeBgColor
              )}
            >
              <Text className={cn("text-xs font-semibold", changeColor)}>
                {formatChangePercent(item.changePercent)}
              </Text>
            </View>
          </View>

          {/* 价格信息 */}
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs text-muted mb-1">当前价格</Text>
              <Text className="text-lg font-bold text-foreground">
                {formatPrice(item.price)}
              </Text>
            </View>
            <View>
              <Text className="text-xs text-muted mb-1">价格变化</Text>
              <Text className={cn("text-lg font-bold", changeColor)}>
                {item.change > 0 ? "+" : ""}{formatPrice(item.change)}
              </Text>
            </View>
            <View>
              <Text className="text-xs text-muted mb-1">交易时间</Text>
              <Text className="text-sm font-medium text-foreground">
                {item.tradingHours}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  if (futures.length === 0) {
    return (
      <Animated.View style={animatedStyle}>
        <View className="items-center justify-center py-8">
          <Text className="text-base text-muted">该日期暂无期货品种</Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={animatedStyle}>
      <FlatList
        data={futures}
        renderItem={renderFuturesItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        nestedScrollEnabled={false}
      />
    </Animated.View>
  );
}
