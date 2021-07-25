import React from 'react';
import MarkerContext from "./ContextProviders/marker-context";
import SelectionContext from "./ContextProviders/selection-context";
import { Card, Button, Container } from 'react-bootstrap';
import DistContext from './ContextProviders/distance-context';
import DuraContext from './ContextProviders/duration-context';

function Sidebar() {

    // context providers
    let markers = React.useContext(MarkerContext);
    let { selection, setSelection } = React.useContext(SelectionContext);
    let { distances, setDistances } = React.useContext(DistContext);
    let { durations, setDurations } = React.useContext(DuraContext);

    // function to updated selected station
    const handleClick = (markerId) => {
        setSelection(markerId);
    }

    return (
        <div>
            <Container>
                {
                    (distances.length > 0)
                    && (durations.length > 0)
                    && ([...markers]
                        .sort(
                            function(a, b) {
                                return parseFloat( distances.find( el => el[0] === a.id )[1], 10 )
                                - parseFloat( distances.find( el => el[0] === b.id )[1], 10 );
                            }
                        )
                        .map( item => {
                        // link directs to Google Maps route planner
                        let mapLink = "https://www.google.com/maps/dir/?api=1&destination="
                        + item.location.lat + ","
                        + item.location.lng;
                        // get distance from distances array
                        let distance = distances.find(el => el[0] === item.id);
                        let duration = durations.find(el => el[0] === item.id);
                        let variant = "success";
                        if (item.status === "in use") variant = "warning";
                        else if (item.status === "out of order") variant = "danger";

                        // if item is the selected station, return the "selected" info card
                        if (item.name === selection) {
                            return (
                                <Card key={item.id}
                                border="dark"
                                style={{width: '25rem', margin: '5px'}}
                                onClick={() => handleClick(item.name)}
                                >
                                    <Card.Body
                                    bsPrefix="card-body">
                                        <Card.Title
                                        bsPrefix="card-title">{item.name} <Button disabled size="sm" style={{margin: '2px 2px 2px 10px', padding: '0px 5px 0px 5px'}} variant={variant}>{item.status}</Button></Card.Title>
                                        <Card.Subtitle
                                        bsPrefix="card-subtitle">{distance[1]}, {duration[1]} away</Card.Subtitle>
                                        <Card.Text
                                        bsPrefix="card-text">This is the charging station at {item.name}.</Card.Text>
                                        <Button
                                        href={mapLink}
                                        variant="primary"
                                        target="_blank"
                                        >
                                            Navigate
                                        </Button>
                                    </Card.Body>
                                </Card>
                            )
                        } else { // else, return the greyed info card
                            return (
                                <Card key={item.id}
                                border="dark"
                                bg="secondary"
                                style={{width: '25rem', margin: '5px'}}
                                onClick={() => handleClick(item.name)}
                                >
                                    <Card.Body
                                    bsPrefix="card-body">
                                        <Card.Title
                                        bsPrefix="card-title">{item.name} <Button
                                        style={{margin: '2px 2px 2px 10px', padding: '0px 5px 0px 5px'}}
                                        disabled
                                        size="sm"
                                        variant={variant}
                                        >
                                            {item.status}
                                        </Button></Card.Title>
                                        <Card.Subtitle
                                        bsPrefix="card-subtitle">{distance[1]}, {duration[1]} away</Card.Subtitle>
                                        <Card.Text
                                        bsPrefix="card-text">This is the charging station at {item.name}.</Card.Text>
                                    </Card.Body>
                                </Card>
                            )
                        }
                    }))
                }
                
            </Container>
        </div>
    );
}

export default Sidebar;