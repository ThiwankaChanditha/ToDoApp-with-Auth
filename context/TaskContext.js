import React, { createContext, useState } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [pinnedTasks, setPinnedTasks] = useState([]);

    const pinTask = (task) => {
        if (pinnedTasks.find(t => t.id === task.id)) {
            setPinnedTasks(pinnedTasks.filter(t => t.id !== task.id));
        } else {
            setPinnedTasks([...pinnedTasks, task]); 
        }
    };

    const unpinTask = (taskId) => {
        setPinnedTasks(pinnedTasks.filter(task => task.id !== taskId)); 
    };

    return (
        <TaskContext.Provider value={{ tasks, setTasks, pinnedTasks, pinTask, unpinTask }}>
            {children}
        </TaskContext.Provider>
    );
};
