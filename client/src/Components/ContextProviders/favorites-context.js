import React from 'react';

// setFavorites is an empty function by default
const FaveContext = React.createContext({
    favorites: [],
    setFavorites: () => {},
});

export default FaveContext;