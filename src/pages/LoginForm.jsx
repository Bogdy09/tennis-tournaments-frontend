import React, { useState } from 'react';
import axios from 'axios';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('password123'); // Default password for simplicity

    const handleLogin = () => {
        axios.post('https://tennis-backend-ioen.onrender.com/api/auth/login', { username, password })
            .then(res => {
                localStorage.setItem('userId', res.data.userId);
                localStorage.setItem("username", res.data.username);

                alert("Login success!");
            })
            .catch(err => {
                alert("Login failed");
                console.error(err);
            });
    };

    return (
        <div>
            <input
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            <input
                placeholder="Password"
                value={password}
                onChange={e=>setPassword(e.target.value) }
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default LoginForm;
