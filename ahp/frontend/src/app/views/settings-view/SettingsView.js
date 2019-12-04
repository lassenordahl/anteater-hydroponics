import React, { useState } from "react";
import './SettingsView.scss';

import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faSortNumericDown, faLeaf, faFlag } from '@fortawesome/free-solid-svg-icons';
import { useToasts } from 'react-toast-notifications';

import { Button, Input } from 'react-rainbow-components';

function SettingsView(props) {

  var newPlant = props.plant
  const [plant, setPlant] = useState(newPlant);
  const { addToast } = useToasts();

  function updatePlant(type, value, key = "") {
    let updatedPlant = plant;
    if (type === "type") {
      plant.plantType = value;
    } else if (type === "threshold") {
      plant.thresholds[key] = value;
    } else if (type === "weights") {
      plant.weights[key] = value;
    }
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
        addToast('Saved Successfully', { appearance: 'success' });
      })
      .catch(function(error) {
        addToast('Unable to update plant', { appearance: 'error' });
      });
  }

  return (
    <div className="SettingsView">
      <h2>
        <FontAwesomeIcon icon={faLeaf}/>
        &nbsp; Plant Settings
      </h2>
        <Input
          label="Plant Type"
          placeholder="Plant Type"
          value={plant.plantType}
          onChange={(e) => updatePlant('type', e.target.value)}
        />
      <h2>
        <FontAwesomeIcon icon={faFlag}/>
        &nbsp; Threshold Settings
      </h2>
      <div className="group-four-inputs">
        { Object.keys(plant.thresholds).map(function(key, index) {
          return (
            <Input
              key={index}
              label={capitalize(key)}
              value={plant.thresholds[key].toString()}
              type="number"
              onChange={(e) => {updatePlant('threshold', e.target.value, key)}}
            />
          )
        })}
      </div>
      <h2>
        <FontAwesomeIcon icon={faSortNumericDown}/>
        &nbsp; Weights Settings
      </h2>
      <div className="group-four-inputs">
        { Object.keys(plant.weights).map(function(key, index) {
          return (
            <Input
              key={index}
              label={capitalize(key)}
              value={plant.weights[key].toString()}
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

export default SettingsView;
