var express = require('express');
var uuid = require('node-uuid');
var AWS = require('aws-sdk');
var sql = require('./../db');

var router = express.Router(); // should be line 6



// delete me
var hml = require('./../ml/hapmachle')
var mlnb = require('ml-naivebayes');

let hapMLContainer = new hml.hapMLContainer();
let learner = new mlnb.GaussianNB();
let hapMLData = hapMLContainer.getData();
let xTrain = hml.extractXData(hapMLData);
let yTrain = hml.extractColumn(hapMLData, hapMLData[0].length-1);
console.log(xTrain);
learner.train(xTrain, yTrain);
let yTest = [[20, 61, 81, 70], [11, 76, 60, 75]];
console.log(learner.predict(yTest));

// delete me


AWS.config.getCredentials(function(err) { // should be line 9
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
    console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
  }
});
AWS.config.update({region: 'us-west-1'});
var ddb = new AWS.DynamoDB.DocumentClient();

const tableName = 'plant';
const dataTableName = 'plantData';

/* GET home page. */
router.get('/', function(req, res, next) {
  var params = {
    TableName: tableName,
    AttributesToGet: [
      'plantId',
      'plantType',
      'thresholds',
      'weights'
    ]
  }

  ddb.scan(params, function(err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(400);
      res.send([])
    } else {
      res.send(data);
    }
  })
});

router.get('/:plantId', function(req, res, next) {
  if (req.params.plantId === undefined) {
    res.status(400);
    res.send('Invalid query params');
    return;
  }

  var params = {
    TableName: tableName,
    Key: {
      'plantId': parseInt(req.params.plantId)
    },
    AttributesToGet: [
      'plantId',
      'plantType',
      'thresholds',
      'weights'
    ]
  }

  ddb.get(params, function(err, data) {
    if (err || data.Item === undefined) {
      console.log(err);
      res.sendStatus(400);
      return;
    } else {
      res.send(data.Item);
    }
  })
});

router.post('/:plantId', function(req, res, next) {
  console.log('trying to post plant', req.body);
  if (req.params.plantId === undefined) {
    res.sendStatus(400);
    return;
  }

  var params = {
    TableName: tableName,
    Item: {
      'plantId': parseInt(req.params.plantId),
      'plantType': req.body.plantType,
      'thresholds': {
        'humidity': req.body.thresholds.humidity,
        'water': req.body.thresholds.water,
        'light': req.body.thresholds.light,
        'temperature': req.body.thresholds.temperature
      },
      'weights': {
        'humidity': req.body.weights.humidity,
        'water': req.body.weights.water,
        'light': req.body.weights.light,
        'temperature': req.body.weights.temperature
      }
    }
  }

  ddb.put(params, function(err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(400);
      res.send('Unable to post plant');
    } else {
      res.sendStatus(200);
    }
  })
});

router.post('/:plantId/data', function(req, res, next) {
  if (req.params.plantId === undefined
    || req.query.humidity === undefined
    || req.query.light === undefined
    || req.query.water === undefined
    || req.query.temperature === undefined) {
    res.status(500);
    res.send('Proper parameters not given');
  }

  let values = [[
    parseInt(req.params.plantId),
    req.query.humidity,
    req.query.light,
    req.query.water,
    req.query.temperature
  ]];

  let query = "INSERT INTO plantData (plantId, humidity, light, water, temperature) VALUES ?";
  sql.query(query, [values], function(err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(400);
    } else {
      res.sendStatus(200);
    }
  });
});

router.get('/:plantId/data/:thresholdType/:aggregateType', function(req, res, next) {
  if (req.params.plantId === undefined ||
      req.params.thresholdType === undefined) {
    res.sendStatus(400);
    res.end();
    return;
    // res.send('Invalid query params');
  }

  let id = req.params.plantId;
  let type = req.params.thresholdType;
  let aggregateType = req.params.aggregateType;
  let queryAggregation = '';
  let fromDate = req.query.fromDate;
  let toDate = req.query.toDate;
  let dateQuery = '';

  if (fromDate !== undefined) {
    dateQuery += 'AND timestamp >= \'' + fromDate + '\' ';
  }
  if (toDate !== undefined) {
    dateQuery += 'AND timestamp <= \'' + toDate + '\'';
  }

  if (aggregateType === 'average') {
    queryAggregation = 'AVG';
  } else if (aggregateType === 'maximum') {
    queryAggregation = 'MAX';
  } else if (aggregateType === 'minimum') {
    queryAggregation = 'MIN';
  }  else if (aggregateType === 'count') {
    queryAggregation = 'COUNT';
  } else {
    res.sendStatus(400);
    res.end();
    return;
    // res.send('Invalid aggregation params');
  }

  let query = 
  `SELECT plantId, ${queryAggregation}(${type}) as ${aggregateType} FROM plantData\
  WHERE plantId=${id} ${dateQuery} GROUP BY plantId`;

  sql.query(query, function(err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(400);
      res.end();
    } else {
      if (data.length === 0) {
        var response = {
          id: parseInt(req.params.plantId),
        };
        response[aggregateType] = 0
        res.send(response);
      } else {
        res.send(data[0]);
      }
    }
  });
});

router.get('/:plantId/data/:thresholdType', function(req, res, next) {
  if (req.params.plantId === undefined ||
      req.params.thresholdType === undefined ||
      req.params.thresholdType === 'p5.min.js') {
    res.status(400);
    res.send('Invalid query params');
    return;
  }

  let id = req.params.plantId;
  let type = req.params.thresholdType;
  let fromDate = req.query.fromDate;
  let toDate = req.query.toDate;
  let dateQuery = '';

  if (fromDate !== undefined) {
    dateQuery += 'AND timestamp >= \'' + fromDate + '\' ';
  }
  if (toDate !== undefined) {
    dateQuery += 'AND timestamp <= \'' + toDate + '\'';
  }

  let query = 
  `SELECT id, ${type}, timestamp FROM plantData\
  WHERE plantId=${id} ${dateQuery}`;

  sql.query(query, function(err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      if (data.length === 0) {
        res.send({
          id: parseInt(req.params.plantId),
          points: [],
          timestamps: [],
        });
      } else {
        let return_data = data.map(function(point) { return point[type] });
        let return_timestamps = data.map(function(point) { return point.timestamp });
        res.send({
          points: return_data,
          timestamps: return_timestamps
        });
      }
    }
  });
});

/**
 * Endpoint to get the most recent value within a time range.
 * 
 * If no time range is specified, defaults to grabbing the most recent value.
 *
 */
router.get('/:plantId/data/:thresholdType/value/recent', function(req, res, next) {
  if (req.params.plantId === undefined ||
      req.params.thresholdType === undefined) {
    res.sendStatus(400);
    res.end();
    return;
  }

  let id = req.params.plantId;
  let type = req.params.thresholdType;
  let fromDate = req.query.fromDate;
  let toDate = req.query.toDate;
  let dateQuery = '';
  let mostRecentVal = "mostRecentVal";
  let mostRecentTime = "mostRecentTime";

  if (fromDate !== undefined) {
    dateQuery += 'AND timestamp >= \'' + fromDate + '\' ';
  }
  if (toDate !== undefined) {
    dateQuery += 'AND timestamp <= \'' + toDate + '\'';
  }

  let query =
  `SELECT plantId, ${type} as ${mostRecentVal} , timestamp as ${mostRecentTime}\
  FROM plantData\
  WHERE plantId=${id} ${dateQuery}\
  ORDER BY timestamp\
  DESC LIMIT 1`;

  sql.query(query, function(err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(400);
      res.end();
    } else {
      if (data.length === 0) {
        var response = {
          id: parseInt(req.params.plantId),
        };
        response[mostRecentVal] = 0;
        response[mostRecentTime] = 0;
        res.send(response);
      } else {
        res.send(data[0]); // todo: check if this works....
      }
    }
  });
});

module.exports = router;
