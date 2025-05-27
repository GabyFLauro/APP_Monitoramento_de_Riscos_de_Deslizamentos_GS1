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
        data: [65, 70, 68, 72, 75, 73, sensor.lastReading.value],
      },
    ],
  };

  const getRiskLevel = () => {
    const assessment = riskAssessments.find(
      (r) =>
        r.location.latitude === sensor.location.latitude &&
        r.location.longitude === sensor.location.longitude
    );
    return assessment?.riskLevel || 'low';
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return '#4CAF50';
      case 'medium':
        return '#FFC107';
      case 'high':
        return '#FF9800';
      case 'critical':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const handleSaveAlertConfig = () => {
    const warningValue = parseFloat(alertThresholds.warning);
    const criticalValue = parseFloat(alertThresholds.critical);

    if (isNaN(warningValue) || isNaN(criticalValue)) {
      Alert.alert('Erro', 'Por favor, insira valores válidos para os alertas');
      return;
    }

    if (warningValue >= criticalValue) {
      Alert.alert('Erro', 'O valor de alerta deve ser menor que o valor crítico');
      return;
    }

    // TODO: Implement actual alert configuration saving
    Alert.alert(
      'Sucesso',
      'Configurações de alerta salvas com sucesso',
      [{ text: 'OK', onPress: () => setShowAlertModal(false) }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sensorName}>{sensor.name}</Text>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getRiskColor(getRiskLevel()) },
          ]}
        />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Última Leitura</Text>
        <Text style={styles.infoValue}>
          {sensor.lastReading.value} {sensor.lastReading.unit}
        </Text>
        <Text style={styles.infoTimestamp}>
          {new Date(sensor.lastReading.timestamp).toLocaleString()}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Histórico</Text>
        <LineChart
          data={historicalData}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#1C1C1E',
            backgroundGradientFrom: '#1C1C1E',
            backgroundGradientTo: '#1C1C1E',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#007AFF'
            }
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Informações do Sensor</Text>
        <View style={styles.infoRow}>
          <Ionicons name="battery-charging-outline" size={20} color="#4CAF50" />
          <Text style={styles.infoText}>Bateria: {sensor.batteryLevel}%</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="wifi-outline" size={20} color="#4CAF50" />
          <Text style={styles.infoText}>
            Sinal: {sensor.signalStrength}%
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color="#4CAF50" />
          <Text style={styles.infoText}>
            Lat: {sensor.location.latitude.toFixed(4)}, Long:{' '}
            {sensor.location.longitude.toFixed(4)}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.alertButton}
        onPress={() => setShowAlertModal(true)}
      >
        <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
        <Text style={styles.alertButtonText}>Configurar Alertas</Text>
      </TouchableOpacity>

      <Modal
        visible={showAlertModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAlertModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Configurar Alertas</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAlertModal(false)}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalSubtitle}>
                Configure os valores para alertas de {sensor?.name}
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Valor de Alerta ({sensor?.lastReading.unit})</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 50"
                  placeholderTextColor="#8E8E93"
                  keyboardType="numeric"
                  value={alertThresholds.warning}
                  onChangeText={(text) =>
                    setAlertThresholds({ ...alertThresholds, warning: text })
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Valor Crítico ({sensor?.lastReading.unit})</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 75"
                  placeholderTextColor="#8E8E93"
                  keyboardType="numeric"
                  value={alertThresholds.critical}
                  onChangeText={(text) =>
                    setAlertThresholds({ ...alertThresholds, critical: text })
                  }
                />
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowAlertModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSaveAlertConfig}
                >
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
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
  sensorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  infoCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  infoTimestamp: {
    fontSize: 14,
    color: '#8E8E93',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#FFFFFF',
  },
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  alertButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    textAlign: 'center',
    color: '#F44336',
    fontSize: 16,
    marginTop: 16,
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
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#2C2C2E',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
