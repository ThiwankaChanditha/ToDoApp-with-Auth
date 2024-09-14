import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { TaskContext } from '../context/TaskContext'; 

const StatScreen = ({ navigation }) => {
    const { tasks } = useContext(TaskContext);
    const [taskStats, setTaskStats] = useState({
        completed: 0,
        uncompleted: 0,
        categories: {},
        tasksByDate: {},
    });
    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (tasks) {
                const completedTasks = tasks.filter(task => task.completed).length;
                const uncompletedTasks = tasks.filter(task => !task.completed).length;

                const categories = tasks.reduce((acc, task) => {
                    if (task.category) {
                        acc[task.category] = (acc[task.category] || 0) + 1;
                    }
                    return acc;
                }, {});

                // Count tasks by date, ensuring valid dates
                const tasksByDate = tasks.reduce((acc, task) => {
                    if (task.created_at) {
                        const taskDate = new Date(task.created_at);
                        if (!isNaN(taskDate.getTime())) { // Check if the date is valid
                            const formattedDate = taskDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
                            acc[formattedDate] = (acc[formattedDate] || 0) + 1;
                        }
                    }
                    return acc;
                }, {});

                setTaskStats({
                    completed: completedTasks,
                    uncompleted: uncompletedTasks,
                    categories,
                    tasksByDate,
                });
            }
        });

        return unsubscribe;
    }, [tasks, navigation]);

    const handleViewCompletedTasks = () => {
        navigation.navigate('CompletedTask', { tasks });
    };

    // Get the task counts for each day of the week
    const getTasksForLastWeek = () => {
        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const now = new Date();
        const oneWeekAgo = new Date(now.setDate(now.getDate() - 6)); // Get the date 6 days ago

        const tasksCount = daysOfWeek.map((_, i) => {
            const day = new Date(oneWeekAgo);
            day.setDate(oneWeekAgo.getDate() + i);
            const dayString = day.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            return taskStats.tasksByDate[dayString] || 0; // Get the task count for this date or 0 if none
        });

        return {
            labels: daysOfWeek,
            datasets: [
                {
                    data: tasksCount,
                    strokeWidth: 2,
                },
            ],
        };
    };

    const data = getTasksForLastWeek();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Task Statistics</Text>
            <Text style={styles.stat}>Completed Tasks: {taskStats.completed}
              <TouchableOpacity style={styles.eyeIcon} onPress={handleViewCompletedTasks}>
                <MaterialIcons name="remove-red-eye" size={24} color="black" />
              </TouchableOpacity>
            </Text>
            <Text style={styles.stat}>Uncompleted Tasks: {taskStats.uncompleted}</Text>

            <Text style={styles.subtitle}>Tasks by Category:</Text>
            <FlatList
                data={Object.entries(taskStats.categories)}
                keyExtractor={item => item[0]}
                renderItem={({ item }) => (
                    <View style={styles.categoryItem}>
                        <Text style={styles.categoryText}>{item[0]}: {item[1]}</Text>
                    </View>
                )}
            />

            <Text style={styles.subtitle}>Tasks Added This Week:</Text>
            <LineChart
                data={data}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                    backgroundColor: '#e26a00',
                    backgroundGradientFrom: '#fb8c00',
                    backgroundGradientTo: '#ffa726',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    stat: {
        fontSize: 18,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    categoryItem: {
        padding: 10,
        backgroundColor: 'white',
        marginBottom: 5,
        borderRadius: 5,
    },
    categoryText: {
        fontSize: 16,
    },
    eyeIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginLeft: 20,
    },
});

export default StatScreen;
