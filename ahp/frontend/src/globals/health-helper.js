import React from 'react';

import {
  getLightHealth,
  getTemperatureHealth,
  getHumidityHealth,
  getWaterHealth
} from 'globals/ranges';

export function getPlantHealthString(plantHealth) {
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
};

export function calculateHealth(plant, waterAverage, tempAverage, humidityAverage, lightAverage) {
  let possiblePoints = Object.keys(plant.weights).map(function(key) {
    return plant.weights[key]
  }).reduce(function(a, b) {
    return a + b;
  }) * 4;

  let currentPoints = Object.keys(plant.weights).map(function(key) {
    if (key === 'water') {
      return getWaterHealth(waterAverage) * plant.weights[key];
    } else if (key === 'temperature') {
      return getTemperatureHealth(tempAverage) * plant.weights[key];
    } else if (key === 'humidity') {
      return getHumidityHealth(humidityAverage) * plant.weights[key];
    } else if (key === 'light') {
      return getLightHealth(lightAverage) * plant.weights[key];
    }
    return plant.weights[key]
  }).reduce(function(a, b) {
    return a + b;
  });

  return (currentPoints / possiblePoints) * 100;
}