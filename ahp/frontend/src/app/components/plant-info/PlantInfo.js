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
  getLightHealth,
  getTemperatureHealth,
  getHumidityHealth,
  getWaterHealth
} from 'globals/ranges';


function PlantInfo(props) {

  const { addToast } = useToasts();

  const [tempAverage, setTempAverage] = useState(null);
  const [humidityAverage, setHumidityAverage] = useState(null);
  const [lightAverage, setLightAverage] = useState(null);
  const [waterAverage, setWaterAverage] = useState(null);
  const [plantHealth, setPlantHealth] = useState(null);

  useEffect(() => {
    if (props.plant != null) {
      getAverage(props.plant.plantId, 'temperature', setTempAverage)
      getAverage(props.plant.plantId, 'humidity', setHumidityAverage)
      getAverage(props.plant.plantId, 'light', setLightAverage)
      getAverage(props.plant.plantId, 'water', setWaterAverage)
    }
   }, [props.plant])

  useEffect(() => {
    // If we have all of them
    if (tempAverage !== null && lightAverage !== null && humidityAverage !== null && waterAverage !== null) {
      calculateHealth();
    }
  }, [tempAverage, humidityAverage, lightAverage, waterAverage])

  function openPanel() {
    if (props.plant !== null) {
      props.setSettingsPanelOpen(true)
    } else {
      addToast('Invalid plant ID. Cannot open settings.', { appearance: 'error' });
    }
  }

  function getPlantHealthString(plantHealth) {
    if (plantHealth === null) {
      return (
        <p>
          Invalid plant health
        </p>
      );
    }
    if (plantHealth > 75) {
      return (
        <p>
          Your plant health is 
          <span style={{color: 'green'}}> excellent</span>
        </p>
      )
    } else if (plantHealth > 50) {
      return ( 
        <p>
          Your plant health is 
          <span style={{color: 'blue'}}> good</span>
        </p>
      )
    } else if (plantHealth > 25) {
      return (
        <p>
          Your plant
          <span style={{color: 'orange'}}> could be better</span>
        </p>
      )
    } else if (plantHealth >= 0) {
      return (
        <p>
          Your plant is 
          <span style={{color: 'red'}}> lowkey dying</span>
        </p>
      )
    }
  }

  function getAverage(plantId, endpoint, setFunction) {
    axios.get(`/api/plant/${plantId}/data/${endpoint}/average`)
      .then(function (response) {
        setFunction(response.data.average);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  function calculateHealth() {
    let possiblePoints = Object.keys(props.plant.weights).map(function(key) {
      return props.plant.weights[key]
    }).reduce(function(a, b) {
      return a + b;
    }) * 4;

    let currentPoints = Object.keys(props.plant.weights).map(function(key) {
      if (key === 'water') {
        return getWaterHealth(waterAverage) * props.plant.weights[key];
      } else if (key === 'temperature') {
        return getTemperatureHealth(tempAverage) * props.plant.weights[key];
      } else if (key === 'humidity') {
        return getHumidityHealth(humidityAverage) * props.plant.weights[key];
      } else if (key === 'light') {
        return getLightHealth(lightAverage) * props.plant.weights[key];
      }
      return props.plant.weights[key]
    }).reduce(function(a, b) {
      return a + b;
    });

    setPlantHealth((currentPoints / possiblePoints) * 100);
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
              <P5Wrapper sketch={sketch(plantHealth)}></P5Wrapper>
              <h2>
                {capitalize(props.plant.plantType)} Plant
              </h2>
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
              onClick={() => openPanel()}
              className="settings-button"
            />
            <div/>
            <FontAwesomeIcon 
              icon={faHeartbeat}
              onClick={() => openPanel()}
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
