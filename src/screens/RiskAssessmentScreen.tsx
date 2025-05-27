import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useSensors } from '../contexts/SensorContext';
import { RiskAssessmentCard } from '../components/RiskAssessmentCard';
import { Ionicons } from '@expo/vector-icons';

export const RiskAssessmentScreen: React.FC = () => {
  const { riskAssessments, loading, refreshData } = useSensors();

  const getRiskLevelCount = (level: string) => {
    return riskAssessments.filter((assessment) => assessment.riskLevel === level)
      .length;
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refreshData} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Avaliação de Riscos</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
          <Text style={[styles.statValue, { color: '#4CAF50' }]}>
            {getRiskLevelCount('low')}
          </Text>
          <Text style={styles.statLabel}>Baixo Risco</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
          <Text style={[styles.statValue, { color: '#FF9800' }]}>
            {getRiskLevelCount('medium')}
          </Text>
          <Text style={styles.statLabel}>Médio Risco</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFEBEE' }]}>
          <Text style={[styles.statValue, { color: '#F44336' }]}>
            {getRiskLevelCount('high') + getRiskLevelCount('critical')}
          </Text>
          <Text style={styles.statLabel}>Alto Risco</Text>
        </View>
      </View>

      <View style={styles.assessmentsContainer}>
        <Text style={styles.sectionTitle}>Avaliações Recentes</Text>
        {riskAssessments.length > 0 ? (
          riskAssessments.map((assessment) => (
            <RiskAssessmentCard key={assessment.timestamp.toString()} assessment={assessment} />
          ))
        ) : (
          <Text style={styles.noDataText}>Nenhuma avaliação disponível</Text>
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
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  assessmentsContainer: {
    padding: 16,
    backgroundColor: '#1C1C1E',
    margin: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  noDataText: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 16,
    marginTop: 16,
  },
}); 