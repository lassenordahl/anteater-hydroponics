import React, { useState, useEffect } from "react";
import './HealthView.scss';

import axios from "axios";
import { useToasts } from 'react-toast-notifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faClock, faCalendar } from '@fortawesome/free-solid-svg-icons';

import { Button, Input } from 'react-rainbow-components';

import {
  getPlantHealthString,
  calculateHealth
} from 'globals/health-helper';

function HealthView(props) {

  const { addToast } = useToasts();

  const [tempAverage, setTempAverage] = useState(null);
  const [humidityAverage, setHumidityAverage] = useState(null);
  const [lightAverage, setLightAverage] = useState(null);
  const [waterAverage, setWaterAverage] = useState(null);
  const [plantHealth, setPlantHealth] = useState(null);

  const [prevTempAverage, setPTempAverage] = useState(null);
  const [prevHumidityAverage, setPHumidityAverage] = useState(null);
  const [prevLightAverage, setPLightAverage] = useState(null);
  const [prevWaterAverage, setPWaterAverage] = useState(null);
  const [prevPlantHealth, setPPlantHealth] = useState(null);

  // Again, I'm just copying pasting code from other components, I dont really have time to refactor with
  // other hw to do! I'll likely change this to grab averages in the root of the project and pass the calculations round
  // from there instead of loading in the dialogs
  useEffect(() => {
    if (props.plant != null) {
      getAverage(props.plant.plantId, 'temperature', setTempAverage, props.currentFromDate, props.currentToDate);
      getAverage(props.plant.plantId, 'humidity', setHumidityAverage, props.currentToDate, props.currentToDate);
      getAverage(props.plant.plantId, 'light', setLightAverage, props.currentFromDate, props.currentToDate);
      getAverage(props.plant.plantId, 'water', setWaterAverage, props.currentFromDate, props.currentToDate);
    }
  }, [props.plant])

  useEffect(() => {
    // If we have all of them
    if (tempAverage !== null && lightAverage !== null && humidityAverage !== null && waterAverage !== null) {
      setPlantHealth(calculateHealth(props.plant, waterAverage, tempAverage, humidityAverage, lightAverage));
    }
  }, [tempAverage, humidityAverage, lightAverage, waterAverage]);

  useEffect(() => {
    if (props.plant != null) {
      getAverage(props.plant.plantId, 'temperature', setPTempAverage)
      getAverage(props.plant.plantId, 'humidity', setPHumidityAverage)
      getAverage(props.plant.plantId, 'light', setPLightAverage)
      getAverage(props.plant.plantId, 'water', setPWaterAverage)
    }
  }, [props.plant])

  useEffect(() => {
    // If we have all of them
    if (prevTempAverage !== null && prevLightAverage !== null && prevHumidityAverage !== null && prevWaterAverage !== null) {
      setPlantHealth(calculateHealth(props.plant, prevWaterAverage, prevTempAverage, prevHumidityAverage, prevLightAverage));
    }
  }, [prevTempAverage, prevHumidityAverage, prevLightAverage, prevWaterAverage]);

  useEffect(() => {
    // If we have all of them
    if (tempAverage !== null && lightAverage !== null && humidityAverage !== null && waterAverage !== null) {
      setPlantHealth(calculateHealth(props.plant, waterAverage, tempAverage, humidityAverage, lightAverage));
      // Todo: use these datapoints to train the model...
    }
  }, [tempAverage, humidityAverage, lightAverage, waterAverage]);

  function getAverage(plantId, endpoint, setFunction, fromDate, toDate) {
    axios.get(`/api/plant/${plantId}/data/${endpoint}/average`, {
      params: {
        fromDate: props.currentFromDate,
        toDate: props.currentToDate
      }
    })
      .then(function (response) {
        setFunction(response.data.average);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  return (
    <div className="HealthView">
      <h2>
        <FontAwesomeIcon icon={faClock}/>
        &nbsp; Current Plant Health
      </h2>
      {getPlantHealthString(plantHealth)}
      <h2>
        <FontAwesomeIcon icon={faCalendar}/>
        &nbsp; Plant Health Trends
      </h2>
      
      <div className="dialog-buttons">
        <Button
          variant="destructive"
          onClick={() => props.onRequestClose()}
        >
          <FontAwesomeIcon icon={faTimes}/>
          &nbsp; Close
        </Button>
      </div>
    </div>
  );
}

export default HealthView;
