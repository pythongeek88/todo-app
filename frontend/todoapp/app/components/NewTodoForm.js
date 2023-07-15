import { Button, Input, Checkbox } from 'antd';
import { useState } from 'react';

function NewTodoForm({ setRefresh, todosCount, setTodos, todos }) {
    const [title, setTitle] = useState('');
    const [completed, setCompleted] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newTodo = { id: Date.now(), title, completed, order: todosCount, new: true, changed: true };
        const updatedTodos = [...todos, newTodo];
        setTodos(updatedTodos);
        localStorage.setItem('todos', JSON.stringify(updatedTodos)); // Store updatedTodos in local storage
        setTitle('');
        setCompleted(false);
    };
    
    // Styles for form container
    const stylesFormContainer = { 
      ...styles.container, 
      minHeight: "auto", 
      padding: "0px" 
  };    

    return (
      <div style={stylesFormContainer}>
            <h2 style={styles.title}>Add New Todo</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.label}>
                    Title:
                    <Input placeholder="Title" value={title} onChange={event => setTitle(event.target.value)} style={styles.input} required />
                </label>
                <div style={styles.checkboxContainer}>
                    <label style={styles.label}>
                        Completed:
                    </label>
                    <div style={styles.checkbox}>
                        <Checkbox checked={completed} onChange={event => setCompleted(event.target.checked)} />
                    </div>
                </div>
                <Button type="primary" htmlType="submit" style={styles.submitButton}>Add</Button>
            </form>
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
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "600px",
  },
  label: {
    marginBottom: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
    marginBottom: "15px",
  },
  checkbox: {
    marginBottom: "15px",
  },
  submitButton: {
    marginTop: "20px",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
  },
  label: {
    marginRight: "20px",
  },
  checkbox: {
    transform: "scale(2)",
  },
};

export default NewTodoForm;
