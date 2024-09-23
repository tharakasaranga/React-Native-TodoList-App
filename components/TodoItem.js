import Checkbox from 'expo-checkbox';
import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkboxContainer: {
    marginRight: 10,
  },
  todoItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
  },
  pinButton: {
    backgroundColor: '#FFD700', // Yellow background for pin/unpin buttons
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 5,
    marginLeft:5
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default function TodoItem({ task, deleteTask, toggleCompleted, startEditing, togglePin }) {
  return (
    <View style={styles.todoItem}>
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={task.completed}
          onValueChange={() => toggleCompleted(task.id)}
          tintColors={{ true: '#4CAF50', false: '#ccc' }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.todoItemText, task.completed && styles.completed]}>
          {task.text}
        </Text>
        <Text style={styles.dateText}>
          {new Date(task.createdAt).toLocaleString()}
        </Text>
      </View>

     

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => startEditing(task.id)}
      >
        <Image source={require('../assets/edit.png')} style={{ width: 15, height: 15 }} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTask(task.id)}
      >
        <Image source={require('../assets/delete.png')} style={{ width: 15, height: 15 }} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.pinButton}
        onPress={() => togglePin(task.id)}
      >
        <Image
          source={task.pinned ? require('../assets/unpin.png') : require('../assets/pin.png')}
          style={{ width: 15, height: 15 }}
        />
      </TouchableOpacity>
    </View>
  );
}
