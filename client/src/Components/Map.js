// import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState, useEffect } from "react";
import { GoogleMap, InfoWindow, Marker, DistanceMatrixService, Autocomplete, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import MarkerContext from "./ContextProviders/marker-context";
import SelectionContext from "./ContextProviders/selection-context";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import DistContext from "./ContextProviders/distance-context";
import DuraContext from './ContextProviders/duration-context';
import { Container, Row, Col, DropdownButton, Dropdown, Badge } from "react-bootstrap";
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import FaveContext from "./ContextProviders/favorites-context";
import {IoStar, IoStarOutline} from 'react-icons/io5';
import FilterContext from "./ContextProviders/filter-context";
import PathContext from "./ContextProviders/path-context";
import ElevContext from './ContextProviders/elevation-context';

function Map() {
    
    // context providers
    let markers = React.useContext(MarkerContext);
    let { selection, setSelection } = React.useContext(SelectionContext);
    let { distances, setDistances } = React.useContext(DistContext);
    let { durations, setDurations } = React.useContext(DuraContext);
    let { favorites, setFavorites } = React.useContext(FaveContext);
    let { filter, setFilter } = React.useContext(FilterContext);
    let { path, setPath } = React.useContext(PathContext);
    let { elevations, setElevations } = React.useContext(ElevContext);

    let getArray = JSON.parse(localStorage.getItem('favorites') || '0');

    useEffect(() => {
        if (getArray !== 0) {
            setFavorites([...getArray]);
        }
    }, [])

    // state: user's current location
    const [currentPosition, setCurrentPosition] = useState({});

    // state: user's custom input
    // const [customPosition, setCustomPosition] = useState({});
    const [checked, setChecked] = useState(false);
    const [autocomplete, setAutocomplete] = useState(null);

    // state: travel mode
    const [modeValue, setModeValue] = useState("DRIVING");

    // state: filter
    let [filterNum, setFilterNum] = React.useState(0);

    // state: directions response
    let [directions, setDirections] = React.useState(null);

    // function to load onto current position
    const success = position => {
        if (!selection) {
            setDirections(null);
        }

        const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }
        setCurrentPosition(currentPosition);
    }

    useEffect(() => {
        console.log("mounted");
        if (!checked) {
            navigator?.geolocation.getCurrentPosition(success);
        }
    }, [checked])


    // function to update selected station
    const handleToggleOpen = (marker) => {
        setSelection(marker);
    }

    // travel mode buttons
    const modes = [
        {name: ' Driving', value: 'DRIVING'},
        {name: ' Transit', value: 'TRANSIT'},
        {name: ' Pedestrian', value: 'WALKING'},
    ]

    // functions to handle autocomplete search
    const onLoad = (autocomplete) => {
        console.log("autocomplete: ", autocomplete);
        setAutocomplete(autocomplete);
    }
    
    const onPlaceChanged = () => {
        if (!selection) {
            setDirections(null);
        }

        if (autocomplete !== null && autocomplete.getPlace().geometry) {
            console.log(autocomplete.getPlace());
            const customPosition = {
                lat: autocomplete.getPlace().geometry.location.lat(),
                lng: autocomplete.getPlace().geometry.location.lng()
            }
            setCurrentPosition(customPosition);
        } else {
            console.log("Autocomplete is not loaded yet!");
        }
    }


    // function to handle toggle favorite station
    const toggleFave = (marker) => {
        let arr = favorites;
        let addArr = true;

        arr.map((item, key) => {
            if (item === marker.id) { // if id is in arr...
                arr.splice(key, 1); // remove id from arr
                addArr = false;
            }
        });

        if (addArr) { // if id is not in arr...
            arr.push(marker.id); // add id to arr
        }

        setFavorites([...arr]); // update favorites

        // add to localStorage
        updateLocalStorage(marker);
    }

    // function to add/remove favorites in Local Storage
    const updateLocalStorage = (marker) => {
        localStorage.setItem("favorites", JSON.stringify(favorites));

        let storage = localStorage.getItem('favItem' + (marker.id) || '0');
        if (storage == null) {
            localStorage.setItem(('favItem' + (marker.id)), JSON.stringify(marker));
        } else {
            localStorage.removeItem('favItem' + (marker.id));
        }
    }

    // function to handle dropdown filters
    let filters = [
        "All stations",
        "Favorites only",
        "Working stations"
    ]

    const handleFilter = (e) => {
        setSelection(null);
        setDirections(null);
        setFilter(e);
        setFilterNum(parseInt(e[7]));
    }

    // function to handle mode change
    let handleModeChange = (e) => {
        setModeValue(e);
    }

    // function to handle directions service callback
    let directionsCallback = (response) => {
        console.log("directions service response: " + JSON.stringify(response));

        if (response !== null) {
            if (response.status === 'OK') {
              setDirections(response);
              setPath({
                  path: response.routes[0].overview_path,
                  samples: response.routes[0].overview_path.length < 512 ? response.routes[0].overview_path.length : 512
              });
            } else {
              setDirections(null);
            }
        }
    }

    // elevator to use Google Maps ElevationService API
    let elevator = new window.google.maps.ElevationService();

    // function to handle battery usage button
    let handleBatteryButton = () => {
        console.log("handleBatteryButton called");

        // make elevation request
        elevationRequest();
    }

    // function to make elevation request
    let elevationRequest = () => {
        console.log("elevationRequest called");
        console.log("path: " + JSON.stringify(path.path));
        console.log("sample: " + path.samples);

        elevator.getElevationAlongPath(path, (results, status) => {
            if (status == "OK") {
                console.log("status OK");
                console.log("results: " + JSON.stringify(results));

                // update elevations state
                setElevations(results);
            } else {
                console.log("status not OK");
            }
        }
        );
    }

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <ButtonGroup toggle>
                        <ToggleButton
                        variant="outline-primary"
                        type="checkbox"
                        checked={checked}
                        value="1"
                        id="1"
                        onChange={(e) => setChecked(e.currentTarget.checked)}
                        >
                            Custom origin
                        </ToggleButton>
                        </ButtonGroup>
                    </Col>

                    <Col> {
                        checked && (
                            <Autocomplete
                            onLoad={onLoad}
                            onPlaceChanged={onPlaceChanged}
                            >
                                <input
                                type="text"
                                placeholder="Search"
                                style={{
                                    boxSizing: `border-box`,
                                    border: `1px solid`,
                                    height: `34px`,
                                    width: `100%`,
                                    margin: "1px",
                                    padding: `0 12px`,
                                    borderRadius: `3px`,
                                    fontSize: `14px`,
                                    outline: `none`,
                                    textOverflow: `ellipses`,
                                }}
                                />
                            </Autocomplete>
                        )
                    }</Col>
                    
                </Row>   

                <Row
                style={{padding: "7px 0px 7px 0px"}}>
                    <Col>
                        <ToggleButtonGroup
                        name="radioMode"
                        >
                            {
                                modes.map((mode, idx) => (
                                    <ToggleButton
                                    key={idx}
                                    type="radio"
                                    variant="primary"
                                    name="mode"
                                    id={mode.value}
                                    value={mode.value}
                                    checked={modeValue === mode.value}
                                    onChange={(e) => handleModeChange(e.currentTarget.value)}
                                    >
                                        {mode.name}
                                    </ToggleButton>
                                ))
                            }
                        </ToggleButtonGroup>
                    </Col>
                    
                    <Col>
                        <DropdownButton
                        id="dropdown-filters"
                        title={filters[filterNum]}
                        onSelect={handleFilter}
                        >   <Dropdown.Item eventKey="option-0">{filters[0]}</Dropdown.Item>
                            <Dropdown.Item eventKey="option-1">{filters[1]}</Dropdown.Item>
                            <Dropdown.Item eventKey="option-2">{filters[2]}</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                </Row>             

                <Row>
                    <GoogleMap
                    mapContainerStyle={{ height: "500px" }}
                    zoom={14}
                    center={currentPosition}
                    >
                        {
                            (selection) && (
                                <DirectionsService
                                 options={{
                                     destination: selection.location,
                                     origin: currentPosition,
                                     travelMode: modeValue
                                 }}
                                 callback={directionsCallback}
                                />
                            )
                        }

                        {
                            directions && (
                                <DirectionsRenderer
                                 options={{
                                     directions: directions
                                 }}
                                />
                            )
                        }

                        {currentPosition.lat && (
                        <DistanceMatrixService
                        options={{
                            destinations: markers.map(station => station.location),
                            origins: [currentPosition],
                            travelMode: modeValue,
                            unitSystem: window.google.maps.UnitSystem.IMPERIAL,
                        }}
                        callback = {(response) => {
                            console.log(response);
                            let i = 1;
                            setDistances(response.rows[0].elements.map(
                                el => [ i++, (el.status === 'OK' ? el.distance.text : "No " + modeValue.toLowerCase() + " available") ]
                            ));
                            i = 1;
                            setDurations(response.rows[0].elements.map(
                                el => [ i++, (el.status === 'OK' ?  ", " + el.duration.text + " away" : "") ]
                            ));
                        }}
                        />)}
                        {
                            currentPosition.lat &&
                            (
                                <Marker icon={{
                                    path: "M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z",
                                    fillColor: "#000",
                                    fillOpacity: 1,
                                    scale: 1.5
                                }}
                                position={currentPosition}
                                />
                            )
                        }
                        {
                            // map function to create markers for each station
                            currentPosition.lat && (markers.map(item => {

                                if (filter === "option-1" && !favorites.includes(item.id)) {
                                    return;
                                } else if (filter === "option-2" && item.status==="out of order") {
                                    return;
                                }

                                // link directs to Google Maps route planner
                                let mapLink = "https://www.google.com/maps/dir/?api=1&destination=" 
                                + item.location.lat 
                                + "," + item.location.lng;
                                
                                // get distance from distances array
                                let distance = distances.find(el => el[0] === item.id);
                                let duration = durations.find(el => el[0] === item.id);
                                let variant = "success";
                                let fillColor = "#5cb85c";
                                let strokeColor = "#46a046";
                                if (item.status === "in use") {
                                    variant = "warning";
                                    fillColor = "#f0ad4e";
                                    strokeColor = "#eb9114";
                                } else if (item.status === "out of order") {
                                    variant = "danger";
                                    fillColor = "#d9534f";
                                    strokeColor = "#bc2e29";
                                }

                                return (
                                    <Marker 
                                    key={item.id}
                                    position={item.location}
                                    icon={{
                                        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                                        fillColor: fillColor,
                                        fillOpacity: 1,
                                        strokeWeight: 3,
                                        strokeColor: strokeColor,
                                        scale: 2.0
                                    }}
                                    onClick={() => handleToggleOpen(item)}
                                    >
                                        {
                                            // "if statement" that opens an InfoWindow if this is the selected station
                                            (selection && selection.id === item.id) && 
                                            (
                                                <InfoWindow>
                                                    <div>
                                                        <h6>{item.name} <Badge 
                                                        pill
                                                        style={{margin: '0px 8px 2px 6px', padding: '2px 7px 2px 7px'}}
                                                        bg={variant}>{item.status}
                                                    </Badge>
                                                        {
                                                            favorites.includes(item.id) ? 
                                                                (<IoStar
                                                                    onClick={() => toggleFave(item)}
                                                                    style={{color: '#0275d8', margin: '0px 0px 3px 0px'}} 
                                                                />) : (<IoStarOutline
                                                                    onClick={() => toggleFave(item)}
                                                                    style={{color: '#0275d8', margin: '0px 0px 3px 0px'}} 
                                                                />)
                                                        }
                                                        </h6>
                                                        <p>{distance[1]}{duration[1]}</p>
                                                        <Button
                                                        href={mapLink}
                                                        variant="primary"
                                                        target="_blank"
                                                        >
                                                            Navigate
                                                        </Button>
                                                        <Button
                                                        style={{marginLeft: "5px",}}
                                                        onClick={handleBatteryButton}
                                                        variant="primary"
                                                        target="_blank">
                                                            Battery
                                                        </Button>
                                                    </div>
                                                </InfoWindow>
                                            )
                                        }
                                    </Marker>
                                )
                            }))
                        }
                    </GoogleMap>                         
                </Row>
            </Container>
      
        </div>
    );
}

export default Map;