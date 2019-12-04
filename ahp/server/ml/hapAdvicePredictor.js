// hapAdvicePredictor.js
// HAP Machine Learning Functionality
var hmlc = require('./hapMLContainer.js')
var hmlh = require('./hapMLHelpers.js')
var mlnb = require('ml-naivebayes');

/**
 * Class that curates advice to the user and abstracts the ML.
 *
 * Every time this predictor is constructed, it is trained on the most recent data collected.
 *
 */
class HAPAdvicePredictor {
	constructor() {
		this.hapMLContainer = new hmlc.HAPMLContainer();
		this.learner = this._selectModel();
		// Train the learner now...
		this._trainLearner();
	}

	/**
	 * Selects the ML model to use.
	 * 
	 * Right now, Gaussian Naive-Bayes is the only option.
	 *
	 * @arg modelType
	 *     a string specifying which model to use
	 * @return
	 *     the machine learning model
	 *
	 */
	_selectModel(modelType = "gaussianNB") {
		if (modelType === "gaussianNB") {
			return new mlnb.GaussianNB();
		}
		// Can add other types of models here...
	}

	/**
	 * Use the data to train the chosen learner.
	 *
	 */
	_trainLearner() {
		let hapMLData = this.hapMLContainer.getData();
		let xTrain = hmlh.extractXData(hapMLData);
		let yTrain = hmlh.extractColumn(hapMLData, hapMLData[0].length-1);
		// console.log(xTrain);
		this.learner.train(xTrain, yTrain);
	}

	/**
	 * Predicts what advice to give.
	 *
	 * @arg xValues
	 *     a 2D array with rows of x features [lght, hmdty, watr, temp]
	 * @return
	 *     a list of objects (advice) defined as {"type": ${feature}, "description": ${description}}
	 *
	 */
	predict(xValues) {
		if (xValues.length === 0) {
			return -1;
		}
		let predictions = this.learner.predict(xValues);
		let adviceTypes = this.hapMLContainer.getAdviceTypes();
		let adviceDescs = this.hapMLContainer.getAdviceDescs();
		let adviceList = [];
		for (let i = 0; i < predictions.length; i++) {
			let advice = new Object();
			advice.type = adviceTypes[predictions[i]];
			advice.description = adviceDescs[predictions[i]];
			adviceList.push(advice);
		}
		return adviceList;
	}
}

// Initialize the predictor once to avoid retraining the model.
let advicePredictor = new HAPAdvicePredictor();

module.exports.advicePredictor = advicePredictor;
