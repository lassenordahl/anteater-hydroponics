import React from "react";
import './PlantInfo.scss';

import P5Wrapper from 'react-p5-wrapper';
import sketch from 'app/sketches/sketch.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import ThemeContext from 'app/context/ThemeContext';


function PlantInfo(props) {

  function openPanel() {
    alert('clicked?');
    if (props.plant !== null) {
      alert('open');
      props.setSettingsPanelOpen(true)
    } else {
      // Toast
    }
  }

  return (
    <ThemeContext.Consumer>
      {value => (
        <React.Fragment>
          { props.plant != null ?
            <React.Fragment>
              <P5Wrapper sketch={sketch}></P5Wrapper>
              <h2>
                Tomato Plant
              </h2>
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
