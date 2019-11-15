import React, { useEffect, useState } from "react";
import './DataCard.scss';

import { Line } from 'react-chartjs-2';
import axios from 'axios';
import moment from 'moment';
import ThemeContext from 'app/context/ThemeContext';

import {
  Card
} from 'app/containers';

import {
  getChartJSData,
  getDataset,
  getChartJSOptions
} from 'globals/chartjs-helper.js';



function DataCard(props) {
  const [data, setData] = useState(null);
  const [average, setAverage] = useState(null);

  useEffect(() => {
    console.log('data card loaded');
    if (props.plant !== null) {
      getData(props.plant, props.endpoint);
      getAverage(props.plant, props.endpoint);
    }

    let interval = setInterval(function() {
      if (props.plant !== null) {
        getData(props.plant, props.endpoint);
        getAverage(props.plant, props.endpoint);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [props.plant]);

  function getData(plant, endpoint) {
    axios.get(`/api/plant/${plant.plantId}/data/${endpoint}`)
      .then(function (response) {
        console.log(response.data);
        if (response.data.points !== undefined && response.data.timestamps !== undefined) {
          setData(response.data);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  function getAverage(plant, endpoint) {
    axios.get(`/api/plant/${plant.plantId}/data/${endpoint}/average`)
      .then(function (response) {
        console.log(response.data);
        setAverage(response.data.average);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  function processData() {
    if (props.plant === null || data === null || average == null) {
      return {};
    }

    let labels = data.timestamps.map(function(timestamp) {
      return moment(timestamp).format('h:mm:ss a');
    });

    let return_dataset = getDataset(props.color, props.endpoint, data.points, true);
    let average_dataset = getDataset(getAverageColor(average, props.plant.thresholds[props.endpoint]), 'Average', data.points.map(() => average), false);
    let threshold_dataset = getDataset(getAverageColor(average, props.plant.thresholds[props.endpoint]), 'Threshold', data.points.map(() => props.plant.thresholds[props.endpoint]), false, [5, 5]);

    return getChartJSData(labels, [return_dataset, average_dataset, threshold_dataset]);
  }

  function getAverageColor(average, threshold) {
    if (average >= threshold) {
      return {
        r: 70,
        g: 179,
        b: 86
      }
    } else {
      return {
        r: 255,
        g: 54,
        b: 54
      }
    }
  }

  return (
    <ThemeContext.Consumer>
      { value => (
        <Card className="DataCard" title={props.title} style={{'position': 'relative'}} color={props.color}>
          { props.plant != null ?
            <Line data={processData()} options={getChartJSOptions(value.darkmode)}/>
            :
            <div className="invalid-data-error">
              <p>Invalid plant id </p>
            </div>
          }
        </Card>
        )
      }
      
    </ThemeContext.Consumer>
   
  );
}

export default DataCard;
