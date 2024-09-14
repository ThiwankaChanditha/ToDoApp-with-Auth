import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import Modal from 'react-native-modal';

const screenHeight = Dimensions.get('window').height;

const AddTask = ({ navigation, route }) => {
    const [topic, setTopic] = useState(route.params?.task?.topic || '');
    const [description, setDescription] = useState(route.params?.task?.description || '');
    const [category, setCategory] = useState(route.params?.task?.category || '');
    const [date, setDate] = useState(route.params?.task?.date || null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

    const handleSaveTask = () => {
        const newTask = {
            id: route.params?.task?.id || Date.now(),
            topic,
            description,
            category: isAddingNewCategory ? newCategory : category,
            date: date ? date.toString() : 'No date selected',
        };
        const tasks = route.params?.tasks || [];
        navigation.navigate('TaskList', { newTask, editMode: route.params?.editMode });
    };

    const handleAddNewCategory = () => {
        if (newCategory.trim()) {
            setCategories([...categories, newCategory]);
            setIsAddingNewCategory(false);
            setCategory(newCategory);
            setNewCategory('');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Task Topic"
                    value={topic}
                    onChangeText={setTopic}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Enter Task Description"
                    value={description}
                    onChangeText={setDescription}
                />

                <View style={styles.categoryContainer}>
                    <Text style={styles.label}>Select or Add Category:</Text>

                    {!isAddingNewCategory ? (
                        <>
                            {categories.map((cat, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setCategory(cat)}
                                    style={[styles.categoryButton, category === cat && styles.selectedCategory]}
                                >
                                    <Text style={[styles.categoryText, category === cat && styles.selectedCategoryText]}>
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                onPress={() => setIsAddingNewCategory(true)} 
                                style={styles.addNewCategoryButton}
                            >
                                <Text style={styles.addNewCategoryText}>+ Add New Category</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter New Category"
                                value={newCategory}
                                onChangeText={setNewCategory}
                            />
                            <TouchableOpacity onPress={handleAddNewCategory} style={styles.saveCategoryButton}>
                                <Text style={styles.saveCategoryButtonText}>Save New Category</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsAddingNewCategory(false)} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <TouchableOpacity style={styles.button} onPress={() => setShowCalendar(true)}>
                    <Text style={styles.buttonText}>Select Date: {date ? date.toString() : 'No date selected'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleSaveTask}
                >
                    <Text style={styles.addButtonText}>
                        {route.params?.editMode ? 'Save Task' : 'Add Task'}
                    </Text>
                </TouchableOpacity>

                {showCalendar && (
                    <Modal isVisible={showCalendar}>
                        <View style={styles.modalContent}>
                            <CalendarPicker
                                onDateChange={(selectedDate) => {
                                    setDate(selectedDate);
                                    setShowCalendar(false);
                                }}
                            />
                            <TouchableOpacity onPress={() => setShowCalendar(false)}>
                                <Text style={styles.modalCloseButton}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 20,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
        minHeight: screenHeight,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    button: {
        padding: 10,
        backgroundColor: '#4CAF50',
        marginVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#2196F3',
        padding: 15,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 20,
    },
    addButtonText: {
        color: 'white',
        fontSize: 18,
    },
    categoryContainer: {
        marginTop: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
    },
    categoryButton: {
        padding: 10,
        backgroundColor: '#ddd',
        marginVertical: 5,
        borderRadius: 5,
    },
    categoryText: {
        fontSize: 16,
        color: '#333',
    },
    selectedCategory: {
        backgroundColor: '#4CAF50',
    },
    selectedCategoryText: {
        color: 'white',
    },
    addNewCategoryButton: {
        padding: 10,
        backgroundColor: '#f0ad4e',
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    addNewCategoryText: {
        color: 'white',
        fontSize: 16,
    },
    saveCategoryButton: {
        padding: 10,
        backgroundColor: '#5cb85c',
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    saveCategoryButtonText: {
        color: 'white',
        fontSize: 16,
    },
    cancelButton: {
        padding: 10,
        backgroundColor: '#d9534f',
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalCloseButton: {
        fontSize: 16,
        color: 'red',
        marginTop: 20,
    },
});

export default AddTask;
