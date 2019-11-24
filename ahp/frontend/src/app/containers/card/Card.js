import React from "react";
import './Card.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faThermometerEmpty, faCloud, faTint } from '@fortawesome/free-solid-svg-icons';
import ThemeContext from 'app/context/ThemeContext';

function getIcon(title) {
  if (title === "Light Sensor") {
    return faLightbulb; 
  } if (title === "Humidity Sensor") {
    return faCloud;
  } if (title === "Water Levels" || title === "Milk Levels") {
    return faTint;
  } if (title === "Temperature Sensor") {
    return faThermometerEmpty;
  }
  return null;
}

function Card(props) {
  return (
    <ThemeContext.Consumer>
      { value => (
        <div 
          className={props.className + " Card box-shadow " + (value.darkmode ? "card-darkmode" : null)} 
          style={props.style}
          onClick={props.onClick}
        >
          <div>
            <div className="card-header">
              <FontAwesomeIcon 
                icon={getIcon(props.title)} 
                style={{color: `rgba(${props.color.r},${props.color.g},${props.color.b},1)`}}
              /> 
              <h3>
                {props.title}
              </h3>
            </div>
            <div className="card-content" style={{'position': 'relative'}}>
              {props.children}
            </div>
          </div>
        </div>
        )
      }
    </ThemeContext.Consumer>
    
  );
}

export default Card;
