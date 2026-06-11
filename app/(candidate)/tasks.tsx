import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AppHeader from '@/components/AppHeader';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

interface Task {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  time: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Call BUET Alumni Members', priority: 'High', time: '10:00 AM', status: 'Pending' },
  { id: '2', title: 'Prepare Meeting Speech', priority: 'Medium', time: '02:00 PM', status: 'In Progress' },
  { id: '3', title: 'Update Campaign Banner', priority: 'Low', time: 'Yesterday', status: 'Completed' },
  { id: '4', title: 'Manifesto Distribution', priority: 'High', time: '05:00 PM', status: 'Pending' },
  { id: '5', title: 'Volunteer Coordination Meeting', priority: 'Medium', time: '06:00 PM', status: 'In Progress' },
  { id: '6', title: 'PDB Department Visit Prep', priority: 'High', time: 'Tomorrow', status: 'Pending' },
  { id: '7', title: 'Draft Newsletter for RUET', priority: 'Low', time: 'Completed', status: 'Completed' },
];

export default function TasksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeTab, setActiveTab] = useState<'Pending' | 'In Progress' | 'Completed'>('Pending');
  const [modalVisible, setModalVisible] = useState(false);
  
  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newTime, setNewTime] = useState('');

  const getPriorityColor = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High': return Colors.danger;
      case 'Medium': return Colors.warning;
      case 'Low': return Colors.success;
    }
  };

  const handleAddTask = () => {
    if (!newTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTitle,
      priority: newPriority,
      time: newTime || 'ASAP',
      status: 'Pending',
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setNewPriority('Medium');
    setNewTime('');
    setModalVisible(false);
  };

  const moveTask = (id: string, nextStatus: 'Pending' | 'In Progress' | 'Completed') => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, status: nextStatus, time: nextStatus === 'Completed' ? 'Just Now' : task.time } : task
      )
    );
  };

  const filteredTasks = tasks.filter(task => task.status === activeTab);

  const getCount = (status: 'Pending' | 'In Progress' | 'Completed') => {
    return tasks.filter(task => task.status === status).length;
  };

  return (
    <View style={styles.container}>
      <AppHeader variant="dark" showLogoutButton={true} onLogoutPress={() => router.push('/(voter)/home')} />

      {/* Quick Add Header Button */}
      <View style={styles.headerSection}>
        <Pressable
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialCommunityIcons name="plus" size={18} color={Colors.white} />
          <Text style={styles.addButtonText}>  Create New Task</Text>
        </Pressable>
      </View>

      {/* Kanban Navigation Tabs */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, activeTab === 'Pending' && styles.tabActivePending]}
          onPress={() => setActiveTab('Pending')}
        >
          <Text style={[styles.tabText, activeTab === 'Pending' && styles.tabTextActive]}>
            Pending ({getCount('Pending')})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'In Progress' && styles.tabActiveInProgress]}
          onPress={() => setActiveTab('In Progress')}
        >
          <Text style={[styles.tabText, activeTab === 'In Progress' && styles.tabTextActive]}>
            In Progress ({getCount('In Progress')})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'Completed' && styles.tabActiveCompleted]}
          onPress={() => setActiveTab('Completed')}
        >
          <Text style={[styles.tabText, activeTab === 'Completed' && styles.tabTextActive]}>
            Completed ({getCount('Completed')})
          </Text>
        </Pressable>
      </View>

      {/* Scrollable Tasks List */}
      <ScrollView style={styles.taskList} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No tasks in this stage</Text>
          </View>
        ) : (
          filteredTasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '15' }]}>
                  <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
                  <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                    {task.priority} Priority
                  </Text>
                </View>
                <View style={styles.cardTime}>
                  <MaterialCommunityIcons name="clock-outline" size={14} color={Colors.textTertiary} />
                  <Text style={[styles.cardTime, { marginLeft: 4 }]}>{task.time}</Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>{task.title}</Text>

              {/* Status Action Buttons */}
              <View style={styles.cardActions}>
                {task.status !== 'Pending' && (
                  <Pressable
                    style={[styles.actionButton, styles.buttonPending]}
                    onPress={() => moveTask(task.id, 'Pending')}
                  >
                    <Text style={styles.actionButtonText}>To Pending</Text>
                  </Pressable>
                )}
                {task.status !== 'In Progress' && (
                  <Pressable
                    style={[styles.actionButton, styles.buttonInProgress]}
                    onPress={() => moveTask(task.id, 'In Progress')}
                  >
                    <Text style={styles.actionButtonText}>To Progress</Text>
                  </Pressable>
                )}
                {task.status !== 'Completed' && (
                  <Pressable
                    style={[styles.actionButton, styles.buttonCompleted]}
                    onPress={() => moveTask(task.id, 'Completed')}
                  >
                    <MaterialCommunityIcons name="check" size={14} color={Colors.success} />
                    <Text style={styles.actionButtonText}> Complete</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={process.env.EXPO_OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Campaign Task</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={22} color={Colors.textSecondary} />
              </Pressable>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Task Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Call BUET alumni subgroup"
                placeholderTextColor={Colors.textMuted}
                value={newTitle}
                onChangeText={setNewTitle}
              />

              <Text style={styles.label}>Priority</Text>
              <View style={styles.prioritySelector}>
                {(['High', 'Medium', 'Low'] as const).map((p) => (
                  <Pressable
                    key={p}
                    style={[
                      styles.priorityOption,
                      newPriority === p && { backgroundColor: getPriorityColor(p) + '15', borderColor: getPriorityColor(p) }
                    ]}
                    onPress={() => setNewPriority(p)}
                  >
                    <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(p) }]} />
                    <Text style={[styles.priorityOptionText, { color: getPriorityColor(p) }]}>{p}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.label}>Due Time / Day</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 10:00 AM, Tomorrow, ASAP"
                placeholderTextColor={Colors.textMuted}
                value={newTime}
                onChangeText={setNewTime}
              />

              <Pressable 
                style={styles.submitButton}
                onPress={handleAddTask}
              >
                <Text style={styles.submitButtonText}>Create Task</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  addButton: {
    backgroundColor: Colors.primaryBlue,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    ...Shadow.sm,
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActivePending: {
    borderBottomColor: Colors.danger,
  },
  tabActiveInProgress: {
    borderBottomColor: Colors.warning,
  },
  tabActiveCompleted: {
    borderBottomColor: Colors.success,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.bold,
  },
  taskList: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  emptyContainer: {
    paddingVertical: Spacing.xxxl * 2,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
  },
  taskCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  priorityText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  cardTime: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
  },
  cardTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonPending: {
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceLight,
  },
  buttonInProgress: {
    borderColor: Colors.warning + '40',
    backgroundColor: Colors.warningLight,
  },
  buttonCompleted: {
    borderColor: Colors.success + '40',
    backgroundColor: Colors.successLight,
  },
  actionButtonText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.xl,
    ...Shadow.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  closeIcon: {
    fontSize: 20,
    color: Colors.textSecondary,
    padding: 4,
  },
  form: {
    gap: Spacing.md,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceLight,
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  priorityOptionText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  submitButton: {
    backgroundColor: Colors.primaryBlue,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.lg,
    ...Shadow.sm,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});
