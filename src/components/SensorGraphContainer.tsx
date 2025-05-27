import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { sensorGraphStyles } from '../styles/sensorGraphStyles';

interface SensorGraphContainerProps {
  title: string;
  children: React.ReactNode;
  showLegend?: boolean;
}

const SensorGraphContainer: React.FC<SensorGraphContainerProps> = ({ 
  title, 
  children, 
  showLegend = false 
}) => {
  return (
    <View style={sensorGraphStyles.graphContainer}>
      <Text style={sensorGraphStyles.graphTitle}>{title}</Text>
      
      <View style={sensorGraphStyles.chartContainer}>
        <View style={sensorGraphStyles.graphWrapper}>
          {children}
        </View>
        
        {showLegend && (
          <View style={sensorGraphStyles.legendContainer}>
            {/* Adicione aqui os componentes de legenda */}
          </View>
        )}
      </View>
    </View>
  );
};

export default SensorGraphContainer;