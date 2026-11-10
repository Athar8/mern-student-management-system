import React, { useState } from "react";
import axios from "axios";

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        {
          email,
          password,
        }
      );

      // Save login information
      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Login successful!");

      onLogin();

    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server error");
      }
    }
  };

  return (
    <div className="login-container">

      <div className="login-box">

        <h2>🔐 Student Management Login</h2>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

        <p>
          Don't have an account?
        </p>

        <button
          type="button"
          onClick={onRegister}
        >
          📝 Register
        </button>

      </div>

    </div>
  );
}

export default Login;