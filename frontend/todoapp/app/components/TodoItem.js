import { Button, Input, Checkbox } from 'antd';
import { useState } from 'react';

function TodoItem({ index, todo, todos, updateTodos, updateDeletedTodos}) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(todo.title);
    const [completed, setCompleted] = useState(todo.completed);

  
    const handleUpdate = () => {
      const newTodos = todos.map((t) => t.id === todo.id ? {...t, title, completed, changed: true} : t);
      updateTodos(newTodos);
      setIsEditing(false);
    };


    const handleDelete = () => {
      const newTodos = todos.filter((t) => t.id !== todo.id);
      updateTodos(newTodos);
      updateDeletedTodos(todo.id);
    };


    if (isEditing) {
        return (
            <form onSubmit={handleUpdate} style={styles.form}>
                <Input placeholder="Title" value={title} onChange={event => setTitle(event.target.value)} style={styles.input}/>
                <Checkbox checked={completed} onChange={event => setCompleted(event.target.checked)} style={styles.checkbox}>Completed</Checkbox>
                <Button type="primary" htmlType="submit" style={styles.saveButton}>Save locally</Button>
                <Button onClick={() => setIsEditing(false)} style={styles.cancelButton}>Cancel</Button>
            </form>
        );
    } else {
        return (
            <div style={todo.changed ? {...styles.todoItem, ...styles.todoItemChanged} : styles.todoItem}>
              <span style={styles.todoOrder}>{index + 1}</span>
              <Checkbox style={styles.todoCheckbox} checked={todo.completed} disabled></Checkbox>
              <div style={styles.todoTitle}>{title}</div>
              <Button onClick={() => setIsEditing(true)} style={styles.editButton}>Edit</Button>
              <Button onClick={handleDelete} style={styles.deleteButton}>Delete</Button>
            </div>
          );
    }
}

const styles = {
    form: {
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    input: {
        marginRight: "10px",
        flex: 2
    },
    checkbox: {
        marginRight: "10px",
        flex: 1
    },
    saveButton: {
        marginRight: "10px",
        backgroundColor: "#52c41a",
        borderColor: "#52c41a",
    },
    cancelButton: {
        backgroundColor: "#d9d9d9",
        borderColor: "#d9d9d9",
    },
    todoItem: {
        border: "1px solid #d9d9d9",
        borderRadius: "2px",
        marginBottom: "10px",
        padding: "10px",
        display: "flex",
        alignItems: "center",
    },
    todoItemChanged: {
        color: "#52c41a",
    },
    todoOrder: {
        marginRight: "10px",
    },
    todoTitle: {
        flex: "1",
        marginLeft: "10px",
    },
    todoCheckbox: {
        transform: "scale(2)",
        marginRight: "10px",
    },
    editButton: {
        marginRight: "10px",
        backgroundColor: "#52c41a",
        borderColor: "#52c41a",
    },
    deleteButton: {
        backgroundColor: "#ff4d4f",
        borderColor: "#ff4d4f",
    },
};

export default TodoItem;
