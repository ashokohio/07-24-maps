import React from 'react';

// setDistances is an empty function by default
const DistContext = React.createContext({
    distances: [],
    setDistances: () => {},
});

export default DistContext;