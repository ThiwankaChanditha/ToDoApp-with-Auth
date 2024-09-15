import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { TaskContext } from '../context/TaskContext'; 

const StatScreen = ({ navigation }) => {
    const { tasks } = useContext(TaskContext);
    const [taskStats, setTaskStats] = useState({
        completed: 0,
        uncompleted: 0,
        categories: {},
    });
    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (tasks) {
                const completedTasks = tasks.filter(task => task.completed).length;
                const uncompletedTasks = tasks.filter(task => !task.completed).length;

                const categories = tasks.reduce((acc, task) => {
                    const category = task.category || 'undefined';  // Default to 'undefined' if no category
                    acc[category] = (acc[category] || 0) + 1;
                    return acc;
                }, {});

                setTaskStats({
                    completed: completedTasks,
                    uncompleted: uncompletedTasks,
                    categories,
                });
            }
        });

        return unsubscribe;
    }, [tasks, navigation]);

    const handleViewCompletedTasks = () => {
        navigation.navigate('CompletedTask', { tasks });
    };

    const getCategoryDataForPieChart = () => {
        const categories = taskStats.categories;
        const colors = ['#f44336', '#2196f3', '#4caf50', '#ffeb3b', '#9c27b0', '#e91e63', '#00bcd4', '#ff9800'];
        
        return Object.entries(categories).map(([category, count], index) => ({
            name: category,
            population: count,
            color: colors[index % colors.length],
            legendFontColor: '#333',
            legendFontSize: 15,
        }));
    };

    const pieChartData = getCategoryDataForPieChart();

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
            <PieChart
                data={pieChartData}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    backgroundColor: '#fff',
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute // Displays percentages
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
    eyeIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginLeft: 20,
    },
});

export default StatScreen;
