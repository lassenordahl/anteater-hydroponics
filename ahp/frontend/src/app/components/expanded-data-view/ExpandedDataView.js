import React, { useEffect } from "react";
import './ExpandedDataView.scss';

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

  useEffect(() => {
    if (props.plant !== null) {
      getData(props.plant, props.endpoint);
      // getAverage(props.plant, props.endpoint);
    }

    let interval = setInterval(function() {
      if (props.plant !== null) {
        getData(props.plant, props.endpoint);
        // getAverage(props.plant, props.endpoint);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [props.plant, props.endpoint, props.fromDate, props.toDate]);

  function getData(plant, endpoint) {
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

  function processData() {
    if (props.plant === null || data === null) {

    // if (props.plant === null || data === null || average == null) {
      return {};
    }

    let labels = data.timestamps.map(function(timestamp) {
      return moment(timestamp).format('h:mm:ss a');
    });

    let return_dataset = getDataset(props.color, props.endpoint, data.points, true);
    let average_dataset = getDataset(getAverageColor(average, props.plant.thresholds[props.endpoint]), 'Average', data.points.map(() => average), false);
    let threshold_dataset = getDataset(getAverageColor(average, props.plant.thresholds[props.endpoint]), 'Threshold', data.points.map(() => props.plant.thresholds[props.endpoint]), false, [5, 5]);

    return getChartJSData(labels, [return_dataset, threshold_dataset]);

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
    <div className="ExpandedDataView">
      <div className="graph">

      </div>
      <div className="min">
        <NumberFocus subtitle="Minimum">
          42
        </NumberFocus>
      </div>
      <div className="max">
      <NumberFocus subtitle="Maximum">
          69
        </NumberFocus>
      </div>
      <div className="avg">
        <NumberFocus subtitle="Average">
          420
        </NumberFocus>
      </div>
    </div>
  );
}

export default ExpandedDataView;
