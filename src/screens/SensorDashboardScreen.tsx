import React, { useState } from 'react';
import { ScrollView, View, LayoutChangeEvent, StyleSheet } from 'react-native';
import SensorGraphContainer from '../components/SensorGraphContainer'; // Assumindo que este caminho está correto
import SensorChart from '../components/SensorChart'; // Assumindo que este caminho está correto

const SensorDashboardScreen: React.FC = () => {
  // Dados de exemplo para os sensores
  const temperatureData = {
    labels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
    datasets: [{
      data: [20, 22, 25, 23, 21],
      color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Exemplo de cor para Temperatura
      strokeWidth: 2,
    }],
  };

  const pressureData = {
    labels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
    datasets: [{
      data: [1013, 1015, 1012, 1014, 1013],
      color: (opacity = 1) => `rgba(53, 162, 235, ${opacity})`, // Exemplo de cor para Pressão
      strokeWidth: 2,
    }],
  };

  // Estados para armazenar a largura dos contêineres de cada gráfico
  const [tempChartDisplayWidth, setTempChartDisplayWidth] = useState(0);
  const [pressureChartDisplayWidth, setPressureChartDisplayWidth] = useState(0);

  // Função para capturar a largura do contêiner do gráfico de temperatura
  const onTempChartLayout = (event: LayoutChangeEvent) => {
    // A largura obtida aqui já é a largura interna do SensorGraphContainer
    setTempChartDisplayWidth(event.nativeEvent.layout.width);
  };

  // Função para capturar a largura do contêiner do gráfico de pressão
  const onPressureChartLayout = (event: LayoutChangeEvent) => {
    // A largura obtida aqui já é a largura interna do SensorGraphContainer
    setPressureChartDisplayWidth(event.nativeEvent.layout.width);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentWrapper}> {/* Wrapper para controlar padding e margins */}

        {/* SensorGraphContainer para Temperatura */}
        <SensorGraphContainer
          title="Temperatura (°C)"
          showLegend
          onLayout={onTempChartLayout} // Captura a largura APÓS o padding do SensorGraphContainer
        >
          {tempChartDisplayWidth > 0 && ( // Renderiza o gráfico somente quando a largura é conhecida
            <SensorChart
              data={temperatureData}
              title="Temperatura"
              width={tempChartDisplayWidth} // Passa a largura calculada
            />
          )}
        </SensorGraphContainer>

        <View style={styles.spacer} /> {/* Espaçador */}

        {/* SensorGraphContainer para Pressão */}
        <SensorGraphContainer
          title="Pressão (hPa)"
          showLegend
          onLayout={onPressureChartLayout} // Captura a largura APÓS o padding do SensorGraphContainer
        >
          {pressureChartDisplayWidth > 0 && ( // Renderiza o gráfico somente quando a largura é conhecida
            <SensorChart
              data={pressureData}
              title="Pressão"
              width={pressureChartDisplayWidth} // Passa a largura calculada
            />
          )}
        </SensorGraphContainer>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', // Ou sua cor de fundo original
  },
  contentWrapper: {
    paddingVertical: 20,
    paddingHorizontal: 16, // Define o padding geral do conteúdo
  },
  spacer: {
    height: 20, // Espaçador entre os gráficos
  },
});

export default SensorDashboardScreen;