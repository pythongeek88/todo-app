import React, { useState } from "react";
import axios from "axios";
import { Button, Input } from "antd";

const RegisterForm = ({ setUserToken, switchForm }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const register = async () => {
        try {
            await axios.post("http://backend:8000/register/", { email, password });
            const response = await axios.post('http://backend:8000/api-token-auth/', { email, password });
            localStorage.setItem('userToken', response.data.token);
            setUserToken(response.data.token);
        } catch (error) {
            console.error("Error during registration", error);
        }
    };

    return (
        <div style={styles.container}>
          <h2 style={styles.title}>Register</h2>
          <form onSubmit={event => { event.preventDefault(); register(); }} style={styles.form}>
            <label style={styles.label}>
              Email:
              <Input placeholder="Email" value={email} onChange={event => setEmail(event.target.value)} required style={styles.input}/>
            </label>
            <label style={styles.label}>
              Password:
              <Input.Password placeholder="Password" value={password} onChange={event => setPassword(event.target.value)} required style={styles.input}/>
            </label>
            <Button type="primary" htmlType="submit" style={styles.submitButton}>Register</Button>
          </form>
          <p style={styles.switchFormText}>Already have an account? <span style={styles.switchFormLink} onClick={switchForm}>Log in</span></p>
        </div>
    );
};

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
    maxWidth: "400px",
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
  submitButton: {
    marginTop: "20px",
  },
  switchFormText: {
    marginTop: "10px",
  },
  switchFormLink: {
    color: "#1890ff",
    cursor: "pointer",
  },
};

export default RegisterForm;
