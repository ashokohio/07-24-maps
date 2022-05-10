import React from 'react';

// setPath is an empty function by default
const PathContext = React.createContext({
    path: null,
    setPath: () => {},
});

export default PathContext;