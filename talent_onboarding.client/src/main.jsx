
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux"; // Provides Redux store to the React app
import { BrowserRouter as Router } from "react-router-dom"; // Enables routing
import store from "./features/store"; // Your Redux store
import App from "./App"; // Root component
import "./index.css"; // Global styles, including Tailwind CSS

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Provider store={store}>
            <Router>
                <App />
            </Router>
        </Provider>
    </React.StrictMode>
);
