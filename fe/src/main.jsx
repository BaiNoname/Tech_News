import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/forms.css";
import "./styles/admin.css";
import "./styles/animations.css";
import "./styles/responsive.css";
import "./styles/enhancements.css";

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)