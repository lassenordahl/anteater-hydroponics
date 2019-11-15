var express = require('express');
var uuid = require('node-uuid');
var AWS = require('aws-sdk');
var sql = require('./../db');

var router = express.Router();


AWS.config.getCredentials(function(err) {
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
      'thresholds'
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
      'thresholds'
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
  if (req.params.plantId === undefined) {
    res.status(400);
    res.send('PlantId not given');
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
      'averages': {
        'humidity': 0,
        'water': 0,
        'light': 0,
        'temperature': 0
      },
      'dataPoints': 0,
      'dateCreated': new Date().toISOString()
    }
  }

  ddb.put(params, function(err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(400);
      res.send('Unable to post plant');
    } else {
      res.send(parseInt(req.params.plantId));
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

  console.log(query);

  sql.query(query, function(err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(400);
      res.end();
    } else {
      if (data.length === 0) {
        res.send({
          id: parseInt(req.params.plantId),
          average: 0
        });
      } else {
        res.send(data[0]);
      }
    }
  });
});

router.get('/:plantId/data/:thresholdType', function(req, res, next) {
  if (req.params.plantId === undefined ||
      req.params.thresholdType === undefined) {
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
          average: 0
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


module.exports = router;
