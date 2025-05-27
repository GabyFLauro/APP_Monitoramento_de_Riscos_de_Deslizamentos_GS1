import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EnvironmentalData {
  soilMoisture: string;
  slopeInclination: string;
  rainfall: string;
  riverLevel: string;
  temperature: string;
  humidity: string;
  windSpeed: string;
  notes: string;
}

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
  });

  const handleSubmit = () => {
    // TODO: Implement API call to save data
    Alert.alert(
      'Sucesso',
      'Dados ambientais registrados com sucesso!',
      [{ text: 'OK' }]
    );
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
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="save-outline" size={24} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>Salvar Dados</Text>
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
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  unitText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
}); 