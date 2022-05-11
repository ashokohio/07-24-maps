import React, { useEffect } from 'react';
import MarkerContext from "./ContextProviders/marker-context";
import SelectionContext from "./ContextProviders/selection-context";
import { Card, Button, Container, Row } from 'react-bootstrap';
import DistContext from './ContextProviders/distance-context';
import DuraContext from './ContextProviders/duration-context';
import FaveContext from './ContextProviders/favorites-context';
import {IoStar, IoStarOutline} from 'react-icons/io5';
import FilterContext from './ContextProviders/filter-context';
import PathContext from './ContextProviders/path-context';
import ElevContext from './ContextProviders/elevation-context';

function Sidebar() {

    // context providers
    let markers = React.useContext(MarkerContext);
    let { selection, setSelection } = React.useContext(SelectionContext);
    let distances = React.useContext(DistContext);
    let durations = React.useContext(DuraContext);
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

    // function to updated selected station
    const handleClick = (marker) => {
        setSelection(marker);
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

        // add or remove favorite in local storage
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
        console.log("samples: " + path.samples);

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
                    <div style={{height: '550px', width: '100%', overflowY: 'scroll'}}>
                        {
                            (distances.distances.length > 0)
                            && (durations.durations.length > 0)
                            && ([...markers]
                                .sort(
                                    function(a, b) {
                                        return parseFloat( distances.distances.find( el => el[0] === a.id )[1], 10 )
                                        - parseFloat( distances.distances.find( el => el[0] === b.id )[1], 10 );
                                    }
                                )
                                .map( item => {

                                if (filter === "option-1" && !favorites.includes(item.id)) {
                                    return;
                                } else if (filter === "option-2" && item.status === "out of order") {
                                    return;
                                }
                                // link directs to Google Maps route planner
                                let mapLink = "https://www.google.com/maps/dir/?api=1&destination="
                                + item.location.lat + ","
                                + item.location.lng;
                                // get distance from distances array
                                let distance = distances.distances.find(el => el[0] === item.id);
                                let duration = durations.durations.find(el => el[0] === item.id);
                                let variant = "success";
                                if (item.status === "in use") variant = "warning";
                                else if (item.status === "out of order") variant = "danger";

                                // if item is the selected station, return the "selected" info card
                                if (selection && item.id === selection.id) {
                                    return (
                                        <Card key={item.id}
                                        style={{width: '95%', margin: '5px'}}
                                        onClick={() => handleClick(item)}
                                        >
                                            <Card.Body
                                            bsPrefix="card-body">
                                                <Card.Title
                                                bsPrefix="card-title">
                                                    {item.name}
                                                    <Button 
                                                        disabled size="sm"
                                                        style={{margin: '0px 10px 2px 10px', padding: '0px 5px 0px 5px'}}
                                                        variant={variant}>{item.status}
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
                                                </Card.Title>
                                                <Card.Subtitle
                                                bsPrefix="card-subtitle">{distance[1]}{duration[1]}</Card.Subtitle>
                                                <Card.Text
                                                bsPrefix="card-text">This is the charging station at {item.name}.</Card.Text>
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
                                            </Card.Body>
                                        </Card>
                                    )
                                } else { // else, return the greyed info card
                                    return (
                                        <Card key={item.id}
                                        bg="secondary"
                                        style={{width: '95%', margin: '5px'}}
                                        onClick={() => handleClick(item)}
                                        >
                                            <Card.Body
                                            bsPrefix="card-body">
                                                <Card.Title
                                                bsPrefix="card-title">
                                                    {item.name}
                                                    <Button
                                                    style={{margin: '0px 10px 2px 10px', padding: '0px 5px 0px 5px'}}
                                                    disabled
                                                    size="sm"
                                                    variant={variant}
                                                    >
                                                        {item.status}
                                                    </Button>
                                                    {
                                                        favorites.includes(item.id) && (
                                                            <IoStar
                                                                style={{color: '#0275d8', margin: '0px 0px 3px 0px'}} 
                                                            />
                                                        ) 
                                                    }
                                                </Card.Title>
                                                <Card.Subtitle
                                                bsPrefix="card-subtitle">{distance[1]}{duration[1]}</Card.Subtitle>
                                                <Card.Text
                                                bsPrefix="card-text">This is the charging station at {item.name}.</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    )
                                }
                            }))
                        }                    
                    </div>
                </Row>
            </Container>
        </div>
    );
}

export default Sidebar;