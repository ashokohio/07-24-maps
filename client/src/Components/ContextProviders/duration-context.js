import React from 'react';

// setDurations is an empty function by default
const DuraContext = React.createContext({
    durations: [],
    setDurations: () => {},
});

export default DuraContext;