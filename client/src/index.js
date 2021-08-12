// import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { render } from 'react-dom';
import { LoadScript } from '@react-google-maps/api';
import 'bootswatch/dist/litera/bootstrap.min.css'
import './index.css';
import Map from './Components/Map';
import Header from './Components/Header';
import MarkerContext from './Components/ContextProviders/marker-context';
import Sidebar from './Components/Sidebar';
import { Container, Row, Col } from 'react-bootstrap';
import SelectionContext from './Components/ContextProviders/selection-context';
import DistContext from './Components/ContextProviders/distance-context';
import DuraContext from './Components/ContextProviders/duration-context';
import FaveContext from './Components/ContextProviders/favorites-context';
import axios from "axios";
import FilterContext from './Components/ContextProviders/filter-context';


const lib = ['places'];
const key = "AIzaSyAwqWc8omSLAp2pwMJBLN5vsHrH4ZUYIlI"; // Google Maps API key
// const baseURL = "https://raw.githubusercontent.com/liangkelei/station-data-01/main/data.json";
const baseURL = `${process.env.REACT_APP_API_URL}/stations`;

const App = () => {
  // parent state to store selected marker
  // const [selection, setSelection] = useState("");
  const [selection, setSelection] = useState(null);
  const sel_value = { selection, setSelection };

  // parent state to store travel info
  const [distances, setDistances] = useState([]);
  const [durations, setDurations] = useState([]);
  const dist_value = { distances, setDistances };
  const dura_value = { durations, setDurations };

  // parent state: markers (GET request)
  const [markerArray, setMarkerArray] = useState(null);

  // parent state: favorites
  const [favorites, setFavorites] = useState([]);
  const fave_value = { favorites, setFavorites };

  // parent state: filter
  const [filter, setFilter] = useState("option-0");
  const filt_value = { filter, setFilter }

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
        setMarkerArray(response.data);
        console.log("here");
    });
  }, []);

  if (!markerArray) return null;

  // using Bootstrap Container, Row, and Col to make layout
  // MarkerProvider provides an array of charging station data
  return (
    <div>
      <Container>
        <Row><Header /></Row>
        <MarkerContext.Provider value={markerArray}>
          <SelectionContext.Provider value={sel_value}>
            <DistContext.Provider value={dist_value}>
              <DuraContext.Provider value={dura_value}>
                <FaveContext.Provider value={fave_value}>
                  <FilterContext.Provider value={filt_value}>
                    <Row>
                      <Col><LoadScript googleMapsApiKey={key} libraries={lib}><Map /></LoadScript></Col>
                      <Col><Sidebar /></Col>
                    </Row>                    
                  </FilterContext.Provider>
                </FaveContext.Provider>
              </DuraContext.Provider>
            </DistContext.Provider>
          </SelectionContext.Provider>
        </MarkerContext.Provider>
      </Container>
    </div>
  );
};

render(<App />, document.getElementById('root'));