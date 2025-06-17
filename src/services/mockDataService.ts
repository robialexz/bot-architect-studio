export interface MockDataPoint {
  value: number;
  timestamp: number;
}

export interface MockDataSource {
  name: string;
  currentData: MockDataPoint;
  history: MockDataPoint[];
  updateInterval: number; // in milliseconds
  getValue: () => number; // Function to generate next value
}

const generateRandomValue = (min: number, max: number) => Math.random() * (max - min) + min;

const generateSineWaveValue = (
  time: number,
  amplitude: number,
  period: number,
  phase: number,
  offset: number
) => {
  return amplitude * Math.sin(((2 * Math.PI) / period) * time + phase) + offset;
};

let socialSentimentTime = 0;
let marketIndexTime = 0;
const apiStatsTime = 0;

const dataSources: MockDataSource[] = [
  {
    name: 'Social Sentiment',
    currentData: { value: 50, timestamp: Date.now() },
    history: [],
    updateInterval: 3000, // 3 seconds
    getValue: () => {
      socialSentimentTime += 0.1;
      // Fluctuates between 0 and 100, simulating sentiment percentage
      return generateSineWaveValue(socialSentimentTime, 40, 200, Math.random() * Math.PI, 50);
    },
  },
  {
    name: 'Market Index',
    currentData: { value: 1500, timestamp: Date.now() },
    history: [],
    updateInterval: 2000, // 2 seconds
    getValue: () => {
      marketIndexTime += 0.1;
      // Simulates a stock market index, generally trending upwards with volatility
      const trend = marketIndexTime * 0.5;
      const volatility = generateRandomValue(-25, 25);
      return Math.max(
        1000,
        1500 +
          trend +
          volatility +
          generateSineWaveValue(marketIndexTime, 50, 150, Math.random() * Math.PI, 0)
      );
    },
  },
  {
    name: 'API Stats',
    currentData: { value: 75, timestamp: Date.now() },
    history: [],
    updateInterval: 5000, // 5 seconds
    getValue: () => {
      // Simulates API usage, e.g., requests per second, fluctuating around a mean
      return generateRandomValue(50, 100);
    },
  },
];

export type DataSourcesListener = (updatedDataSources: MockDataSource[]) => void;

const listeners: DataSourcesListener[] = [];

const updateDataSource = (source: MockDataSource) => {
  const newValue = source.getValue();
  source.history.push(source.currentData);
  if (source.history.length > 50) {
    // Keep a limited history
    source.history.shift();
  }
  source.currentData = { value: newValue, timestamp: Date.now() };
};

dataSources.forEach(source => {
  setInterval(() => {
    updateDataSource(source);
    notifyListeners();
  }, source.updateInterval);
});

const notifyListeners = () => {
  // Create a deep copy to avoid unintended modifications by listeners
  const dataSourcesCopy = JSON.parse(JSON.stringify(dataSources));
  listeners.forEach(listener => listener(dataSourcesCopy));
};

export const subscribeToDataSources = (listener: DataSourcesListener): (() => void) => {
  listeners.push(listener);
  // Immediately notify with current data
  listener(JSON.parse(JSON.stringify(dataSources)));

  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

export const getInitialDataSources = (): MockDataSource[] => {
  return JSON.parse(JSON.stringify(dataSources));
};

// Initialize data
dataSources.forEach(source => {
  updateDataSource(source);
});
