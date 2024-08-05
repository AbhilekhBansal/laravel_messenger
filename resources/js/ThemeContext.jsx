import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") == "true" || "false"
    );

    const [onlineUsers, setOnlineUsers] = useState([]);

    // Update localStorage when theme changes
    React.useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{ theme, setTheme, onlineUsers, setOnlineUsers }}
        >
            {children}
        </ThemeContext.Provider>
    );
};
