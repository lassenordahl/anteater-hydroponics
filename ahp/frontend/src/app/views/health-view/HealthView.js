import React, { useState, useEffect } from "react";
import './HealthView.scss';

import axios from "axios";
import moment from 'moment';
import { useToasts } from 'react-toast-notifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faClock, faCalendar } from '@fortawesome/free-solid-svg-icons';

import { Button, Input } from 'react-rainbow-components';

import {
  getPlantHealthString,
  getPrevPlantHealthString,
  calculateHealth
} from 'globals/health-helper';

import {
  NumberFocus
} from 'app/containers';

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
  const [prevPlantHealth, setPrevPlantHealth] = useState(null);

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
      setPlantHealth(calculateHealth(props.plant, waterAverage, tempAverage, humidityAverage, lightAverage, props.fromDate, props.toDate));
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
    if (tempAverage !== null && lightAverage !== null && humidityAverage !== null && waterAverage !== null) {
      setPlantHealth(calculateHealth(props.plant, waterAverage, tempAverage, humidityAverage, lightAverage, props.currentToDate, props.currentFromDate));
    }
  }, [tempAverage, humidityAverage, lightAverage, waterAverage]);

  useEffect(() => {
    // If we have all of them
    if (prevTempAverage !== null && prevLightAverage !== null && prevHumidityAverage !== null && prevWaterAverage !== null) {
      console.log(moment.duration(moment(props.prevToDate).diff(moment(props.prevFromDate))).asDays());
      let previousDate = moment(props.prevFromDate).subtract(moment.duration(moment(props.prevToDate).diff(moment(props.prevFromDate))).asDays(), 'd');
      console.log(previousDate.format("YYYY-MM-DD HH:mm:ss"));
      setPrevPlantHealth(calculateHealth(props.plant, prevWaterAverage, prevTempAverage, prevHumidityAverage, prevLightAverage, previousDate, props.prevToDate));
    }
  }, [prevTempAverage, prevHumidityAverage, prevLightAverage, prevWaterAverage]);

  function getAverage(plantId, endpoint, setFunction, fromDate, toDate) {
    axios.get(`/api/plant/${plantId}/data/${endpoint}/average`, {
      params: {
        fromDate: fromDate,
        toDate: toDate
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
      <NumberFocus
        subtitle={getPlantHealthString(plantHealth)}
      >
        {plantHealth !== null ? plantHealth.toFixed(1) : null}%
      </NumberFocus>
      
      <h2>
        <FontAwesomeIcon icon={faCalendar}/>
        &nbsp; Plant Health Trends
      </h2>

      <NumberFocus
        subtitle={getPrevPlantHealthString(plantHealth)}
      >
        {prevPlantHealth !== null ? prevPlantHealth.toFixed(1) : null}%
      </NumberFocus>
      
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
