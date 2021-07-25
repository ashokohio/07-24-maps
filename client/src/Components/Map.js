import 'bootstrap/dist/css/bootstrap.min.css'
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

function Map() {
    
    // context providers
    let markers = React.useContext(MarkerContext);
    let { selection, setSelection } = React.useContext(SelectionContext);
    let { distances, setDistances } = React.useContext(DistContext);
    let { durations, setDurations } = React.useContext(DuraContext);

    // state: user's current location
    const [currentPosition, setCurrentPosition] = useState({});

    // state: user's custom input
    const [customPosition, setCustomPosition] = useState({});
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

    // function to handle mode change
    /*const handleToggleMode = (value) => {
        setModeValue(value);
    } */

    // function to handle enter location toggle
    /*const handleToggleLocation = (e) => {
        setChecked(e.currentTarget.checked);
    } */

    // functions to handle autocomplete search
    const onLoad = (autocomplete) => {
        console.log("autocomplete: ", autocomplete);
        setAutocomplete(autocomplete);
    }

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
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
            mapContainerStyle={{ height: "700px", width: "100%" }}
            zoom={13}
            center={currentPosition}
            >
                {currentPosition.lat && (<DistanceMatrixService
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
                        el => [ i++, (el.status === 'OK' ? el.distance.text : "No " + modeValue + " available") ]
                    ));
                    i = 1;
                    setDurations(response.rows[0].elements.map(
                        el => [ i++, (el.status === 'OK' ? el.duration.text : "") ]
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
                            <Marker key={item.name}
                            position={item.location}
                            icon={{
                                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                                fillColor: fillColor,
                                fillOpacity: 1,
                                strokeWeight: 3,
                                strokeColor: strokeColor,
                                scale: 2.05
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
                                                style={{margin: '2px 2px 2px 10px', padding: '0px 5px 0px 5px'}}
                                                variant={variant}
                                                >
                                                    {item.status}
                                                </Button></h6>
                                                <p>{distance[1]}, {duration[1]} away</p>
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