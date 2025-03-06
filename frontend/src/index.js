import React from 'react';
import ReactDOM from 'react-dom/client'; // Use 'react-dom/client' for React 18+
import './index.css'; // Ensure you're referencing the right CSS file
import App from './App';
import reportWebVitals from './reportWebVitals'; // Optional for performance measurement

// Create a root element for rendering
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

reportWebVitals(); // Optional for performance measurement