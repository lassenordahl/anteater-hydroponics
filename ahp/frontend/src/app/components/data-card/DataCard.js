import React, { useEffect } from "react";
import './DataCard.scss';

import { Line } from 'react-chartjs-2';

import {
  Card
} from 'app/containers';

const data = {
  labels: ['January', 'February', 'March'],
  datasets: [
    {
      label: 'My First dataset',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};

function DataCard(props) {

  useEffect(() => {
    
  }, []);

  return (
    <Card className="DataCard" title={props.title} style={{'position': 'relative'}}>
      { props.plant != null ?
        <Line data={data}/>
        :
        <div className="invalid-data-error">
          <p>Invalid plant id </p>
        </div>
      }
    </Card>
  );
}

export default DataCard;
