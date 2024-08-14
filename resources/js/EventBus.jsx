import React from "react";

export const EventBusContext = React.createContext();
export const EventBusProvider = ({ children }) => {
    const [events, setEvents] = React.useState({});

    const emit = (name, date) => {
        if (events[name]) {
            for (let cb of events[name]) {
                cb(date);
            }
        }
    };
    const on = (name, cb) => {
        if (!events[name]) {
            events[name] = [];
        }
        events[name].push(cb);

        return () => {
            events[name] = events[name].filter((callback) => callback !== cb);
        };
    };
    return (
        <EventBusContext.Provider value={{ emit, on }}>
            {children}
        </EventBusContext.Provider>
    );
};

export const useEventBus = () => {
    return React.useContext(EventBusContext);
};
