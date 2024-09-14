import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, CheckBox, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TaskContext } from '../context/TaskContext';

const screenHeight = Dimensions.get('window').height;
const ListHeight = screenHeight * 0.6;

const TaskList = ({ route }) => {
    const navigation = useNavigation();
    const { tasks, setTasks } = useContext(TaskContext); 
    const [pinnedTasks, setPinnedTasks] = useState([]);

    useEffect(() => {
        if (route.params?.newTask) {
            const updatedTasks = route.params.editMode
                ? tasks.map(task => task.id === route.params.newTask.id ? route.params.newTask : task)
                : [...tasks, { ...route.params.newTask, completed: false }];
            setTasks(updatedTasks);
        }
    }, [route.params?.newTask]);

    useEffect(() => {
        if (route.params?.tasks) {
            setTasks(route.params.tasks);
        }
    }, [route.params?.tasks]);

    const handleEditTask = (task) => {
        navigation.navigate('AddTask', { task, editMode: true });
    };

    const handlePinTask = (task) => {
        if (pinnedTasks.find(t => t.id === task.id)) {
            setPinnedTasks(pinnedTasks.filter(t => t.id !== task.id));
        } else {
            setPinnedTasks([...pinnedTasks, task]);
        }
    };

    const handleDeleteTask = (taskId) => {
        navigation.navigate('DeleteTaskScreen', { tasks });
    };

    const handleCompleteTask = (taskId) => {
        const updatedTasks = tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
    };

    const searchTask = () => {
        navigation.navigate('SearchScreen', { tasks });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('StatScreen')}>
                    <Text style={styles.icon}>📊</Text> 
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('PinnedScreen', { pinnedTasks })}>
                    <Text style={styles.icon}>📌</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={searchTask}>
                    <Text style={styles.icon}>🔍</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                style={{height: ListHeight}}
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.taskItem}>
                      <CheckBox
                        style={{marginRight:10}}
                        value={item.completed}
                        onValueChange={() => handleCompleteTask(item.id)}
                      />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.taskText}>Topic: {item.topic}</Text>
                            <Text style={styles.taskText}>Description: {item.description}</Text>
                            <Text style={styles.taskText}>Category: {item.category}</Text>
                            <Text style={styles.taskText}>Date: {item.date}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleEditTask(item)}>
                            <MaterialIcons name="edit" size={24} color="blue" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                            <MaterialIcons name="delete" size={24} color="red" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handlePinTask(item)}>
                            <MaterialIcons 
                                name="push-pin" 
                                size={24} 
                                color={pinnedTasks.find(t => t.id === item.id) ? 'green' : 'blue'} 
                            />
                        </TouchableOpacity>
                    </View>
                )}
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddTask', { editMode: false })}
            >
                <MaterialIcons name="add" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    icon: {
        fontSize: 24,
    },
    taskItem: {
        flexDirection: 'row',
        backgroundColor: '#eee',
        padding: 15,
        borderRadius: 5,
        marginVertical: 5,
        alignItems: 'center',
    },
    taskText: {
        fontSize: 16,
        color: '#333',
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#4CAF50',
        borderRadius: 50,
        padding: 15,
        elevation: 2,
    },
});

export default TaskList;
