import React from "react";
import './Card.scss';

function Card(props) {
  return (
    <div className="Card box-shadow" style={props.style}>
      <div>
        this is a card
      </div>
    </div>
  );
}

export default Card;
