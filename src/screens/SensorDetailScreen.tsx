import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  LayoutChangeEvent, // Importação adicionada
} from 'react-native';
import { useSensors } from '../contexts/SensorContext';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

type SensorDetailRouteProp = RouteProp<RootStackParamList, 'SensorDetail'>;

export const SensorDetailScreen: React.FC = () => {
  const route = useRoute<SensorDetailRouteProp>();
  const { sensors, riskAssessments } = useSensors();
  const sensor = sensors.find((s) => s.id === route.params.sensorId);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertThresholds, setAlertThresholds] = useState({
    warning: '',
    critical: '',
  });
  const [chartWidth, setChartWidth] = useState(Dimensions.get('window').width - 32); // Valor inicial

  // Função para obter a largura real do 'chartCard'
  const onChartCardLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    // O styles.chartCard tem padding: 16 (total de 32 horizontal)
    setChartWidth(width - 32); // Subtrai o padding horizontal do card
  };

  if (!sensor) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Sensor não encontrado</Text>
      </View>
    );
  }

  // Mock historical data for the chart
  const historicalData = {
    labels: ['12h', '10h', '8h', '6h', '4h', '2h', 'Agora'],
    datasets: [
      {
        data: [65, 70, 68, 72, 75, 73, 78], // Example values for soil moisture
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Blue for soil moisture
        strokeWidth: 2,
      },
    ],
  };

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
    // Make sure yAxisLabel and yAxisSuffix are appropriate for the metric
    yAxisLabel: '',
    yAxisSuffix: '%',
    yAxisInterval: 1,
  };

  const handleSaveAlertThresholds = () => {
    const warning = parseFloat(alertThresholds.warning);
    const critical = parseFloat(alertThresholds.critical);

    if (isNaN(warning) || isNaN(critical)) {
      Alert.alert('Erro', 'Por favor, insira valores numéricos válidos para os limites.');
      return;
    }

    if (warning >= critical) {
      Alert.alert('Erro', 'O limite de aviso deve ser menor que o limite crítico.');
      return;
    }

    // Aqui você enviaria os limites atualizados para o seu backend ou contexto
    Alert.alert('Sucesso', `Limites de alerta para ${sensor.name} atualizados:\nAviso: ${warning}\nCrítico: ${critical}`);
    setShowAlertModal(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{sensor.name}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => { /* navigation.goBack() */ }}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Text style={styles.cardTitle}>Status Atual</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: sensor.status === 'active' ? '#4CAF50' : sensor.status === 'warning' ? '#FFC107' : '#F44336' }]} />
            <Text style={styles.statusText}>
              {sensor.status === 'active' ? 'Ativo' : sensor.status === 'warning' ? 'Aviso' : 'Crítico'}
            </Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Última Leitura:</Text>
          <Text style={styles.detailValue}>
            {sensor.lastReading.value} {sensor.lastReading.unit} ({new Date(sensor.lastReading.timestamp).toLocaleString()})
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Nível da Bateria:</Text>
          <Text style={styles.detailValue}>{sensor.batteryLevel}%</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Força do Sinal:</Text>
          <Text style={styles.detailValue}>{sensor.signalStrength} dBm</Text>
        </View>
      </View>

      {/* Usando onLayout no chartCard para pegar a largura disponível */}
      <View style={styles.chartCard} onLayout={onChartCardLayout}>
        <Text style={styles.cardTitle}>Histórico de Dados</Text>
        {chartWidth > 0 && ( // Renderiza o gráfico apenas se a largura for maior que 0
          <LineChart
            data={historicalData}
            width={chartWidth} // Usa a largura calculada dinamicamente
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        )}
      </View>

      <View style={styles.alertCard}>
        <Text style={styles.cardTitle}>Limites de Alerta</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Aviso:</Text>
          <Text style={styles.detailValue}>70%</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Crítico:</Text>
          <Text style={styles.detailValue}>85%</Text>
        </View>
        <TouchableOpacity style={styles.setAlertButton} onPress={() => setShowAlertModal(true)}>
          <Ionicons name="settings-outline" size={20} color="#FFFFFF" />
          <Text style={styles.setAlertButtonText}>Definir Limites</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showAlertModal}
        onRequestClose={() => setShowAlertModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Definir Limites de Alerta</Text>
              <TouchableOpacity onPress={() => setShowAlertModal(false)} style={styles.closeButton}>
                <Ionicons name="close-circle-outline" size={28} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalSubtitle}>Insira os novos limites para {sensor.name}:</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Limite de Aviso (%)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Ex: 70"
                  placeholderTextColor="#8E8E93"
                  value={alertThresholds.warning}
                  onChangeText={(text) => setAlertThresholds({ ...alertThresholds, warning: text })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Limite Crítico (%)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Ex: 85"
                  placeholderTextColor="#8E8E93"
                  value={alertThresholds.critical}
                  onChangeText={(text) => setAlertThresholds({ ...alertThresholds, critical: text })}
                />
              </View>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveAlertThresholds}>
                <Text style={styles.saveButtonText}>Salvar Limites</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  backButton: {
    padding: 8,
  },
  errorText: {
    textAlign: 'center',
    color: '#F44336',
    fontSize: 16,
    marginTop: 16,
  },
  statusCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    marginBottom: 16,
  },
  chartCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16, // Este padding é importante para o cálculo da largura
    marginBottom: 16,
  },
  alertCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  setAlertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 10,
  },
  setAlertButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    width: '90%',
    maxWidth: 500,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});