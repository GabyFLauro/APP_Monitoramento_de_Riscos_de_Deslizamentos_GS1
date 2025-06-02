import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { environmentalDataService, EnvironmentalData } from '../services/environmentalData';
import { landslidePredictor } from '../services/landslidePredictor';

export const EnvironmentalDataScreen: React.FC = () => {
  const [data, setData] = useState<EnvironmentalData>({
    soilMoisture: '',
    slopeInclination: '',
    rainfall: '',
    riverLevel: '',
    temperature: '',
    humidity: '',
    windSpeed: '',
    notes: '',
    timestamp: new Date().toISOString(),
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      name: 'Encosta Sul',
    },
  });
  const [loading, setLoading] = useState(false);

  const validateData = (): boolean => {
    const requiredFields = [
      { field: 'soilMoisture', label: 'Umidade do Solo' },
      { field: 'slopeInclination', label: 'Inclinação do Solo' },
      { field: 'rainfall', label: 'Precipitação' },
      { field: 'riverLevel', label: 'Nível do Rio' },
      { field: 'temperature', label: 'Temperatura' },
      { field: 'humidity', label: 'Umidade do Ar' },
      { field: 'windSpeed', label: 'Velocidade do Vento' },
    ] as const;

    for (const { field, label } of requiredFields) {
      const value = data[field];
      if (!value || value.trim() === '') {
        Alert.alert('Erro', `Por favor, preencha o campo ${label}`);
        return false;
      }

      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        Alert.alert('Erro', `O valor de ${label} deve ser um número válido`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateData()) {
      return;
    }

    setLoading(true);
    try {
      // Save environmental data
      await environmentalDataService.saveData(data);

      // Assess landslide risk
      const assessment = await landslidePredictor.assessRiskFromEnvironmentalData(
        data,
        data.location!
      );

      // Show appropriate alert based on risk level
      if (assessment.riskLevel === 'critical') {
        Alert.alert(
          'Alerta Crítico',
          `Risco CRÍTICO de deslizamento detectado!\n\n` +
          `Umidade do Solo: ${data.soilMoisture}%\n` +
          `Inclinação: ${data.slopeInclination}°\n` +
          `Precipitação: ${data.rainfall} mm/h\n` +
          `Nível do Rio: ${data.riverLevel} m\n\n` +
          'Recomendações:\n' +
          '- Evacuação imediata\n' +
          '- Ativar todos os recursos de emergência',
          [{ text: 'OK' }]
        );
      } else if (assessment.riskLevel === 'high') {
        Alert.alert(
          'Alerta de Risco Alto',
          `Risco ALTO de deslizamento detectado!\n\n` +
          `Umidade do Solo: ${data.soilMoisture}%\n` +
          `Inclinação: ${data.slopeInclination}°\n` +
          `Precipitação: ${data.rainfall} mm/h\n` +
          `Nível do Rio: ${data.riverLevel} m\n\n` +
          'Recomendações:\n' +
          '- Iniciar evacuação preventiva\n' +
          '- Ativar equipe de emergência',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Sucesso',
          'Dados ambientais registrados com sucesso!\n\n' +
          `Nível de Risco: ${assessment.riskLevel.toUpperCase()}\n` +
          `Score: ${assessment.riskScore}\n\n` +
          'Previsões:\n' +
          `24h: ${assessment.predictions.next24h}\n` +
          `48h: ${assessment.predictions.next48h}\n` +
          `72h: ${assessment.predictions.next72h}`,
          [{ text: 'OK' }]
        );
      }

      // Clear form after successful save
      setData({
        soilMoisture: '',
        slopeInclination: '',
        rainfall: '',
        riverLevel: '',
        temperature: '',
        humidity: '',
        windSpeed: '',
        notes: '',
        timestamp: new Date().toISOString(),
        location: data.location,
      });
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível salvar os dados ambientais. Tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    unit: string,
    keyboardType: 'numeric' | 'default' = 'numeric'
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholder={`Digite ${label.toLowerCase()}`}
          placeholderTextColor="#8E8E93"
        />
        <Text style={styles.unitText}>{unit}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dados Ambientais</Text>
        <TouchableOpacity style={styles.locationButton}>
          <Ionicons name="location-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        {renderInputField(
          'Umidade do Solo',
          data.soilMoisture,
          (text) => setData({ ...data, soilMoisture: text }),
          '%'
        )}
        {renderInputField(
          'Inclinação do Solo',
          data.slopeInclination,
          (text) => setData({ ...data, slopeInclination: text }),
          '°'
        )}
        {renderInputField(
          'Precipitação',
          data.rainfall,
          (text) => setData({ ...data, rainfall: text }),
          'mm/h'
        )}
        {renderInputField(
          'Nível do Rio',
          data.riverLevel,
          (text) => setData({ ...data, riverLevel: text }),
          'm'
        )}
        {renderInputField(
          'Temperatura',
          data.temperature,
          (text) => setData({ ...data, temperature: text }),
          '°C'
        )}
        {renderInputField(
          'Umidade do Ar',
          data.humidity,
          (text) => setData({ ...data, humidity: text }),
          '%'
        )}
        {renderInputField(
          'Velocidade do Vento',
          data.windSpeed,
          (text) => setData({ ...data, windSpeed: text }),
          'km/h'
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Observações</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={data.notes}
            onChangeText={(text) => setData({ ...data, notes: text })}
            multiline
            numberOfLines={4}
            placeholder="Adicione observações relevantes..."
            placeholderTextColor="#8E8E93"
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="save-outline" size={24} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Salvar Dados</Text>
            </>
          )}
        </TouchableOpacity>
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
  locationButton: {
    padding: 8,
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  unitText: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 12,
  },
}); 