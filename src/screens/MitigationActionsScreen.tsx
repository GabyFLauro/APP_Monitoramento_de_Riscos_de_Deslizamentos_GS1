import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MitigationAction {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  dueDate: Date;
  location: {
    latitude: number;
    longitude: number;
  };
}

export const MitigationActionsScreen: React.FC = () => {
  const [actions, setActions] = useState<MitigationAction[]>([
    {
      id: '1',
      title: 'Reforço de Talude',
      description: 'Implementar medidas de contenção no talude da encosta',
      status: 'pending',
      priority: 'high',
      assignedTo: 'Equipe Técnica A',
      dueDate: new Date('2024-04-01'),
      location: { latitude: -23.5505, longitude: -46.6333 },
    },
    // Add more mock actions...
  ]);

  const [showNewActionForm, setShowNewActionForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAction, setEditingAction] = useState<MitigationAction | null>(null);
  const [newAction, setNewAction] = useState<Partial<MitigationAction>>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFC107';
      case 'in_progress':
        return '#2196F3';
      case 'completed':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return '#4CAF50';
      case 'medium':
        return '#FFC107';
      case 'high':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const handleEditAction = (action: MitigationAction) => {
    setEditingAction(action);
    setShowEditModal(true);
  };

  const handleUpdateAction = () => {
    if (!editingAction) return;

    if (!editingAction.title || !editingAction.description) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setActions(actions.map(action => 
      action.id === editingAction.id ? editingAction : action
    ));
    setShowEditModal(false);
    setEditingAction(null);
  };

  const handleDeleteAction = (actionId: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta ação?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setActions(actions.filter(action => action.id !== actionId));
          },
        },
      ]
    );
  };

  const handleCreateAction = () => {
    if (!newAction.title || !newAction.description) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const action: MitigationAction = {
      id: Date.now().toString(),
      title: newAction.title,
      description: newAction.description,
      status: newAction.status as 'pending' | 'in_progress' | 'completed',
      priority: newAction.priority as 'low' | 'medium' | 'high',
      assignedTo: 'Equipe Técnica A',
      dueDate: new Date(),
      location: { latitude: -23.5505, longitude: -46.6333 },
    };

    setActions([...actions, action]);
    setShowNewActionForm(false);
    setNewAction({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
    });
  };

  const renderActionCard = (action: MitigationAction) => (
    <View key={action.id} style={styles.actionCard}>
      <View style={styles.actionHeader}>
        <Text style={styles.actionTitle}>{action.title}</Text>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(action.status) },
          ]}
        />
      </View>

      <Text style={styles.actionDescription}>{action.description}</Text>

      <View style={styles.actionDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="flag-outline" size={16} color="#8E8E93" />
          <Text
            style={[
              styles.priorityText,
              { color: getPriorityColor(action.priority) },
            ]}
          >
            {action.priority === 'high'
              ? 'Alta Prioridade'
              : action.priority === 'medium'
              ? 'Média Prioridade'
              : 'Baixa Prioridade'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={16} color="#8E8E93" />
          <Text style={styles.detailText}>{action.assignedTo}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#8E8E93" />
          <Text style={styles.detailText}>
            {action.dueDate.toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditAction(action)}
        >
          <Ionicons name="create-outline" size={20} color="#007AFF" />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteAction(action.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.statusButton]}
          onPress={() => {
            // TODO: Implement status update functionality
          }}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
          <Text style={styles.statusButtonText}>Atualizar Status</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ações de Mitigação</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowNewActionForm(true)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {showNewActionForm && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Nova Ação de Mitigação</Text>
          <TextInput
            style={styles.input}
            placeholder="Título da ação"
            placeholderTextColor="#8E8E93"
            value={newAction.title}
            onChangeText={(text) => setNewAction({ ...newAction, title: text })}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descrição da ação"
            placeholderTextColor="#8E8E93"
            value={newAction.description}
            onChangeText={(text) =>
              setNewAction({ ...newAction, description: text })
            }
            multiline
            numberOfLines={4}
          />

          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.formButton, styles.cancelButton]}
              onPress={() => setShowNewActionForm(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.formButton, styles.submitButton]}
              onPress={handleCreateAction}
            >
              <Text style={styles.submitButtonText}>Criar Ação</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.actionsContainer}>
        {actions.map(renderActionCard)}
      </View>

      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Ação</Text>
            {editingAction && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Título da ação"
                  placeholderTextColor="#8E8E93"
                  value={editingAction.title}
                  onChangeText={(text) =>
                    setEditingAction({ ...editingAction, title: text })
                  }
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Descrição da ação"
                  placeholderTextColor="#8E8E93"
                  value={editingAction.description}
                  onChangeText={(text) =>
                    setEditingAction({ ...editingAction, description: text })
                  }
                  multiline
                  numberOfLines={4}
                />
                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={[styles.formButton, styles.cancelButton]}
                    onPress={() => {
                      setShowEditModal(false);
                      setEditingAction(null);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.formButton, styles.submitButton]}
                    onPress={handleUpdateAction}
                  >
                    <Text style={styles.submitButtonText}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  addButton: {
    padding: 8,
  },
  formContainer: {
    backgroundColor: '#1C1C1E',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  formButton: {
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#2C2C2E',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionsContainer: {
    padding: 16,
  },
  actionCard: {
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
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  actionDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  actionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  priorityText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#8E8E93',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#F5F5F5',
  },
  statusButton: {
    backgroundColor: '#E8F5E9',
  },
  editButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#007AFF',
  },
  statusButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#4CAF50',
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
    padding: 20,
    width: '90%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B3020',
  },
  deleteButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#FF3B30',
  },
}); 