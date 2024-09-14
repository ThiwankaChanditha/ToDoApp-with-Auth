import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const DeleteTaskScreen = ({ route, navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTasks, setFilteredTasks] = useState(route.params?.tasks || []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = route.params?.tasks.filter(task =>
            task.topic.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredTasks(filtered);
    };

    const deleteTask = (taskId) => {
        const updatedTasks = route.params?.tasks.filter(task => task.id !== taskId);
        navigation.navigate('TaskList', { tasks: updatedTasks });
        setFilteredTasks(updatedTasks);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search by Topic"
                value={searchQuery}
                onChangeText={handleSearch}
            />
            <FlatList
                data={filteredTasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.taskItem}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.taskText}>Topic: {item.topic}</Text>
                            <Text style={styles.taskText}>Description: {item.description}</Text>
                        </View>
                        <TouchableOpacity onPress={() => deleteTask(item.id)}>
                            <MaterialIcons name="delete" size={24} color="red" />
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
        backgroundColor: '#F5F5F5',
    },
    searchBar: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
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

export default DeleteTaskScreen;
