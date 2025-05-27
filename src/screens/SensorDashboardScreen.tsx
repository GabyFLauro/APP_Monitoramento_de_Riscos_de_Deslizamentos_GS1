import React from 'react';
import { ScrollView, View } from 'react-native';
import SensorGraphContainer from '../components/SensorGraphContainer';
import SensorChart from '../components/SensorChart';
import { sensorGraphStyles } from '../styles/sensorGraphStyles';
import { getSensorGraphLayout } from '../utils/sensorLayoutUtils';

const SensorDashboardScreen: React.FC = () => {
  const layout = getSensorGraphLayout();
  
  // Dados de exemplo para os sensores
  const temperatureData = {
    labels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
    datasets: [{
      data: [20, 22, 25, 23, 21],
    }],
  };

  const pressureData = {
    labels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
    datasets: [{
      data: [1013, 1015, 1012, 1014, 1013],
    }],
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F2F2F7' }}>
      <View style={{ paddingVertical: 20 }}>
        
        <SensorGraphContainer title="Temperatura (°C)" showLegend>
          <SensorChart data={temperatureData} title="Temperatura" />
        </SensorGraphContainer>

        <View style={{ height: 24 }} />

        <SensorGraphContainer title="Pressão (hPa)" showLegend>
          <SensorChart data={pressureData} title="Pressão" />
        </SensorGraphContainer>

        <View style={{ height: 24 }} />

        {/* Adicione mais gráficos conforme necessário */}
        
      </View>
    </ScrollView>
  );
};

export default SensorDashboardScreen;