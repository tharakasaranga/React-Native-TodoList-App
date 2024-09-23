import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert, ScrollView } from 'react-native';
import TodoItem from './TodoItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  fixedHeader: {
    backgroundColor: 'darkgreen',
    paddingTop: 10,
    paddingBottom: 0,
    paddingHorizontal: 20,
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    color: 'black',
    fontWeight:'900'
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  scrollContent: {
    marginTop: 160, 
    paddingHorizontal: 20,
  },
});

const TodoList = forwardRef(({ searchQuery }, ref) => {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [description, setDescription] = useState(''); 
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  
  useImperativeHandle(ref, () => ({
    removeAllTasks,
  }));

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Failed to load tasks', error);
    }
  };

  const togglePin = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, pinned: !task.pinned } : task
    );
    saveTasks(updatedTasks);
    
    const pinnedTask = updatedTasks.find(task => task.id === id); 
    Alert.alert('Success', pinnedTask.pinned ? 'Task pinned successfully!' : 'Task unpinned!');
  };

  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (error) {
      console.error('Failed to save tasks', error);
    }
  };

  const addOrEditTask = () => {
    if (editingTaskId) {
      const updatedTasks = tasks.map((task) =>
        task.id === editingTaskId ? { ...task, text, description } : task
      );
      saveTasks(updatedTasks);
      Alert.alert('Success', 'Task edited successfully!');
      setEditingTaskId(null);
    } else {
      const newTask = {
        id: Date.now(),
        text,
        description, 
        completed: false,
        pinned: false,
        createdAt: new Date(),
      };
      saveTasks([...tasks, newTask]);
      Alert.alert('Success', 'Task added successfully!');
    }
    setText('');
    setDescription(''); 
  };

  const deleteTask = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Do you want to remove this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            const updatedTasks = tasks.filter((task) => task.id !== id);
            saveTasks(updatedTasks);
            Alert.alert('Success', 'Task deleted successfully!');
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const toggleCompleted = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  const startEditing = (id) => {
    const task = tasks.find((task) => task.id === id);
    setText(task.text);
    setDescription(task.description); 
    setEditingTaskId(id);
  };

  const handleItemPress = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const sortedTasks = tasks
    .filter((task) => task.text.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.pinned - a.pinned || new Date(b.createdAt) - new Date(a.createdAt));

 
  const removeAllTasks = () => {
    Alert.alert(
      'Confirm Delete All',
      'Are you sure you want to delete all tasks?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('tasks');
              setTasks([]);
              Alert.alert('Success', 'All tasks have been deleted.');
            } catch (error) {
              console.error('Failed to delete all tasks', error);
              Alert.alert('Error', 'Failed to delete all tasks.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
       
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={setText}
            placeholder={editingTaskId ? 'Edit Task' : 'Enter New Task'}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.addButton} onPress={addOrEditTask}>
            <Text style={styles.addButtonText}>
              {editingTaskId ? 'Save' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>

       
        <TextInput
          style={styles.textInput}
          value={description}
          onChangeText={setDescription}
          placeholder="Task description (optional)"
          placeholderTextColor="#999"
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {sortedTasks.map((task) => (
          <TouchableOpacity key={task.id} onPress={() => handleItemPress(task)}>
            <TodoItem
              task={task}
              deleteTask={deleteTask}
              toggleCompleted={toggleCompleted}
              startEditing={startEditing}
              togglePin={togglePin}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      
      {selectedTask && (
        <Modal transparent={true} visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                Task Details
              </Text>
              <Text style={{ marginTop: 10 }}>Task: {selectedTask.text}</Text>
              <Text>Description: {selectedTask.description || 'No description'}</Text>
              <Text>
                Created At: {new Date(selectedTask.createdAt).toLocaleString()}
              </Text>
              <Text> {selectedTask.completed ? 'Task is completed' : 'Task is not completed yet'}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
});

export default TodoList;
