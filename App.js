import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TaskList from './components/TaskList';
import LoginScreen from './components/LoginScreen';
import AddTask from './components/AddTask';
import StatScreen from './components/StatScreen'
import SearchScreen from './components/SearchScreen'
import PinnedScreen from './components/PinnedScreen'
import DeleteTaskScreen from './components/DeleteTaskScreen'
import CompletedTask from './components/CompletedTask'
import {TaskProvider} from './context/TaskContext'

const Stack = createStackNavigator();

export default function App() {
    return (
      <TaskProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="TaskList" component={TaskList} options={{ title: 'Your Tasks' }} />
                <Stack.Screen name="AddTask" component={AddTask} options={{ title: 'Add/Edit Task' }} />
                <Stack.Screen name="StatScreen" component={StatScreen} />
                <Stack.Screen name="SearchScreen" component={SearchScreen} />
                <Stack.Screen name="DeleteTaskScreen" component={DeleteTaskScreen} />
                <Stack.Screen name="PinnedScreen" component={PinnedScreen} />
                <Stack.Screen name="CompletedTask" component={CompletedTask} />
                
            </Stack.Navigator>
        </NavigationContainer>
      </TaskProvider>
    );
}


