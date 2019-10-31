import React from "react";
import './Card.scss';
function Card(props) {

  return (
    <div className={props.className + " Card box-shadow"} style={props.style}>
      <div>
        <h3>
          {props.title}
        </h3>
        {props.children}
      </div>
    </div>
  );
}

export default Card;
