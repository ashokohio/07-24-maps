// import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState, useEffect } from "react";
import { GoogleMap, InfoWindow, Marker, DistanceMatrixService, Autocomplete } from "@react-google-maps/api";
import MarkerContext from "./ContextProviders/marker-context";
import SelectionContext from "./ContextProviders/selection-context";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import DistContext from "./ContextProviders/distance-context";
import DuraContext from './ContextProviders/duration-context';
import { Row, Col } from "react-bootstrap";
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import FaveContext from "./ContextProviders/favorites-context";
import {IoStar, IoStarOutline} from 'react-icons/io5';
import FilterContext from "./ContextProviders/filter-context";


function Map() {
    
    // context providers
    let markers = React.useContext(MarkerContext);
    let { selection, setSelection } = React.useContext(SelectionContext);
    let { distances, setDistances } = React.useContext(DistContext);
    let { durations, setDurations } = React.useContext(DuraContext);
    let { favorites, setFavorites } = React.useContext(FaveContext);
    let { filter, setFilter } = React.useContext(FilterContext);

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

    // function to load onto current position
    const success = position => {
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
    const handleToggleOpen = (markerId) => {
        setSelection(markerId);
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


    // function handle toggle favorite station
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
        localStorage.setItem("favorites", JSON.stringify(favorites));

        let storage = localStorage.getItem('favItem' + (marker.id) || '0');
        if (storage == null) {
            localStorage.setItem(('favItem' + (marker.id)), JSON.stringify(marker));
        } else {
            localStorage.removeItem('favItem' + (marker.id));
        }
    }

    return (
        <div>
            <Row>
                <Col><ButtonGroup toggle>
                <ToggleButton
                variant="outline-primary"
                type="checkbox"
                checked={checked}
                value="1"
                id="1"
                onChange={(e) => setChecked(e.currentTarget.checked)}
                >
                    Custom origin
                </ToggleButton></ButtonGroup></Col>

                <Col>{
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
                                width: `450px`,
                                height: `34px`,
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

            <ToggleButtonGroup
            name="radioMode"
            style={{margin:"10px 0px 10px 0px"}}>
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
                        onChange={(e) => setModeValue(e.currentTarget.value)}
                        >
                            {mode.name}
                        </ToggleButton>
                    ))
                }
            </ToggleButtonGroup>
            
            <GoogleMap
            mapContainerStyle={{ height: "600px", width: "100%" }}
            zoom={13}
            center={currentPosition}
            >
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
                            scale: 1.0
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
                            <Marker key={item.id}
                            position={item.location}
                            icon={{
                                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                                fillColor: fillColor,
                                fillOpacity: 1,
                                strokeWeight: 3,
                                strokeColor: strokeColor,
                                scale: 1.0
                            }}
                            onClick={() => handleToggleOpen(item.name)}
                            >
                                {
                                    // "if statement" that opens an InfoWindow if this is the selected station
                                    selection === item.name && 
                                    (
                                        <InfoWindow onCloseClick={() => handleToggleOpen("")}>
                                            <div>
                                                <h6>{item.name} <Button
                                                disabled size="sm"
                                                style={{margin: '1px 8px 2px 8px', padding: '0px 5px 0px 5px'}}
                                                variant={variant}
                                                >
                                                    {item.status}
                                                </Button>
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
                                            </div>
                                        </InfoWindow>
                                    )
                                }
                            </Marker>
                        )
                    }))
                }
            </GoogleMap>           
        </div>
    );
}

export default Map;