import React from 'react';

// setElevations is an empty function by default
const ElevContext = React.createContext({
    elevations: [],
    setElevations: () => {},
});

export default ElevContext;