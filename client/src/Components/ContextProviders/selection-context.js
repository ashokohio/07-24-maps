import React from 'react';

// setSelection is an empty function by default
const SelectionContext = React.createContext({
    selection: "",
    setSelection: () => {}
});

export default SelectionContext;