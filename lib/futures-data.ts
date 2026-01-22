/**
 * 期货品种数据类型和工具
 */

export interface Futures {
  id: string;
  code: string; // 期货代码，如 "CU2406"
  name: string; // 品种名称，如 "沪铜"
  price: number; // 当前价格
  change: number; // 价格变化
  changePercent: number; // 涨跌幅 (%)
  tradingHours: string; // 交易时间
  date: string; // 日期 (YYYY-MM-DD)
}

export type DateFuturesMap = Record<string, Futures[]>;

/**
 * 生成模拟期货数据
 * 为多个日期生成不同的期货品种
 */
export function generateMockFuturesData(): DateFuturesMap {
  const futuresVarieties = [
    { code: "CU", name: "沪铜", basePrice: 72500 },
    { code: "AL", name: "沪铝", basePrice: 19800 },
    { code: "ZN", name: "沪锌", basePrice: 23500 },
    { code: "PB", name: "沪铅", basePrice: 18500 },
    { code: "RB", name: "螺纹钢", basePrice: 3850 },
    { code: "HC", name: "热卷", basePrice: 3650 },
    { code: "I", name: "铁矿石", basePrice: 820 },
    { code: "J", name: "焦炭", basePrice: 2480 },
    { code: "M", name: "豆粕", basePrice: 3150 },
    { code: "OI", name: "油菜籽油", basePrice: 8900 },
    { code: "RM", name: "菜籽粕", basePrice: 2650 },
    { code: "SR", name: "白糖", basePrice: 6150 },
    { code: "CF", name: "棉花", basePrice: 16500 },
    { code: "TA", name: "PTA", basePrice: 8850 },
    { code: "OI", name: "豆油", basePrice: 8200 },
  ];

  const data: DateFuturesMap = {};
  const today = new Date();

  // 为今天和未来30天生成数据
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    // 为每个日期随机选择 3-8 个期货品种
    const selectedCount = Math.floor(Math.random() * 6) + 3;
    const selectedVarieties = futuresVarieties
      .sort(() => Math.random() - 0.5)
      .slice(0, selectedCount);

    data[dateStr] = selectedVarieties.map((variety, index) => {
      const change = (Math.random() - 0.5) * 1000;
      const changePercent = (change / variety.basePrice) * 100;

      return {
        id: `${dateStr}-${variety.code}-${index}`,
        code: `${variety.code}2406`,
        name: variety.name,
        price: variety.basePrice + change,
        change: change,
        changePercent: changePercent,
        tradingHours: "09:00-15:00",
        date: dateStr,
      };
    });
  }

  return data;
}

/**
 * 获取指定日期的期货品种列表
 */
export function getFuturesForDate(
  data: DateFuturesMap,
  dateStr: string
): Futures[] {
  return data[dateStr] || [];
}

/**
 * 格式化价格
 */
export function formatPrice(price: number): string {
  return price.toFixed(2);
}

/**
 * 格式化涨跌幅百分比
 */
export function formatChangePercent(percent: number): string {
  const sign = percent > 0 ? "+" : "";
  return `${sign}${percent.toFixed(2)}%`;
}

/**
 * 判断是否上涨
 */
export function isRising(changePercent: number): boolean {
  return changePercent > 0;
}

/**
 * 判断是否下跌
 */
export function isFalling(changePercent: number): boolean {
  return changePercent < 0;
}
