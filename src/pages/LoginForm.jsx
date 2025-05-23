import React, { useState } from 'react';
import axios from 'axios';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('password123'); // Default password for simplicity
    const [step, setStep] = useState(1);
    const [code, setCode] = useState('');

    const handleLogin = () => {
        axios.post('https://tennis-backend-ioen.onrender.com/api/auth/login', { username, password })
            .then(res => {
               alert("Verification code sent to your email");
               setStep(2);
            })
            .catch(err => {
                alert("Login failed");
                console.error(err);
            });
    };

     const handleVerifyCode = () => {
        axios.post('https://tennis-backend-ioen.onrender.com/api/auth/verify-code', { username, code })
            .then(res => {
                localStorage.setItem('userId', res.data.userId);
                localStorage.setItem('username', username);
                alert("Login successful!");
                // Redirect or continue...
            })
            .catch(err => {
                alert("Invalid verification code");
                console.error(err);
            });
    };
    console.log("Current step:", step);

   return (
        <div>
            {step === 1 ? (
                <>
                    <input
                        placeholder="Username (email)"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Login</button>
                </>
            ) : (
                <>
                    <input
                        placeholder="Enter verification code"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                    />
                    <button onClick={handleVerifyCode}>Verify</button>
                </>
            )}
        </div>
    );
}

export default LoginForm;
