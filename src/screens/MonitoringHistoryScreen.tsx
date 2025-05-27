import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
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

  // Mock data - replace with actual data from API
  const mockData: MonitoringData[] = [
    // Pluviômetro data (last 24 hours)
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
      soilMoisture: 82,
      slopeInclination: 15,
      rainfall: 12,
      riverLevel: 2.4,
    },
    {
      timestamp: new Date('2024-03-20T06:00:00'),
      soilMoisture: 85,
      slopeInclination: 15.2,
      rainfall: 25,
      riverLevel: 2.8,
    },
    {
      timestamp: new Date('2024-03-20T08:00:00'),
      soilMoisture: 88,
      slopeInclination: 15.3,
      rainfall: 35,
      riverLevel: 3.2,
    },
    {
      timestamp: new Date('2024-03-20T10:00:00'),
      soilMoisture: 90,
      slopeInclination: 15.5,
      rainfall: 45,
      riverLevel: 3.5,
    },
    {
      timestamp: new Date('2024-03-20T12:00:00'),
      soilMoisture: 92,
      slopeInclination: 15.8,
      rainfall: 55,
      riverLevel: 3.8,
    },
    {
      timestamp: new Date('2024-03-20T14:00:00'),
      soilMoisture: 95,
      slopeInclination: 16,
      rainfall: 65,
      riverLevel: 4.0,
    },
    {
      timestamp: new Date('2024-03-20T16:00:00'),
      soilMoisture: 93,
      slopeInclination: 15.9,
      rainfall: 55,
      riverLevel: 3.9,
    },
    {
      timestamp: new Date('2024-03-20T18:00:00'),
      soilMoisture: 90,
      slopeInclination: 15.7,
      rainfall: 45,
      riverLevel: 3.7,
    },
    {
      timestamp: new Date('2024-03-20T20:00:00'),
      soilMoisture: 87,
      slopeInclination: 15.5,
      rainfall: 35,
      riverLevel: 3.5,
    },
    {
      timestamp: new Date('2024-03-20T22:00:00'),
      soilMoisture: 85,
      slopeInclination: 15.3,
      rainfall: 25,
      riverLevel: 3.3,
    },
    {
      timestamp: new Date('2024-03-21T00:00:00'),
      soilMoisture: 82,
      slopeInclination: 15.2,
      rainfall: 15,
      riverLevel: 3.1,
    },
  ];

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'soilMoisture':
        return 'Umidade do Solo (%)';
      case 'slopeInclination':
        return 'Inclinação do Solo (°)';
      case 'rainfall':
        return 'Precipitação (mm/h)';
      case 'riverLevel':
        return 'Nível do Rio (m)';
      default:
        return '';
    }
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'soilMoisture':
        return '#4CAF50'; // Verde
      case 'slopeInclination':
        return '#FF9800'; // Laranja
      case 'rainfall':
        return '#2196F3'; // Azul
      case 'riverLevel':
        return '#9C27B0'; // Roxo
      default:
        return '#007AFF';
    }
  };

  const chartData = {
    labels: mockData.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        data: mockData.map(d => d[selectedMetric]),
        color: (opacity = 1) => getMetricColor(selectedMetric),
        strokeWidth: 2,
      },
    ],
  };

  const getMetricStats = () => {
    const values = mockData.map(d => d[selectedMetric]);
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    return {
      average: avg.toFixed(1),
      maximum: max.toFixed(1),
      minimum: min.toFixed(1),
    };
  };

  const stats = getMetricStats();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico de Monitoramento</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === 'day' && styles.selectedPeriod,
          ]}
          onPress={() => setSelectedPeriod('day')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'day' && styles.selectedPeriodText]}>
            Dia
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === 'week' && styles.selectedPeriod,
          ]}
          onPress={() => setSelectedPeriod('week')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'week' && styles.selectedPeriodText]}>
            Semana
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === 'month' && styles.selectedPeriod,
          ]}
          onPress={() => setSelectedPeriod('month')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'month' && styles.selectedPeriodText]}>
            Mês
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.metricSelector}>
        <TouchableOpacity
          style={[
            styles.metricButton,
            selectedMetric === 'soilMoisture' && styles.selectedMetric,
          ]}
          onPress={() => setSelectedMetric('soilMoisture')}
        >
          <Text style={[styles.metricText, selectedMetric === 'soilMoisture' && styles.selectedMetricText]}>
            Umidade
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.metricButton,
            selectedMetric === 'slopeInclination' && styles.selectedMetric,
          ]}
          onPress={() => setSelectedMetric('slopeInclination')}
        >
          <Text style={[styles.metricText, selectedMetric === 'slopeInclination' && styles.selectedMetricText]}>
            Inclinação
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.metricButton,
            selectedMetric === 'rainfall' && styles.selectedMetric,
          ]}
          onPress={() => setSelectedMetric('rainfall')}
        >
          <Text style={[styles.metricText, selectedMetric === 'rainfall' && styles.selectedMetricText]}>
            Chuva
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.metricButton,
            selectedMetric === 'riverLevel' && styles.selectedMetric,
          ]}
          onPress={() => setSelectedMetric('riverLevel')}
        >
          <Text style={[styles.metricText, selectedMetric === 'riverLevel' && styles.selectedMetricText]}>
            Rio
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{getMetricLabel(selectedMetric)}</Text>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#000000',
            backgroundGradientFrom: '#000000',
            backgroundGradientTo: '#000000',
            decimalPlaces: 1,
            color: (opacity = 1) => getMetricColor(selectedMetric),
            labelColor: (opacity = 1) => '#FFFFFF',
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: getMetricColor(selectedMetric),
            },
            propsForBackgroundLines: {
              stroke: '#2C2C2E',
              strokeWidth: 1,
            },
            propsForLabels: {
              fontSize: 12,
              fill: '#FFFFFF',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Média</Text>
          <Text style={styles.statValue}>{stats.average}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Máximo</Text>
          <Text style={styles.statValue}>{stats.maximum}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Mínimo</Text>
          <Text style={styles.statValue}>{stats.minimum}</Text>
        </View>
      </View>

      <View style={styles.analysisContainer}>
        <Text style={styles.analysisTitle}>Análise</Text>
        <Text style={styles.analysisText}>
          {selectedMetric === 'soilMoisture' && 'A umidade do solo aumentou significativamente durante o período de chuva, atingindo níveis críticos que podem indicar risco de deslizamento.'}
          {selectedMetric === 'slopeInclination' && 'A inclinação do solo apresentou pequenas variações, mas permanece dentro dos limites seguros. Monitoramento contínuo é necessário.'}
          {selectedMetric === 'rainfall' && 'Precipitação intensa registrada entre 10h e 14h, com pico de 65mm/h. Risco de alagamento e deslizamento.'}
          {selectedMetric === 'riverLevel' && 'Nível do rio subiu 1.9m em 24h devido à chuva intensa. Atingiu nível de alerta às 14h.'}
        </Text>
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
    padding: 16,
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
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  analysisContainer: {
    padding: 16,
    backgroundColor: '#1C1C1E',
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  analysisText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
}); 