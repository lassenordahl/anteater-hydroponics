import React, { useState, useEffect } from "react";
import './PlantInfo.scss';

import P5Wrapper from 'react-p5-wrapper';
import sketch from 'app/sketches/sketch.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import ThemeContext from 'app/context/ThemeContext';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';

import {
  getPlantHealthString,
  calculateHealth
} from 'globals/health-helper';

function PlantInfo(props) {

  const { addToast } = useToasts();

  const [tempAverage, setTempAverage] = useState(null);
  const [humidityAverage, setHumidityAverage] = useState(null);
  const [lightAverage, setLightAverage] = useState(null);
  const [waterAverage, setWaterAverage] = useState(null);
  const [plantHealth, setPlantHealth] = useState(null);

  useEffect(() => {
    // console.log('calculating plant health', props.plant);
    setTempAverage(null);
    setLightAverage(null);
    setHumidityAverage(null);
    setWaterAverage(null);

    if (props.plant != null) {
      getAverage(props.plant.plantId, 'temperature', setTempAverage)
      getAverage(props.plant.plantId, 'humidity', setHumidityAverage)
      getAverage(props.plant.plantId, 'light', setLightAverage)
      getAverage(props.plant.plantId, 'water', setWaterAverage)
    }
   }, [props.plant])

  useEffect(() => {
    // console.log('effect calculating health', [tempAverage, humidityAverage, lightAverage, waterAverage]);
    // If we have all of them
    if (tempAverage !== null && lightAverage !== null && humidityAverage !== null && waterAverage !== null) {
      setPlantHealth(calculateHealth(props.plant, waterAverage, tempAverage, humidityAverage, lightAverage));
    }
  }, [tempAverage, humidityAverage, lightAverage, waterAverage])

  function openSettingsPanel() {
    if (props.plant !== null) {
      props.setSettingsPanelOpen(true);
    } else {
      addToast('Invalid plant ID. Cannot open settings.', { appearance: 'error' });
    }
  }

  function openHealthPanel() {
    if (props.plant !== null) {
      props.setHealthPanelOpen(true);
    } else {
      addToast('Invalid plant ID. Cannot open health panel.', { appearance: 'error' });
    }
  }

  function getAverage(plantId, endpoint, setFunction) {
    axios.get(`/api/plant/${plantId}/data/${endpoint}/average`, {
      params: {
        fromDate: props.fromDate,
        toDate: props.toDate
      }
    })
      .then(function (response) {
        setFunction(response.data.average);
      })
      .catch(function(error) {
        addToast('Error getting average for ' + endpoint, { appearance: 'error' });
      });
  }

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }

  return (
    <ThemeContext.Consumer>
      {value => (
        <React.Fragment>
          { props.plant != null && plantHealth !== null ?
            <React.Fragment>
              {/* {plantHealth} */}
              <P5Wrapper sketch={sketch(plantHealth)}></P5Wrapper>
              <h2>
                {capitalize(props.plant.plantType)} Plant
              </h2>
              <div style={{'height': '5px'}}></div>
              {getPlantHealthString(plantHealth)}
            </React.Fragment>
            : 
            <React.Fragment>
              <div className="no-sketch-plant flex-center">
                <p> Plant render is unavailable </p>
              </div>
              <h2>
                Invalid Plant ID
              </h2>
            </React.Fragment>
          }
          <div className="plant-info-icons">
            <FontAwesomeIcon 
              icon={faCog}
              onClick={() => openSettingsPanel()}
              className="settings-button"
            />
            <div/>
            <FontAwesomeIcon 
              icon={faHeartbeat}
              onClick={() => openHealthPanel()}
              className="settings-button"
            />
          </div>  
          <div className={"half-circle " + (value.darkmode ? "half-circle-darkmode" : null)}></div>
        </React.Fragment>
      )}
    </ThemeContext.Consumer>
  );
}

export default PlantInfo;
