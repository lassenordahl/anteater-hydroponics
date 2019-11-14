var express = require('express');
var uuid = require('node-uuid');
var router = express.Router();
var AWS = require('aws-sdk');
var mysql = require('mysql');
let config = require('./../config');
let connection = mysql.createConnection(config);

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
      res.sendStatus(200);
      res.send(data);
    }
  })
});

router.get('/:plantId', function(req, res, next) {
  if (req.params.plantId === undefined) {
    res.status(400);
    res.send('Invalid query params');
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
    if (err) {
      console.log(err);
      res.sendStatus(400);
      res.send('No plant found at given plantId')
    } else {
      res.sendStatus(200);
      res.send(data);
    }
  })
});

router.post('/:plantId', function(req, res, next) {
  if (req.params.plantId === undefined) {
    res.status(400);
    res.send('PlantId not given');
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
      res.sendStatus(200);
      res.send(parseInt(req.params.plantId));
    }
  })
});

router.post('/:plantId/data', function(req, res, next) {
  if (req.params.plantId === undefined) {
    res.status(500);
    res.send('PlantId not given');
  }

  console.log(uuid.v1().toString())

  var params = {
    TableName: dataTableName,
    Item: {
      'id': uuid.v1().toString(),
      'plantId': parseInt(req.params.plantId),
      'humidity': req.body.humidity,
      'light': req.body.light,
      'water': req.body.water,
      'temperature': req.body.temperature,
      'timestamp': new Date().toISOString()
    }
  }

  var getPlantParams = {
    TableName: tableName,
    Key: {
      'plantId': parseInt(req.params.plantId)
    },
    AttributesToGet: [
      'averages',
      'dataPoints'
    ]
  }

  ddb.put(params, function(err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(400);
      res.send('Unable to post plant');
    } else {

      // Recalculate the running averages for the other table

      ddb.get(getPlantParams, function(err, data) {
        if (err) {
          res.sendStatus(400);
          res.send()
        } else {
          
        }
      })

      res.sendStatus(200);
      res.send(parseInt(req.params.plantId));
    }
  })
});

router.get('/:plantId/data/:thresholdType/average', function(req, res, next) {
  if (req.params.plantId === undefined ||
      req.params.thresholdType === undefined) {
    res.status(400);
    res.send('Invalid query params');
  }

  var params = {
    TableName: dataTableName,
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
    if (err) {
      console.log(err);
      res.sendStatus(500);
      res.send('No plant found at given plantId')
    } else {
      res.sendStatus(200);
      res.send(data);
    }
  })
});


module.exports = router;
