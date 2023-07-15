"use client";
import React, { useState, useEffect } from 'react';

import TodoList from './components/TodoList';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {
  const [isRegistering, setIsRegistering] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  
  const switchForm = () => {
    setIsRegistering(!isRegistering); // toggle form
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    setUserToken(token);
    setIsLoading(false);
  }, []); 

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userToken) {
    return (
      <div style={styles.container}>
        {isRegistering
          ? <RegisterForm switchForm={switchForm} setUserToken={setUserToken} />
          : <LoginForm switchForm={switchForm} setUserToken={setUserToken} />}
      </div>
    );
  }

  return (
    <div>
      <TodoList userToken={userToken} refresh={refresh} setRefresh={setRefresh} />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f7f9fa",
  }
};

export default App;
