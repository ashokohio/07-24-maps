# ACL Map Client

Built with React JS. 

### index.js
Purposes:
- Bootstrap grid layout for components.
- Context providers

## Components directory
### Header.js
Purposes:
- Contains basic HTML for the site header

### Map.js
Purposes:
- Filter option buttons for stations
- Travel mode option buttons
- Search bar for custom origin
- Map, station pins, and info windows

Notes:
- Uses context providers to pass data between parent (index.js) and child on markers, selection, distances, durations, favorites, and filter choice

###### success(position)
Takes a position object as an argument and updates the user's current location (currentPosition state)

`positionObj = {
    coords: {
        latitude:
        longitude:
    }
 }`
 
###### handleToggleOpen(marker)
Takes a station marker as an argument and updates the opened marker (selection state)

###### onLoad(autocomplete)
Takes an autocomplete object as an argument and updates the autocomplete object (autocomplete state)

###### onPlaceChanged()
Updates the user's current location (currentPosition state) with the latitude and longitude coordinates from the current autocomplete object (autocomplete state)

###### toggleFave(marker)
Takes a station marker as an argument and updates array of favorited stations by adding or removing a station from that array (favorites state)

###### updateLocalStorage(marker)
Takes a station marker as an argument and removes or adds the marker as a favorite in Local Storage

###### handleFilter(e)
Takes a dropdown filter selection event as an argument and updates the station list filter accordingly (filter state)

###### handleModeChange(e)
Takes a travel mode selection event as an argument and updates the travel mode accordingly (modeValue state)

###### directionsCallback(response)
Handles Google Maps API Direction Service callback response by updating directions (directions state)

### Sidebar.js
Purposes:
- Infocards to display information about stations

Notes:
- Uses context providers to pass data between parent (index.js) and child on markers, selection, distances, durations, favorites, and filter choice

###### handleClick(marker)
Takes a station marker as an argument and updates the selected station (selection state)

###### toggleFave(marker)
Takes a station marker as an argument and updates array of favorited stations by adding or removing a station from that array (favorites state)

###### updateLocalStorage(marker)
Takes a station marker as an argument and removes or adds the marker as a favorite in Local Storage
