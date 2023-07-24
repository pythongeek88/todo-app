import { GetServerSideProps } from 'next';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TodoItem from './TodoItem';
import NewTodoForm from './NewTodoForm';
import { Button } from 'antd';

function TodoList({ userToken, refresh, setRefresh }) {
    const [todos, setTodos] = useState(
        localStorage.getItem('todos')
          ? JSON.parse(localStorage.getItem('todos'))
          : []
      );
          
      const [initialTodos, setInitialTodos] = useState(
        localStorage.getItem('initialTodos')
          ? JSON.parse(localStorage.getItem('initialTodos'))
          : []
      );
      
    const [deletedTodos, setDeletedTodos] = useState(
        localStorage.getItem('deletedTodos')
          ? JSON.parse(localStorage.getItem('deletedTodos'))
          : []
      );
      


    const updateTodos = (newTodos) => {
        setTodos(newTodos);
        localStorage.setItem('todos', JSON.stringify(newTodos));
      };
    
    const updateDeletedTodos = (newDeletedTodoId) => {
        setDeletedTodos(prevDeletedTodos => {
            const updatedDeletedTodos = [...prevDeletedTodos, newDeletedTodoId];
            localStorage.setItem('deletedTodos', JSON.stringify(updatedDeletedTodos));
            return updatedDeletedTodos;
        });
    };

    const cleanDeletedTodos = () => {
        setDeletedTodos([]);
        localStorage.setItem('deletedTodos', JSON.stringify([]));
    };

    const updateInitialTodos = (newInitialTodos) => {
        setInitialTodos(newInitialTodos);
        localStorage.setItem('initialTodos', JSON.stringify(newInitialTodos));
    };


      useEffect(() => {
        const initialTodosFromLocalStorage = JSON.parse(localStorage.getItem('initialTodos')) || [];
        const deletedTodosFromLocalStorage = JSON.parse(localStorage.getItem('deletedTodos')) || [];
    
        setInitialTodos(initialTodosFromLocalStorage);
        setDeletedTodos(deletedTodosFromLocalStorage);

        axios.get('http://backend:8000/todos', {
            headers: { 'Authorization': `Token ${userToken}` }
        })
        .then(res => {
            const fetchedTodos = res.data.sort((a, b) => a.order - b.order);
            if (!localStorage.getItem('todos')) {
                // Update initialTodos in both state and local storage
                const initialTodosCopy = JSON.parse(JSON.stringify(fetchedTodos));
                updateInitialTodos(initialTodosCopy);
                updateTodos(fetchedTodos);
                cleanDeletedTodos()
            } else {
                // Check if todos in local storage match ones from server
                if (JSON.stringify(fetchedTodos) === JSON.stringify(todos)) {
                    // Update initialTodos in both state and local storage
                    const initialTodosCopy = JSON.parse(JSON.stringify(fetchedTodos));
                    updateInitialTodos(initialTodosCopy);
                    updateTodos(fetchedTodos);
                }
            }
            setRefresh(false);
        })
        .catch(err => {
            console.error(err);
        });
    }, [refresh]);

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(todos);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        items.forEach((item, index) => {
            if (index !== item.order) {
                item.changed = true;
            }
            item.order = index;
        });

        setTodos(items);
        localStorage.setItem('todos', JSON.stringify(items));
    };

    const saveChanges = async () => {
        const hasOrderChanged = todos.some((todo, index) => {
            const initialTodo = initialTodos.find(initialTodo => initialTodo.id === todo.id);
            return initialTodo ? todo.order !== initialTodo.order : false;
        });
        
        if (hasOrderChanged) {
            const batchUpdateData = todos.map((todo, index) => ({
                id: todo.id,
                order: index,
            }));
        
            // Perform the batch update
            try {
                await axios.patch('http://backend:8000/todos/batch-update/', batchUpdateData, {
                    headers: { Authorization: `Token ${userToken}` },
                });
            } catch (error) {
                console.error('Error during batch update', error);
            }
        }
        for (const todo of todos) {
            const initialTodo = initialTodos.find((initialTodo) => initialTodo.id === todo.id);
            
            if (todo.new) {
                try {
                    const res = await axios.post(
                        'http://backend:8000/todos/',
                        { title: todo.title, completed: todo.completed, order: todo.order },
                        { headers: { 'Authorization': `Token ${userToken}` }}
                    );
    
                    todo.id = res.data.id;
                    todo.new = false;
                } catch (error) {
                    console.error('Error during todo creation', error);
                }
            } else if (!initialTodo || todo.title !== initialTodo.title || todo.completed !== initialTodo.completed) {
                try {
                    await axios.patch(
                        `http://backend:8000/todos/${todo.id}/`,
                        { title: todo.title, completed: todo.completed, order: todo.order },
                        { headers: { 'Authorization': `Token ${userToken}` }}
                    );
                } catch (error) {
                    console.error(`Error during todo ${todo.id} update`, error);
                }
            }
        }
        // Delete todos from database
        for (const id of deletedTodos) {
            try {
                await axios.delete(
                    `http://backend:8000/todos/${id}/`,
                    { headers: { 'Authorization': `Token ${userToken}` }}
                );
            } catch (error) {
                console.error(`Error during todo ${id} deletion`, error);
            }
        }
        const newTodos = todos.map(todo => ({...todo, changed: false}));
        updateInitialTodos(newTodos);
        updateTodos(newTodos);
        cleanDeletedTodos();
    };
    
    
    const discardChanges = () => {
        const newTodos = initialTodos.map(todo => ({...todo, changed: false}));
        updateTodos(newTodos);
        cleanDeletedTodos();
    };
    
    
    const isChanged = JSON.stringify(todos) !== JSON.stringify(initialTodos) || deletedTodos.length > 0;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>My Todo List</h2>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="todos">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} style={styles.list}>
                            {todos.length > 0 ? (
                            todos.sort((a, b) => a.order - b.order).map((todo, index) => (
                                <Draggable key={todo.id} draggableId={String(todo.id)} index={index}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <TodoItem
                                        key={todo.id}
                                        index={index}
                                        todo={todo}
                                        setTodos={setTodos}
                                        todos={todos}
                                        setDeletedTodos={setDeletedTodos}
                                        updateTodos={updateTodos}
                                        updateDeletedTodos={updateDeletedTodos}
                                    />
                                    </div>
                                )}
                                </Draggable>
                            ))
                            ) : (
                            <div style={styles.emptyStateText}>
                                <p>You are more than welcome to add todo items! 😊</p>
                            </div>
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            {todos.length > 1 && 
                <div style={styles.reorderMessage}>
                    <p>You can reorder your todos by dragging them around.</p>
                </div>
            }
            {deletedTodos.length > 0 && (
                <p style={styles.warningText}>{deletedTodos.length} todo(s) will be deleted after saving.</p>
            )}
            <div style={styles.buttonContainer}>
            <Button 
                style={!isChanged ? styles.saveButtonDisabled : styles.saveButton} 
                onClick={saveChanges} 
                disabled={!isChanged}
                >
                Save Changes
            </Button>

            <Button 
                style={!isChanged ? styles.discardButtonDisabled : styles.discardButton} 
                onClick={discardChanges} 
                disabled={!isChanged}
                >
                Discard Changes
            </Button>
            </div>
            <NewTodoForm userToken={userToken} setRefresh={setRefresh} todosCount={todos.length} setTodos={setTodos} todos={todos} />
        </div>
    );
}

const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "0 20px",
      boxSizing: "border-box",
    },
    title: {
      marginBottom: "20px",
    },
    list: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      maxWidth: "600px",
    },
    emptyStateText: {
      marginTop: "20px",
      textAlign: "center",
      color: "#999",
    },
    warningText: {
        marginTop: "10px",
        color: "#ff4d4f",
        fontWeight: "bold",
      },
      buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
        width: "100%",
        maxWidth: "600px",
      },
      saveButton: {
        backgroundColor: "#52c41a",
        borderColor: "#52c41a",
        color: "#fff",
      },
      saveButtonDisabled: {
        backgroundColor: "#52c41a",
        borderColor: "#52c41a",
        color: "#fff",
        opacity: 0.5,
      },
      discardButton: {
        backgroundColor: "#d9d9d9",
        borderColor: "#d9d9d9",
        color: "#000",
      },
      discardButtonDisabled: {
        backgroundColor: "#d9d9d9",
        borderColor: "#d9d9d9",
        color: "#000",
        opacity: 0.5,
      },
      reorderMessage: {
        marginTop: "20px",
        color: "#888",
      },
    };

export default TodoList;
