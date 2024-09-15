import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TaskContext } from '../context/TaskContext';

const CompletedTask = ({ route }) => {
    const { tasks, setTasks } = useContext(TaskContext);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [categoryCounts, setCategoryCounts] = useState({});
    const navigation = useNavigation();

    useEffect(() => {
        const filteredTasks = tasks.filter(task => task.completed);
        setCompletedTasks(filteredTasks);

        const categoryMap = filteredTasks.reduce((acc, task) => {
            if (task.category) {
                acc[task.category] = (acc[task.category] || 0) + 1;
            }
            return acc;
        }, {});
        setCategoryCounts(categoryMap);
    }, [tasks]);

    const handleEditTask = (task) => {
        navigation.navigate('AddTask', { task, editMode: true });
    };

    const handleDeleteTask = (taskId) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    };

    const handleRestoreTask = (taskId) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, completed: false } : task
        );
        setTasks(updatedTasks);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Completed Tasks</Text>
            <Text style={styles.subtitle}>Task Counts by Category:</Text>
            {Object.entries(categoryCounts).map(([category, count]) => (
                <View key={category} style={styles.categoryItem}>
                    <Text style={styles.categoryText}>{category}: {count}</Text>
                </View>
            ))}
            <FlatList
                data={completedTasks}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.taskItem}>
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

                        <TouchableOpacity onPress={() => handleRestoreTask(item.id)}>
                            <MaterialIcons name="restore" size={24} color="green" />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    categoryItem: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
    },
    categoryText: {
        fontSize: 16,
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
});

export default CompletedTask;
