import React from 'react';

// setSelection is an empty function by default
const FilterContext = React.createContext({
    filter: "",
    setFilter: () => {}
});

export default FilterContext;