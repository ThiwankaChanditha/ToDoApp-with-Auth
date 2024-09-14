// TaskContext.js
import React, { createContext, useState } from 'react';

// Create the context
export const TaskContext = createContext();

// Create the provider component
export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    return (
        <TaskContext.Provider value={{ tasks, setTasks }}>
            {children}
        </TaskContext.Provider>
    );
};
