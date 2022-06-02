import React from 'react';

// setElevations is an empty function by default
const ClickedContext = React.createContext({
    clicked: false,
    setClicked: () => {},
});

export default ClickedContext;