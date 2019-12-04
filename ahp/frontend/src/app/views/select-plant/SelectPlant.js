import React from "react";
import './SelectPlant.scss';

import P5Wrapper from 'react-p5-wrapper';
import sketch from 'app/sketches/sketch.js';
import particlesParams from 'globals/select-particles-config.js';
import Particles from 'react-particles-js';

import {
  Card
} from 'app/containers';

function SelectPlant(props) {

  function selectPlant(plantId) { 
    props.history.push('/' + plantId);
  }

  return (
    <React.Fragment>
      <div className="select-particles-container">
        <Particles 
          className="select-particles" 
          style={{
            'width': '100%',
            'height': '100%'
          }} 
          params={particlesParams}
        />
      </div>
      <div className="SelectPlant flex-center">
      
      <h1>Select a Plant</h1>
      <div style={{marginBottom: '16px'}}></div>
      <Card 
        className="select-plant-card" 
        onClick={() => selectPlant(5)}
      >
        <div className="plant-wrapper">
          <P5Wrapper sketch={sketch(98)}></P5Wrapper>
          <h2>Tomato Plant</h2>
          <p>When CS147 gives you tomatoes...</p>
        </div>
      </Card>
    </div>
    </React.Fragment>
  );
}

export default SelectPlant;
