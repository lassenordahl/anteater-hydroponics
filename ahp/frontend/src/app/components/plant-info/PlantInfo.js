import React, { useState, useEffect } from "react";
import './PlantInfo.scss';

import P5Wrapper from 'react-p5-wrapper';
import sketch from 'app/sketches/sketch.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import ThemeContext from 'app/context/ThemeContext';
import axios from 'axios';


function PlantInfo(props) {

  const [tempAverage, setTempAverage] = useState(null);
  const [humidityAverage, setHumidityAverage] = useState(null);
  const [lightAverage, setLightAverage] = useState(null);
  const [waterAverage, setWaterAverage] = useState(null);
  const [plantHealth, setPlantHealth] = useState(null);

  useEffect(() => {
    if (props.plant != null) {
      getAverage(props.plant.plantId, tempAverage, setTempAverage)
      getAverage(props.plant.plantId, humidityAverage, setHumidityAverage)
      getAverage(props.plant.plantId, lightAverage, setLightAverage)
      getAverage(props.plant.plantId, waterAverage, setWaterAverage)
    }
   }, [props.plant, tempAverage, humidityAverage, lightAverage, waterAverage])

  function openPanel() {
    alert('clicked?');
    if (props.plant !== null) {
      alert('open');
      props.setSettingsPanelOpen(true)
    } else {
      // Toast
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
        // If we have all of them
        if (tempAverage !== null && lightAverage !== null && humidityAverage !== null && waterAverage !== null) {
          calculateHealth();
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  function calculateHealth() {
    
  }

  return (
    <ThemeContext.Consumer>
      {value => (
        <React.Fragment>
          { props.plant != null ?
            <React.Fragment>
              {/* <P5Wrapper sketch={sketch}></P5Wrapper> */}
              <h2>
                {props.plant.plantType} Plant
              </h2>
              <p>
                {getPlantHealthString(plantHealth)}
              </p>
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
          <FontAwesomeIcon 
            icon={faCog}
            onClick={() => openPanel()}
          ></FontAwesomeIcon>
          <div className={"half-circle " + (value.darkmode ? "half-circle-darkmode" : null)}></div>
        </React.Fragment>
      )}
    </ThemeContext.Consumer>
  );
}

export default PlantInfo;
