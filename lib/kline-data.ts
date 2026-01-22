/**
 * K线数据生成和处理工具
 */

export interface KlineData {
  timestamp: number; // 时间戳 (毫秒)
  open: number; // 开盘价
  high: number; // 最高价
  low: number; // 最低价
  close: number; // 收盘价
  volume: number; // 成交量
}

export interface KlineChartData {
  futuresCode: string;
  futuresName: string;
  period: "1m" | "5m" | "15m" | "1h" | "1d"; // K线周期
  data: KlineData[];
}

/**
 * 生成模拟K线数据
 * @param basePrice 基础价格
 * @param count 生成的K线数量
 * @param interval 时间间隔 (毫秒)
 */
export function generateMockKlineData(
  basePrice: number,
  count: number = 60,
  interval: number = 60000 // 默认1分钟
): KlineData[] {
  const data: KlineData[] = [];
  let currentTime = Date.now() - count * interval;
  let price = basePrice;

  for (let i = 0; i < count; i++) {
    // 随机生成价格波动 (-2% 到 +2%)
    const priceChange = (Math.random() - 0.5) * 0.04 * price;
    const open = price;
    const close = price + priceChange;

    // 生成高低价
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);

    // 生成成交量 (随机)
    const volume = Math.floor(Math.random() * 100000) + 10000;

    data.push({
      timestamp: currentTime,
      open,
      high,
      low,
      close,
      volume,
    });

    price = close;
    currentTime += interval;
  }

  return data;
}

/**
 * 获取K线数据的统计信息
 */
export function getKlineStats(data: KlineData[]) {
  if (data.length === 0) {
    return { high: 0, low: 0, avg: 0, volume: 0 };
  }

  const closes = data.map((k) => k.close);
  const highs = data.map((k) => k.high);
  const lows = data.map((k) => k.low);
  const volumes = data.map((k) => k.volume);

  const high = Math.max(...highs);
  const low = Math.min(...lows);
  const avg = closes.reduce((a, b) => a + b, 0) / closes.length;
  const volume = volumes.reduce((a, b) => a + b, 0);

  return { high, low, avg, volume };
}

/**
 * 计算简单移动平均线 (SMA)
 */
export function calculateSMA(data: KlineData[], period: number): number[] {
  const sma: number[] = [];
  const closes = data.map((k) => k.close);

  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1) {
      sma.push(0);
    } else {
      const sum = closes.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
  }

  return sma;
}

/**
 * 计算相对强弱指数 (RSI)
 */
export function calculateRSI(data: KlineData[], period: number = 14): number[] {
  const closes = data.map((k) => k.close);
  const rsi: number[] = [];

  for (let i = 0; i < closes.length; i++) {
    if (i < period) {
      rsi.push(50);
    } else {
      let gains = 0;
      let losses = 0;

      for (let j = i - period + 1; j <= i; j++) {
        const change = closes[j] - closes[j - 1];
        if (change > 0) {
          gains += change;
        } else {
          losses += -change;
        }
      }

      const avgGain = gains / period;
      const avgLoss = losses / period;
      const rs = avgGain / avgLoss;
      const rsiValue = 100 - 100 / (1 + rs);

      rsi.push(rsiValue);
    }
  }

  return rsi;
}

/**
 * 格式化时间戳为时间字符串
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * 格式化日期为日期字符串
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}
