import { Image, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import TodoList from './components/TodoList';

const App = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const todoListRef = React.useRef(null); 


  const handleRemoveAll = () => {
    Alert.alert(
      'Confirm Delete All',
      'Do you want to delete all tasks?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          onPress: () => {
            if (todoListRef.current) {
              todoListRef.current.removeAllTasks(); 
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView
      style={[
        styles.scrollbar,
        { backgroundColor: isDarkMode ? '#121212' : '#FFFFFF' },
      ]}
    >
      <View
        id="screen"
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? '#121212' : '#FFFFFF' },
        ]}
      >
        <View style={styles.tasksWrapper}>
          <View style={styles.header}>
            <Image source={require('./assets/logo.png')} style={styles.image} />
            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? '#FFFFFF' : '#000000' },
              ]}
            >
              Tasks Lists
            </Text>

            <TouchableOpacity
              onPress={() => {
                setIsDarkMode(!isDarkMode);
              }}
            >
              <Image
                source={
                  isDarkMode
                    ? require('./assets/light.png')
                    : require('./assets/dark.png')
                }
                style={styles.image3}
              />
            </TouchableOpacity>

      
            <TouchableOpacity onPress={handleRemoveAll}>
              <Image
                source={require('./assets/removeAll.png')}
                style={styles.image2}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsSearchVisible(!isSearchVisible);
              }}
            >
              <Image
                source={require('./assets/search.png')}
                style={styles.image2}
              />
            </TouchableOpacity>
          </View>

          {isSearchVisible && (
            <View style={styles.searchContainer}>
              <TextInput
                style={[
                  styles.searchInput,
                  {
                    backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
                    color: isDarkMode ? '#FFFFFF' : '#000000',
                  },
                ]}
                placeholder="Search tasks..."
                placeholderTextColor={isDarkMode ? '#BBBBBB' : '#888888'}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          )}

          <View style={styles.items}>
            <TodoList searchQuery={searchQuery} ref={todoListRef} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default App;

const styles = StyleSheet.create({
  scrollbar: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  tasksWrapper: {
    marginTop: 0,
    paddingTop: 40,
    paddingBottom: 0,
    backgroundColor: 'darkorange',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingLeft: 30,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 5,
  },
  image2: {
    marginLeft: 10,
    width: 25,
    height: 25,
    marginRight: 10,
  },
  image3: {
    marginLeft: 60,
    marginRight: 10,
    width: 25,
    height: 25,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
  },
  searchContainer: {
    padding: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    marginTop: 10,
    marginHorizontal: 30,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  items: {
    marginTop: 20,
  },
});
