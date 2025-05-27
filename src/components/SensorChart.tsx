import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { sensorGraphStyles } from '../styles/sensorGraphStyles';

const { width } = Dimensions.get('window');

interface SensorChartProps {
  data: any;
  title: string;
}

const SensorChart: React.FC<SensorChartProps> = ({ data, title }) => {
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#007AFF',
    },
  };

  return (
    <View style={chartStyle}>
      <LineChart
        data={data}
        width={width - 80}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          borderRadius: 16,
        }}
      />
    </View>  );
};

export default SensorChart;