import AsyncStorage from '@react-native-async-storage/async-storage';
import { LandslideRiskAssessment, SoilMoistureSensor, InclinometerSensor } from '../types/sensors';

const STORAGE_KEYS = {
  LANDSLIDE_ASSESSMENTS: '@landslide_assessments',
  HISTORICAL_DATA: '@historical_landslide_data',
};

class LandslidePredictor {
  private assessments: LandslideRiskAssessment[] = [];

  async loadAssessments(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LANDSLIDE_ASSESSMENTS);
      if (data) {
        this.assessments = JSON.parse(data);
      }
    } catch (error) {
      console.error('Erro ao carregar avaliações de risco:', error);
    }
  }

  async saveAssessments(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.LANDSLIDE_ASSESSMENTS,
        JSON.stringify(this.assessments)
      );
    } catch (error) {
      console.error('Erro ao salvar avaliações de risco:', error);
    }
  }

  calculateRiskScore(soilMoisture: number, inclination: number): number {
    // Algoritmo de cálculo de risco baseado em umidade do solo e inclinação
    const moistureWeight = 0.6;
    const inclinationWeight = 0.4;

    // Normalizar valores (0-100)
    const normalizedMoisture = Math.min(soilMoisture / 100, 1);
    const normalizedInclination = Math.min(inclination / 45, 1); // 45 graus como máximo crítico

    // Calcular score (0-100)
    const riskScore = (
      (normalizedMoisture * moistureWeight) +
      (normalizedInclination * inclinationWeight)
    ) * 100;

    return Math.round(riskScore);
  }

  determineRiskLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore >= 80) return 'critical';
    if (riskScore >= 60) return 'high';
    if (riskScore >= 40) return 'medium';
    return 'low';
  }

  predictFutureRisk(
    currentScore: number,
    historicalTrend: number[]
  ): LandslideRiskAssessment['predictions'] {
    // Análise de tendência simples
    const trend = historicalTrend.length > 1 
      ? historicalTrend[historicalTrend.length - 1] - historicalTrend[0]
      : 0;

    const predict24h = Math.max(0, Math.min(100, currentScore + (trend * 0.5)));
    const predict48h = Math.max(0, Math.min(100, currentScore + (trend * 1.0)));
    const predict72h = Math.max(0, Math.min(100, currentScore + (trend * 1.5)));

    return {
      next24h: this.determineRiskLevel(predict24h),
      next48h: this.determineRiskLevel(predict48h),
      next72h: this.determineRiskLevel(predict72h),
    };
  }

  async assessLandslideRisk(
    soilMoistureSensor: SoilMoistureSensor,
    inclinometerSensor: InclinometerSensor,
    location: { latitude: number; longitude: number; address: string }
  ): Promise<LandslideRiskAssessment> {
    const soilMoisture = soilMoistureSensor.lastReading.value;
    const inclination = inclinometerSensor.lastReading.value;
    
    const riskScore = this.calculateRiskScore(soilMoisture, inclination);
    const riskLevel = this.determineRiskLevel(riskScore);

    // Buscar dados históricos para previsão
    const historicalData = await this.getHistoricalData(location);
    const predictions = this.predictFutureRisk(riskScore, historicalData);

    const assessment: LandslideRiskAssessment = {
      id: `assessment_${Date.now()}`,
      location,
      soilMoisture,
      inclination,
      riskLevel,
      riskScore,
      timestamp: new Date().toISOString(),
      predictions,
    };

    // Salvar avaliação
    this.assessments.push(assessment);
    await this.saveAssessments();
    await this.saveHistoricalData(location, riskScore);

    return assessment;
  }

  private async getHistoricalData(location: { latitude: number; longitude: number }): Promise<number[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.HISTORICAL_DATA);
      if (data) {
        const historical = JSON.parse(data);
        const locationKey = `${location.latitude}_${location.longitude}`;
        return historical[locationKey] || [];
      }
    } catch (error) {
      console.error('Erro ao buscar dados históricos:', error);
    }
    return [];
  }

  private async saveHistoricalData(
    location: { latitude: number; longitude: number },
    riskScore: number
  ): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.HISTORICAL_DATA);
      const historical = data ? JSON.parse(data) : {};
      const locationKey = `${location.latitude}_${location.longitude}`;
      
      if (!historical[locationKey]) {
        historical[locationKey] = [];
      }
      
      historical[locationKey].push(riskScore);
      
      // Manter apenas os últimos 30 registros
      if (historical[locationKey].length > 30) {
        historical[locationKey] = historical[locationKey].slice(-30);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.HISTORICAL_DATA, JSON.stringify(historical));
    } catch (error) {
      console.error('Erro ao salvar dados históricos:', error);
    }
  }

  getAssessments(): LandslideRiskAssessment[] {
    return this.assessments;
  }

  async getAssessmentsByLocation(
    latitude: number,
    longitude: number,
    radius: number = 0.01
  ): Promise<LandslideRiskAssessment[]> {
    await this.loadAssessments();
    
    return this.assessments.filter(assessment => {
      const latDiff = Math.abs(assessment.location.latitude - latitude);
      const lonDiff = Math.abs(assessment.location.longitude - longitude);
      return latDiff <= radius && lonDiff <= radius;
    });
  }

  generateLandslideAlert(assessment: LandslideRiskAssessment): {
    type: 'warning' | 'critical';
    message: string;
    timestamp: string;
  } | null {
    if (assessment.riskLevel === 'critical' || assessment.riskLevel === 'high') {
      return {
        type: assessment.riskLevel === 'critical' ? 'critical' : 'warning',
        message: `Risco ${assessment.riskLevel === 'critical' ? 'CRÍTICO' : 'ALTO'} de deslizamento detectado em ${assessment.location.address}. Umidade do solo: ${assessment.soilMoisture}%, Inclinação: ${assessment.inclination}°`,
        timestamp: new Date().toISOString(),
      };
    }
    return null;
  }
}

export const landslidePredictor = new LandslidePredictor();