import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Modal,
} from 'react-native';
import { useSensors } from '../contexts/SensorContext';
import { SensorData, Alert } from '../types/sensors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface SensorStatus {
  id: string;
  type: string;
  name: string;
  lastReading: {
    value: number;
    unit: string;
    timestamp: Date;
  };
  status: 'active' | 'inactive' | 'warning' | 'critical';
  batteryLevel: number;
  signalStrength: number;
  location: {
    latitude: number;
    longitude: number;
  };
  details: {
    manufacturer: string;
    model: string;
    installationDate: Date;
    lastMaintenance: Date;
    nextMaintenance: Date;
    calibrationStatus: 'calibrated' | 'needs_calibration' | 'overdue';
  };
}

const SensorCard: React.FC<{ sensor: SensorStatus }> = ({ sensor }) => {
  const navigation = useNavigation();
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'warning':
        return '#FFC107';
      case 'critical':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getCalibrationStatusColor = (status: string) => {
    switch (status) {
      case 'calibrated':
        return '#4CAF50';
      case 'needs_calibration':
        return '#FFC107';
      case 'overdue':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getCalibrationStatusText = (status: string) => {
    switch (status) {
      case 'calibrated':
        return 'Calibrado';
      case 'needs_calibration':
        return 'Necessita Calibração';
      case 'overdue':
        return 'Calibração Atrasada';
      default:
        return 'Status Desconhecido';
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.sensorCard}
        onPress={() => setShowDetails(true)}
      >
        <View style={styles.sensorHeader}>
          <Text style={styles.sensorName}>{sensor.name}</Text>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(sensor.status) },
            ]}
          />
        </View>
        <View style={styles.sensorInfo}>
          <Text style={styles.sensorValue}>
            {sensor.lastReading.value} {sensor.lastReading.unit}
          </Text>
          <Text style={styles.sensorTimestamp}>
            {new Date(sensor.lastReading.timestamp).toLocaleString()}
          </Text>
        </View>
        <View style={styles.sensorFooter}>
          <View style={styles.batteryInfo}>
            <Ionicons
              name="battery-charging-outline"
              size={16}
              color={sensor.batteryLevel > 20 ? '#4CAF50' : '#F44336'}
            />
            <Text style={styles.batteryText}>{sensor.batteryLevel}%</Text>
          </View>
          <View style={styles.signalInfo}>
            <Ionicons
              name="wifi-outline"
              size={16}
              color={sensor.signalStrength > 50 ? '#4CAF50' : '#F44336'}
            />
            <Text style={styles.signalText}>{sensor.signalStrength}%</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes do Sensor</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowDetails(false)}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>Informações Básicas</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nome:</Text>
                  <Text style={styles.detailValue}>{sensor.name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tipo:</Text>
                  <Text style={styles.detailValue}>{sensor.type}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Fabricante:</Text>
                  <Text style={styles.detailValue}>{sensor.details.manufacturer}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Modelo:</Text>
                  <Text style={styles.detailValue}>{sensor.details.model}</Text>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>Status e Manutenção</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <View style={styles.statusContainer}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(sensor.status) },
                      ]}
                    />
                    <Text style={styles.detailValue}>
                      {sensor.status === 'active'
                        ? 'Ativo'
                        : sensor.status === 'warning'
                        ? 'Alerta'
                        : sensor.status === 'critical'
                        ? 'Crítico'
                        : 'Inativo'}
                    </Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Calibração:</Text>
                  <View style={styles.statusContainer}>
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor: getCalibrationStatusColor(
                            sensor.details.calibrationStatus
                          ),
                        },
                      ]}
                    />
                    <Text style={styles.detailValue}>
                      {getCalibrationStatusText(sensor.details.calibrationStatus)}
                    </Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Instalação:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(sensor.details.installationDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Última Manutenção:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(sensor.details.lastMaintenance).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Próxima Manutenção:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(sensor.details.nextMaintenance).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>Leituras Atuais</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Última Leitura:</Text>
                  <Text style={styles.detailValue}>
                    {sensor.lastReading.value} {sensor.lastReading.unit}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Horário:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(sensor.lastReading.timestamp).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Bateria:</Text>
                  <Text style={styles.detailValue}>{sensor.batteryLevel}%</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Sinal:</Text>
                  <Text style={styles.detailValue}>{sensor.signalStrength}%</Text>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>Localização</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Latitude:</Text>
                  <Text style={styles.detailValue}>
                    {sensor.location.latitude.toFixed(6)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Longitude:</Text>
                  <Text style={styles.detailValue}>
                    {sensor.location.longitude.toFixed(6)}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.historyButton]}
                onPress={() => {
                  setShowDetails(false);
                  navigation.navigate('SensorDetail', { sensorId: sensor.id });
                }}
              >
                <Ionicons name="time-outline" size={20} color="#FFFFFF" />
                <Text style={styles.modalButtonText}>Ver Histórico</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const AlertCard: React.FC<{ alert: Alert }> = ({ alert }) => {
  return (
    <View
      style={[
        styles.alertCard,
        { backgroundColor: alert.type === 'critical' ? '#FFEBEE' : '#FFF3E0' },
      ]}
    >
      <View style={styles.alertHeader}>
        <Ionicons
          name={alert.type === 'critical' ? 'warning' : 'alert-circle'}
          size={24}
          color={alert.type === 'critical' ? '#F44336' : '#FF9800'}
        />
        <Text
          style={[
            styles.alertType,
            { color: alert.type === 'critical' ? '#F44336' : '#FF9800' },
          ]}
        >
          {alert.type === 'critical' ? 'Crítico' : 'Alerta'}
        </Text>
      </View>
      <Text style={styles.alertMessage}>{alert.message}</Text>
      <Text style={styles.alertTimestamp}>
        {new Date(alert.timestamp).toLocaleString()}
      </Text>
    </View>
  );
};

export const SensorsScreen: React.FC = () => {
  const { sensors, alerts, loading, refreshData } = useSensors();

  // Mock data for demonstration - replace with actual data from API
  const mockSensors: SensorStatus[] = [
    {
      id: '1',
      type: 'Pluviômetro automático',
      name: 'Pluviômetro 1',
      lastReading: { value: 25, unit: 'mm/h', timestamp: new Date() },
      status: 'active',
      batteryLevel: 85,
      signalStrength: 90,
      location: { latitude: -23.5505, longitude: -46.6333 },
      details: {
        manufacturer: 'Sensortech',
        model: 'PT-100',
        installationDate: new Date('2024-01-01'),
        lastMaintenance: new Date('2024-02-15'),
        nextMaintenance: new Date('2024-05-15'),
        calibrationStatus: 'calibrated',
      },
    },
    {
      id: '2',
      type: 'Sensor de nível de rio',
      name: 'Régua Eletrônica 1',
      lastReading: { value: 2.5, unit: 'm', timestamp: new Date() },
      status: 'active',
      batteryLevel: 75,
      signalStrength: 85,
      location: { latitude: -23.5505, longitude: -46.6333 },
      details: {
        manufacturer: 'HydroTech',
        model: 'RL-200',
        installationDate: new Date('2024-01-15'),
        lastMaintenance: new Date('2024-02-20'),
        nextMaintenance: new Date('2024-05-20'),
        calibrationStatus: 'needs_calibration',
      },
    },
    {
      id: '3',
      type: 'Anemômetro',
      name: 'Anemômetro 1',
      lastReading: { value: 15, unit: 'km/h', timestamp: new Date() },
      status: 'active',
      batteryLevel: 90,
      signalStrength: 95,
      location: { latitude: -23.5505, longitude: -46.6333 },
      details: {
        manufacturer: 'WindTech',
        model: 'AN-300',
        installationDate: new Date('2024-01-10'),
        lastMaintenance: new Date('2024-02-10'),
        nextMaintenance: new Date('2024-05-10'),
        calibrationStatus: 'calibrated',
      },
    },
    {
      id: '4',
      type: 'Higrômetro digital',
      name: 'Higrômetro 1',
      lastReading: { value: 65, unit: '%', timestamp: new Date() },
      status: 'active',
      batteryLevel: 80,
      signalStrength: 88,
      location: { latitude: -23.5505, longitude: -46.6333 },
      details: {
        manufacturer: 'HumidityTech',
        model: 'HG-150',
        installationDate: new Date('2024-01-20'),
        lastMaintenance: new Date('2024-02-25'),
        nextMaintenance: new Date('2024-05-25'),
        calibrationStatus: 'calibrated',
      },
    },
    {
      id: '5',
      type: 'Barômetro eletrônico',
      name: 'Barômetro 1',
      lastReading: { value: 1013, unit: 'hPa', timestamp: new Date() },
      status: 'active',
      batteryLevel: 95,
      signalStrength: 92,
      location: { latitude: -23.5505, longitude: -46.6333 },
      details: {
        manufacturer: 'PressureTech',
        model: 'BP-200',
        installationDate: new Date('2024-01-05'),
        lastMaintenance: new Date('2024-02-05'),
        nextMaintenance: new Date('2024-05-05'),
        calibrationStatus: 'needs_calibration',
      },
    },
    {
      id: '6',
      type: 'Sensor de temperatura ambiente',
      name: 'Termômetro 1',
      lastReading: { value: 25.5, unit: '°C', timestamp: new Date() },
      status: 'active',
      batteryLevel: 88,
      signalStrength: 90,
      location: { latitude: -23.5505, longitude: -46.6333 },
      details: {
        manufacturer: 'TempTech',
        model: 'TM-100',
        installationDate: new Date('2024-01-12'),
        lastMaintenance: new Date('2024-02-12'),
        nextMaintenance: new Date('2024-05-12'),
        calibrationStatus: 'calibrated',
      },
    },
    {
      id: '7',
      type: 'Inclinômetro',
      name: 'Inclinômetro 1',
      lastReading: { value: 5.2, unit: '°', timestamp: new Date() },
      status: 'warning',
      batteryLevel: 65,
      signalStrength: 75,
      location: { latitude: -23.5505, longitude: -46.6333 },
      details: {
        manufacturer: 'SlopeTech',
        model: 'IN-400',
        installationDate: new Date('2024-01-08'),
        lastMaintenance: new Date('2024-02-08'),
        nextMaintenance: new Date('2024-05-08'),
        calibrationStatus: 'overdue',
      },
    },
    {
      id: '8',
      type: 'Acelerômetro',
      name: 'Acelerômetro 1',
      lastReading: { value: 0.15, unit: 'g', timestamp: new Date() },
      status: 'active',
      batteryLevel: 82,
      signalStrength: 85,
      location: { latitude: -23.5505, longitude: -46.6333 },
      details: {
        manufacturer: 'MotionTech',
        model: 'AC-500',
        installationDate: new Date('2024-01-18'),
        lastMaintenance: new Date('2024-02-18'),
        nextMaintenance: new Date('2024-05-18'),
        calibrationStatus: 'calibrated',
      },
    },
    {
      id: '9',
      type: 'Tensiômetro de solo',
      name: 'Tensiômetro 1',
      lastReading: { value: 35, unit: 'kPa', timestamp: new Date() },
      status: 'active',
      batteryLevel: 78,
      signalStrength: 82,
      location: { latitude: -23.5505, longitude: -46.6333 },
      details: {
        manufacturer: 'SoilTech',
        model: 'TS-300',
        installationDate: new Date('2024-01-22'),
        lastMaintenance: new Date('2024-02-22'),
        nextMaintenance: new Date('2024-05-22'),
        calibrationStatus: 'needs_calibration',
      },
    },
    {
      id: '10',
      type: 'Sensor de umidade do solo',
      name: 'Umidade Solo 1',
      lastReading: { value: 45, unit: '%', timestamp: new Date() },
      status: 'active',
      batteryLevel: 85,
      signalStrength: 88,
      location: { latitude: -23.5505, longitude: -46.6333 },
      details: {
        manufacturer: 'MoistureTech',
        model: 'MS-200',
        installationDate: new Date('2024-01-14'),
        lastMaintenance: new Date('2024-02-14'),
        nextMaintenance: new Date('2024-05-14'),
        calibrationStatus: 'calibrated',
      },
    },
    {
      id: '11',
      type: 'Sensor óptico de fumaça',
      name: 'Sensor Fumaça 1',
      lastReading: { value: 0.02, unit: '% obs/m', timestamp: new Date() },
      status: 'active',
      batteryLevel: 92,
      signalStrength: 95,
      location: { latitude: -23.5505, longitude: -46.6333 },
      details: {
        manufacturer: 'SmokeTech',
        model: 'SF-100',
        installationDate: new Date('2024-01-25'),
        lastMaintenance: new Date('2024-02-25'),
        nextMaintenance: new Date('2024-05-25'),
        calibrationStatus: 'calibrated',
      },
    },
    {
      id: '12',
      type: 'Sensor de radiação solar',
      name: 'Piranômetro 1',
      lastReading: { value: 850, unit: 'W/m²', timestamp: new Date() },
      status: 'active',
      batteryLevel: 88,
      signalStrength: 90,
      location: { latitude: -23.5505, longitude: -46.6333 },
      details: {
        manufacturer: 'SolarTech',
        model: 'PR-600',
        installationDate: new Date('2024-01-16'),
        lastMaintenance: new Date('2024-02-16'),
        nextMaintenance: new Date('2024-05-16'),
        calibrationStatus: 'needs_calibration',
      },
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refreshData} />
      }
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alertas Ativos</Text>
        {alerts.length > 0 ? (
          alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
        ) : (
          <Text style={styles.noDataText}>Nenhum alerta ativo</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sensores</Text>
        {mockSensors.length > 0 ? (
          mockSensors.map((sensor) => <SensorCard key={sensor.id} sensor={sensor} />)
        ) : (
          <Text style={styles.noDataText}>Nenhum sensor encontrado</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFFFFF',
  },
  sensorCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sensorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sensorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sensorInfo: {
    marginBottom: 8,
  },
  sensorValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  sensorTimestamp: {
    fontSize: 12,
    color: '#8E8E93',
  },
  sensorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  batteryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#8E8E93',
  },
  signalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#8E8E93',
  },
  alertCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertType: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  alertMessage: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 8,
  },
  alertTimestamp: {
    fontSize: 12,
    color: '#8E8E93',
  },
  noDataText: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 16,
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#000000',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
    backgroundColor: '#000000',
  },
  detailSection: {
    marginBottom: 24,
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 8,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
    backgroundColor: '#1C1C1E',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  historyButton: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 