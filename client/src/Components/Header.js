import React from 'react';

function Header() {
    return (
        <header style={headerStyle}>
            <h1>Charging Stations</h1>
        </header>
    )
}

const headerStyle = {
    color: '#333',
    textAlign: 'left',
    padding: '10px'
}

export default Header;