import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

interface MonitoringData {
  timestamp: Date;
  soilMoisture: number;
  slopeInclination: number;
  rainfall: number;
  riverLevel: number;
}

export const MonitoringHistoryScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [selectedMetric, setSelectedMetric] = useState<'soilMoisture' | 'slopeInclination' | 'rainfall' | 'riverLevel'>('soilMoisture');
  
  // Valor inicial seguro que será sobrescrito por onChartContainerLayout
  const [chartWidth, setChartWidth] = useState(Dimensions.get('window').width); 

  // Função para obter a largura real do contêiner do gráfico
  const onChartContainerLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    // A largura disponível para o gráfico é a largura do chartContainer MENOS o padding horizontal.
    // O estilo `chartContainer` tem `paddingHorizontal: 16`, então 16 * 2 = 32.
    // Isso garante que o gráfico ocupe todo o espaço interno do seu contêiner.
    setChartWidth(width - 32); 
  };

  // Mock data - replace with actual data from API
  const mockData: MonitoringData[] = [
    // Seus dados mock...
    {
      timestamp: new Date('2024-03-20T00:00:00'),
      soilMoisture: 75,
      slopeInclination: 15,
      rainfall: 0,
      riverLevel: 2.1,
    },
    {
      timestamp: new Date('2024-03-20T02:00:00'),
      soilMoisture: 78,
      slopeInclination: 15,
      rainfall: 5,
      riverLevel: 2.2,
    },
    {
      timestamp: new Date('2024-03-20T04:00:00'),
      soilMoisture: 76,
      slopeInclination: 16,
      rainfall: 2,
      riverLevel: 2.1,
    },
    {
      timestamp: new Date('2024-03-20T06:00:00'),
      soilMoisture: 79,
      slopeInclination: 15,
      rainfall: 10,
      riverLevel: 2.3,
    },
    {
      timestamp: new Date('2024-03-20T08:00:00'),
      soilMoisture: 80,
      slopeInclination: 16,
      rainfall: 15,
      riverLevel: 2.4,
    },
    {
      timestamp: new Date('2024-03-20T10:00:00'),
      soilMoisture: 82,
      slopeInclination: 17,
      rainfall: 8,
      riverLevel: 2.5,
    },
    {
      timestamp: new Date('2024-03-20T12:00:00'),
      soilMoisture: 85,
      slopeInclination: 18,
      rainfall: 20,
      riverLevel: 2.6,
    },
    {
      timestamp: new Date('2024-03-20T14:00:00'),
      soilMoisture: 83,
      slopeInclination: 17,
      rainfall: 12,
      riverLevel: 2.5,
    },
    {
      timestamp: new Date('2024-03-20T16:00:00'),
      soilMoisture: 81,
      slopeInclination: 16,
      rainfall: 0,
      riverLevel: 2.4,
    },
    {
      timestamp: new Date('2024-03-20T18:00:00'),
      soilMoisture: 79,
      slopeInclination: 15,
      rainfall: 0,
      riverLevel: 2.3,
    },
    {
      timestamp: new Date('2024-03-20T20:00:00'),
      soilMoisture: 77,
      slopeInclination: 15,
      rainfall: 0,
      riverLevel: 2.2,
    },
    {
      timestamp: new Date('2024-03-20T22:00:00'),
      soilMoisture: 76,
      slopeInclination: 14,
      rainfall: 0,
      riverLevel: 2.1,
    },
    {
      timestamp: new Date('2024-03-21T00:00:00'),
      soilMoisture: 74,
      slopeInclination: 14,
      rainfall: 0,
      riverLevel: 2.0,
    },
  ];

  const getChartData = () => {
    // Filter data based on selectedPeriod and selectedMetric
    // For simplicity, using mockData directly, but you'd filter by timestamp

    let dataValues: number[] = [];
    let unit = '';

    switch (selectedMetric) {
      case 'soilMoisture':
        dataValues = mockData.map(data => data.soilMoisture);
        unit = '%';
        break;
      case 'slopeInclination':
        dataValues = mockData.map(data => data.slopeInclination);
        unit = '°';
        break;
      case 'rainfall':
        dataValues = mockData.map(data => data.rainfall);
        unit = 'mm';
        break;
      case 'riverLevel':
        dataValues = mockData.map(data => data.riverLevel);
        unit = 'm';
        break;
      default:
        break;
    }

    // Mantemos a lógica de geração de labels vazios para garantir que a biblioteca não tente
    // desenhar labels para cada ponto de dados se o número total de dados for muito alto.
    // No entanto, o `labelCount` no `chartConfig` será a principal forma de controle.
    const maxLabels = 10; 
    const dataLength = mockData.length;
    const labels: string[] = [];
    // O `step` agora ajuda a decidir quais pontos DEVERIAM ter um label se não fosse o `labelCount`
    // (ou se `labelCount` for ignorado por alguma razão pela biblioteca em certas condições).
    const step = Math.ceil(dataLength / maxLabels); 

    for (let i = 0; i < dataLength; i++) {
      const date = new Date(mockData[i].timestamp);
      if (i === 0 || i === dataLength - 1 || (i > 0 && i < dataLength - 1 && i % step === 0)) {
        labels.push(`${date.getHours()}h`);
      } else {
        labels.push('');
      }
    }


    return {
      labels: labels,
      datasets: [
        {
          data: dataValues,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Example blue color
          strokeWidth: 2,
        },
      ],
      unit: unit,
    };
  };

  const chartData = getChartData();

  const chartConfig = {
    backgroundColor: '#1C1C1E',
    backgroundGradientFrom: '#1C1C1E',
    backgroundGradientTo: '#1C1C1E',
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#007AFF',
    },
    yAxisLabel: '', // Example, adjust as needed
    yAxisSuffix: chartData.unit,
    yAxisInterval: 1, // optional, default 1
    
    // NOVO: Adicionado para controlar o número de rótulos exibidos no eixo X
    // Isso forçará a biblioteca a espaçar os rótulos de forma mais compacta
    labelCount: 5, // Tente 5, se ainda estiver muito grande, diminua para 4 ou 3
  };

  const getMetricTitle = (metric: 'soilMoisture' | 'slopeInclination' | 'rainfall' | 'riverLevel') => {
    switch (metric) {
      case 'soilMoisture': return 'Umidade do Solo';
      case 'slopeInclination': return 'Inclinação da Encosta';
      case 'rainfall': return 'Volume de Chuva';
      case 'riverLevel': return 'Nível do Rio';
      default: return '';
    }
  };

  const getStats = (metric: 'soilMoisture' | 'slopeInclination' | 'rainfall' | 'riverLevel') => {
    const dataValues = mockData.map(data => data[metric]);
    if (dataValues.length === 0) {
      return { min: 0, max: 0, avg: 0 };
    }
    const min = Math.min(...dataValues);
    const max = Math.max(...dataValues);
    const sum = dataValues.reduce((a, b) => a + b, 0);
    const avg = sum / dataValues.length;
    return { min, max, avg: parseFloat(avg.toFixed(1)) };
  };

  const stats = getStats(selectedMetric);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico de Monitoramento</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'day' && styles.selectedPeriod]}
          onPress={() => setSelectedPeriod('day')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'day' && styles.selectedPeriodText]}>Dia</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'week' && styles.selectedPeriod]}
          onPress={() => setSelectedPeriod('week')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'week' && styles.selectedPeriodText]}>Semana</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'month' && styles.selectedPeriod]}
          onPress={() => setSelectedPeriod('month')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'month' && styles.selectedPeriodText]}>Mês</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.metricSelector}>
        <TouchableOpacity
          style={[styles.metricButton, selectedMetric === 'soilMoisture' && styles.selectedMetric]}
          onPress={() => setSelectedMetric('soilMoisture')}
        >
          <Text style={[styles.metricText, selectedMetric === 'soilMoisture' && styles.selectedMetricText]}>Solo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.metricButton, selectedMetric === 'slopeInclination' && styles.selectedMetric]}
          onPress={() => setSelectedMetric('slopeInclination')}
        >
          <Text style={[styles.metricText, selectedMetric === 'slopeInclination' && styles.selectedMetricText]}>Inclinação</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.metricButton, selectedMetric === 'rainfall' && styles.selectedMetric]}
          onPress={() => setSelectedMetric('rainfall')}
        >
          <Text style={[styles.metricText, selectedMetric === 'rainfall' && styles.selectedMetricText]}>Chuva</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.metricButton, selectedMetric === 'riverLevel' && styles.selectedMetric]}
          onPress={() => setSelectedMetric('riverLevel')}
        >
          <Text style={[styles.metricText, selectedMetric === 'riverLevel' && styles.selectedMetricText]}>Rio</Text>
        </TouchableOpacity>
      </View>

      {/* Usando onLayout no chartContainer para pegar a largura disponível */}
      <View style={styles.chartContainer} onLayout={onChartContainerLayout}>
        <Text style={styles.chartTitle}>{getMetricTitle(selectedMetric)}</Text>
        {chartWidth > 0 && ( // Renderiza o gráfico apenas se a largura for maior que 0
          <LineChart
            data={chartData}
            width={chartWidth} // Usa a largura calculada dinamicamente
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Mín.</Text>
          <Text style={styles.statValue}>{stats.min}{chartData.unit}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Máx.</Text>
          <Text style={styles.statValue}>{stats.max}{chartData.unit}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Média</Text>
          <Text style={styles.statValue}>{stats.avg}{chartData.unit}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  filterButton: {
    padding: 8,
  },
  periodSelector: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  periodButton: {
    flex: 1,
    marginHorizontal: 4,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
  },
  selectedPeriod: {
    backgroundColor: '#007AFF',
  },
  periodText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  selectedPeriodText: {
    color: '#FFFFFF',
  },
  metricSelector: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  metricButton: {
    flex: 1,
    marginHorizontal: 4,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
  },
  selectedMetric: {
    backgroundColor: '#007AFF',
  },
  metricText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  selectedMetricText: {
    color: '#FFFFFF',
  },
  chartContainer: {
    paddingHorizontal: 16, // Importante para o cálculo da largura interna
    paddingVertical: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});