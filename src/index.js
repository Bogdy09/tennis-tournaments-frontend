import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';
import { TournamentProvider } from './context/TournamentContext.js'; // Import the provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {/* Wrap the App component with TournamentProvider */}
        <TournamentProvider>
            <App />
        </TournamentProvider>
    </React.StrictMode>
);

reportWebVitals();
