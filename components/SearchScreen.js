import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TaskContext } from '../context/TaskContext';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = () => {
    const { tasks, deleteTask } = useContext(TaskContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [filteredTasks, setFilteredTasks] = useState(tasks || []);
    const [showCalendar, setShowCalendar] = useState(false);
    const navigation = useNavigation();

    const filterTasks = () => {
        const filtered = tasks.filter(task => {
            const matchesQuery = task.topic.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDate = selectedDate ? task.date === selectedDate.toISOString().split('T')[0] : true;
            return matchesQuery && matchesDate;
        });
        setFilteredTasks(filtered);
    };

    useEffect(() => {
        filterTasks();
    }, [searchQuery, selectedDate, tasks]);

    const handleEditTask = (task) => {
        navigation.navigate('AddTask', { task, editMode: true });
    };

    const handleDeleteTask = (taskId) => {
        deleteTask(taskId);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder='Search by topic'
                value={searchQuery}
                onChangeText={text => setSearchQuery(text)}
            />

            <View style={styles.dateContainer}>
                <TouchableOpacity onPress={() => setShowCalendar(true)} style={styles.dateButton}>
                    <Icon name="calendar-today" size={24} color="#0782F9" />
                    <Text style={styles.dateText}>
                        {selectedDate ? selectedDate.toDateString() : 'Select Date'}
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={filterTasks}
            >
                <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>

            {filteredTasks.length > 0 ? (
                <FlatList
                    data={filteredTasks}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.taskItem}>
                            <Text style={styles.taskText}>Topic: {item.topic}</Text>
                            <Text style={styles.taskText}>Date: {item.date}</Text>
                            <View style={styles.actionsContainer}>
                                <TouchableOpacity onPress={() => handleEditTask(item)}>
                                    <Icon name="edit" size={24} color="blue" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                                    <Icon name="delete" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            ) : (
                <View style={styles.noTasksContainer}>
                    <Text style={styles.noTasksText}>No tasks found</Text>
                </View>
            )}

            <Modal visible={showCalendar} transparent={true}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <CalendarPicker
                            onDateChange={(date) => {
                                setSelectedDate(date);
                                setShowCalendar(false);
                            }}
                        />
                        <TouchableOpacity onPress={() => setShowCalendar(false)}>
                            <Text style={styles.modalCloseButton}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#0782F9',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: 'white',
    },
    dateText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    taskItem: {
        padding: 15,
        backgroundColor: 'white',
        marginBottom: 10,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskText: {
        fontSize: 16,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    noTasksContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noTasksText: {
        fontSize: 18,
        color: '#333',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalCloseButton: {
        marginTop: 20,
        fontSize: 16,
        color: 'red',
    },
});

export default SearchScreen;
