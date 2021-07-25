import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { render } from 'react-dom';
import { LoadScript } from '@react-google-maps/api';
import './index.css';
import Map from './Components/Map';
import Header from './Components/Header';
import MarkerContext from './Components/ContextProviders/marker-context';
import Sidebar from './Components/Sidebar';
import { Container, Row, Col } from 'react-bootstrap';
import SelectionContext from './Components/ContextProviders/selection-context';
import DistContext from './Components/ContextProviders/distance-context';
import DuraContext from './Components/ContextProviders/duration-context';
import axios from "axios";


const lib = ['places'];
const key = 'AIzaSyAwqWc8omSLAp2pwMJBLN5vsHrH4ZUYIlI'; // Google Maps API key (replace)
// const baseURL = "https://raw.githubusercontent.com/liangkelei/station-data-01/main/data.json";
const baseURL = `${process.env.REACT_APP_API_URL}/stations`;

const App = () => {
  // parent state to store selected marker
  const [selection, setSelection] = useState("");
  const sel_value = { selection, setSelection };

  // parent state to store travel info
  const [distances, setDistances] = useState([]);
  const [durations, setDurations] = useState([]);
  const dist_value = { distances, setDistances };
  const dura_value = { durations, setDurations };

  // parent state: markers (GET request)
  const [markerArray, setMarkerArray] = useState(null);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
        setMarkerArray(response.data);
        console.log("here");
    });
  }, []);

  if (!markerArray) return null;

  // using Bootstrap Container, Row, and Col to make layout
  // MarkerProvider provides an array of charging station data
  // SelectionContext provider stores the name of the selected marker
  return (
    <div>
      <Container>
        <Row><Header /></Row>
        <MarkerContext.Provider value={markerArray}>
          <SelectionContext.Provider value={sel_value}>
            <DistContext.Provider value={dist_value}>
              <DuraContext.Provider value={dura_value}>
                <Row>
                  <Col><LoadScript googleMapsApiKey={key} libraries={lib}><Map /></LoadScript></Col>
                  <Col><Sidebar /></Col>
                </Row>
              </DuraContext.Provider>
            </DistContext.Provider>
          </SelectionContext.Provider>
        </MarkerContext.Provider>
      </Container>
    </div>
  );
};

render(<App />, document.getElementById('root'));