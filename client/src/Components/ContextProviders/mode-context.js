import React from 'react';

// setMode is an empty function by default
const ModeContext = React.createContext({
    mode: "DRIVING",
    setMode: () => {},
});

export default ModeContext;