import React, { useState, useEffect } from "react";
import './ExpandedDataView.scss';

import { Line } from 'react-chartjs-2';
import axios from 'axios';
import moment from 'moment';
import ThemeContext from 'app/context/ThemeContext';
import { Spinner } from 'react-rainbow-components';

import { 
  NumberFocus
} from 'app/containers';

import {
  getChartJSData,
  getDataset,
  getChartJSOptions
} from 'globals/chartjs-helper.js';

function ExpandedDataView(props) {
  const [data, setData] = useState(null);
  const [average, setAverage] = useState(null);
  const [minimum, setMinimum] = useState(null);
  const [maximum, setMaximum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.plant !== null) {
      getData(props.plant, props.endpoint);
      getAverage(props.plant, props.endpoint);
      getMinimum(props.plant, props.endpoint);
      getMaximum(props.plant, props.endpoint);
    }

    let interval = setInterval(function() {
      if (props.plant !== null) {
        getData(props.plant, props.endpoint);
        getAverage(props.plant, props.endpoint);
        getMinimum(props.plant, props.endpoint);
        getMaximum(props.plant, props.endpoint);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [props.plant, props.endpoint, props.fromDate, props.toDate]);

  useEffect(() => {
    checkAllLoaded();
  }, [data, maximum, minimum, average]);

  function getData(plant, endpoint) {
    console.log('get data', plant, endpoint);
    axios.get(`/api/plant/${plant.plantId}/data/${endpoint}`, {
      params: {
        fromDate: props.fromDate,
        toDate: props.toDate
      }
    })
      .then(function (response) {
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
        setAverage(response.data.average);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  // I'm running out of time to finish this project with work for other classes so some of this is becoming a little bad
  // Note to prospective employers, I don't usually do this!
  function getMinimum(plant, endpoint) {
    axios.get(`/api/plant/${plant.plantId}/data/${endpoint}/minimum`)
      .then(function (response) {
        setMinimum(response.data.minimum);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  function getMaximum(plant, endpoint) {
    axios.get(`/api/plant/${plant.plantId}/data/${endpoint}/maximum`)
      .then(function (response) {
        setMaximum(response.data.maximum);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  function checkAllLoaded() {
    console.log('check all', data, maximum, minimum, average);
    if (data !== null && maximum !== null && minimum !== null && average !== null) {
      setLoading(false);
    }
  }

  function processData() {
    // if (props.plant === null || data === null) {

    if (props.plant === null || data === null || average == null) {
      return {};
    }

    let labels = data.timestamps.map(function(timestamp) {
      return moment(timestamp).format('h:mm:ss a');
    });

    let return_dataset = getDataset(props.color, props.endpoint, data.points, true);
    let average_dataset = getDataset(getAverageColor(average, props.plant.thresholds[props.endpoint]), 'Average', data.points.map(() => average), false);
    let threshold_dataset = getDataset(getAverageColor(average, props.plant.thresholds[props.endpoint]), 'Threshold', data.points.map(() => props.plant.thresholds[props.endpoint]), false, [5, 5]);

    // return getChartJSData(labels, [return_dataset, threshold_dataset]);

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
      { value => 
          loading ?
          <div className="flex-center" style={{height: '60vh'}}>
            <Spinner></Spinner>
          </div>
          :
          <div className="ExpandedDataView">
            <div className="graph">
              <div>
                <Line data={processData()} options={getChartJSOptions(value.darkmode)}/>
              </div>
            </div>
            <div className="min flex-center">
              <NumberFocus subtitle="Minimum">
                {minimum !== undefined ? minimum : 'No Data'}
              </NumberFocus>
            </div>
            <div className="max flex-center">
            <NumberFocus subtitle="Maximum">
                {maximum !== undefined ? maximum : 'No Data'}
              </NumberFocus>
            </div>
            <div className="avg flex-center">
              <NumberFocus subtitle="Average">
                {average.toFixed(1)}
              </NumberFocus>
            </div>
          </div>
      }
    </ThemeContext.Consumer>
  );
}

export default ExpandedDataView;
