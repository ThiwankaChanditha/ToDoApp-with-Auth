import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const CompletedTask = ({ route }) => {
    const [completedTasks, setCompletedTasks] = useState([]);
    const [categoryCounts, setCategoryCounts] = useState({});
    const tasks = route.params?.tasks || [];

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
                        <Text style={styles.taskText}>Topic: {item.topic}</Text>
                        <Text style={styles.taskText}>Description: {item.description}</Text>
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
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
    },
    taskText: {
        fontSize: 16,
    },
});

export default CompletedTask;