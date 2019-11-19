export function getDataset(color, datasetLabel, datasetData, fill, dashed=[]) {
  return {
    label: datasetLabel,
    fill: fill,
    lineTension: 0.1,
    backgroundColor: `rgba(${color.r},${color.g},${color.b},0.4)`,
    borderColor: `rgba(${color.r},${color.g},${color.b},1)`,
    borderCapStyle: 'butt',
    borderDash: dashed,
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor: `rgba(${color.r},${color.g},${color.b},1)`,
    pointBackgroundColor: '#fff',
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: `rgba(${color.r},${color.g},${color.b},1)`,
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    data: datasetData
  };
}

export function getChartJSData(dataLabels, dataDatasets) {
  return {
    labels: dataLabels,
    datasets: dataDatasets
  };
}

export function getChartJSOptions(darkmode) {
  return {
    scales: {
      yAxes: [{
          ticks: {
              beginAtZero:true,
              fontColor: darkmode ? 'white' : 'black'
          },
      }],
      xAxes: [{
            ticks: {
                fontColor: darkmode ? 'white' : 'black'
            },
        }]
    },
    legend: {
      position: 'bottom',
      labels: {
        fontColor: darkmode ? 'white' : 'black'
      }
    }
  }
}