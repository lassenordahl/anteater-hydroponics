import React, { useState } from "react";
import './SettingsView.scss';

import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useToasts } from 'react-toast-notifications';

import { Button, Input } from 'react-rainbow-components';

function SettingsView(props) {

  var newPlant = props.plant
  const [plant, setPlant] = useState(newPlant);
  const { addToast } = useToasts();

  function updatePlant(type, value, key = "") {
    let updatedPlant = plant;
    console.log(plant.plantType, value, key);
    if (type === "type") {
      plant.plantType = value;
    } else if (type === "threshold") {
      plant.thresholds[key] = value;
    } else if (type === "weights") {
      plant.weights[key] = value;
    }
    console.log(plant.plantType);
    setPlant({...plant, updatedPlant});
  }

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }

  function postPlant(plant) {
    axios.post('/api/plant/' + plant.plantId,
      plant
    )
      .then(function(response) {
        console.log(response);
        addToast('Saved Successfully', { appearance: 'success' });
      })
      .catch(function(error) {
        addToast('Unable to update plant', { appearance: 'error' });
      });
  }

  return (
    <div className="SettingsView">
      <h2>
        Plant Settings
      </h2>
        <Input
          label="Plant Type"
          placeholder="Plant Type"
          value={plant.plantType}
          onChange={(e) => updatePlant('type', e.target.value)}
        />
      <h2>
        Threshold Settings
      </h2>
      <div className="group-four-inputs">
        { Object.keys(plant.thresholds).map(function(key) {
          return (
            <Input
              label={capitalize(key)}
              value={plant.thresholds[key]}
              type="number"
              onChange={(e) => {updatePlant('threshold', e.target.value, key)}}
            />
          )
        })}
      </div>
      <h2>
        Weights Settings
      </h2>
      <div className="group-four-inputs">
        { Object.keys(plant.weights).map(function(key) {
          return (
            <Input
              label={capitalize(key)}
              value={plant.weights[key]}
              type="number"
              onChange={(e) => {updatePlant('weights', e.target.value, key)}}
            />
          )
        })}
      </div>
      <div className="dialog-buttons">
        <Button
          variant="brand"
          onClick={() => postPlant(plant)}
        >
          <FontAwesomeIcon icon={faSave}/>

          &nbsp; Save
        </Button>
        {/* <Button
          variant="destructive"
        >
          Close
        </Button> */}
      </div>
    </div>
  );
}

export default SettingsView;
