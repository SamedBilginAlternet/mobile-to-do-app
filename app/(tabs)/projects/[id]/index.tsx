import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Plus, CircleCheck as CheckCircle, Circle, Calendar } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/database';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';

type Project = Database['public']['Tables']['projects']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [addingTask, setAddingTask] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchProjectAndTasks();
    }
  }, [id]);

  const fetchProjectAndTasks = async () => {
    if (!user || !id) return;

    try {
      // Fetch project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;
      setTasks(tasksData || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
      router.back();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProjectAndTasks();
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !id) return;

    setAddingTask(true);
    try {
      const { error } = await supabase.from('tasks').insert({
        title: newTaskTitle.trim(),
        project_id: id,
      });

      if (error) throw error;

      setNewTaskTitle('');
      await fetchProjectAndTasks();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setAddingTask(false);
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', task.id);

      if (error) throw error;

      // Update local state immediately
      setTasks(tasks.map(t => 
        t.id === task.id ? { ...t, completed: !t.completed } : t
      ));
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={[styles.taskCard, item.completed && styles.completedTaskCard]}
      onPress={() => handleToggleTask(item)}
      activeOpacity={0.7}
    >
      <View style={styles.taskContent}>
        <View style={styles.taskIcon}>
          {item.completed ? (
            <CheckCircle color="#10B981" size={24} />
          ) : (
            <Circle color="#6B7280" size={24} />
          )}
        </View>
        <View style={styles.taskInfo}>
          <Text style={[styles.taskTitle, item.completed && styles.completedTaskTitle]}>
            {item.title}
          </Text>
          <View style={styles.taskMeta}>
            <Calendar color="#9CA3AF" size={14} />
            <Text style={styles.taskDate}>{formatDate(item.created_at)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <CheckCircle color="#9CA3AF" size={64} />
      <Text style={styles.emptyTitle}>No Tasks Yet</Text>
      <Text style={styles.emptyDescription}>
        Add your first task to get started
      </Text>
    </View>
  );

  if (loading) {
    return <LoadingSpinner text="Loading project..." />;
  }

  if (!project) {
    return <LoadingSpinner text="Project not found..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft color="#3B82F6" size={24} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {project.title}
          </Text>
          <Text style={styles.headerSubtitle}>
            {completedTasks}/{totalTasks} tasks completed
          </Text>
        </View>
      </View>

      {project.description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{project.description}</Text>
        </View>
      )}

      <View style={styles.addTaskContainer}>
        <View style={styles.addTaskInputContainer}>
          <TextInput
            style={styles.addTaskInput}
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            placeholder="Add a new task..."
            placeholderTextColor="#9CA3AF"
            returnKeyType="done"
            onSubmitEditing={handleAddTask}
          />
          <TouchableOpacity
            style={[styles.addTaskButton, (!newTaskTitle.trim() || addingTask) && styles.disabledButton]}
            onPress={handleAddTask}
            disabled={!newTaskTitle.trim() || addingTask}
            activeOpacity={0.7}
          >
            <Plus color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  descriptionContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  addTaskContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  addTaskInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addTaskInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginRight: 12,
  },
  addTaskButton: {
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  listContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  completedTaskCard: {
    opacity: 0.7,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  taskIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDate: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 6,
    fontFamily: 'Inter-Regular',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
});