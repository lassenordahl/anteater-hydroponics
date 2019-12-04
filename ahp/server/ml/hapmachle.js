// hapmachle.js
// HAP Machine Learning Functionality
var trainingData = "./dataset/training_data.json";

/**
 * Creates a container of objects we need for the learner.
 *
 */
class hapMLContainer {
	constructor() {
		this.json = this._getJson();
		this.dataset = this._getFormattedData();
		this.labels = this._getLabels();
	}

    /**
     * Returns the 2D array dataset.
     * 
     */
	getData() {
		return this.dataset;
	}

	/*
     * Returns the list of labels.
     * 
     */
	getLabels() {
		return this.labels;
	}

    /*
     * Helper function to load the data in the JSON file.
     *
     */
	_getJson() {
		return require(trainingData);
	}

	/**
	 * Formats the JSON file into a 2D-array.
	 *
	 */ 
	_getFormattedData() {
		let features = Object.keys(this.json);
		let dataMatrix = [];
		for (let i = 0; i < features.length; i++) {
			// console.log(features[i]);
			let states = this.json[features[i]].states;
			
			for (let j = 0; j < states.length; j++) {
				let dataMatrixRow = [];
				//console.log(states[j]);
				dataMatrixRow.push(states[j].light);
				dataMatrixRow.push(states[j].humidity);
				dataMatrixRow.push(states[j].water);
				dataMatrixRow.push(states[j].temperature);
				dataMatrixRow.push(i);
				dataMatrix.push(dataMatrixRow);
			}		
		}
		return dataMatrix;
	}

    /**
     * The string labels have been assigned their index as a primary key.
     * i.e., the first advice has ID 0, the second advice has ID 1, etc...
     *
     */
	_getLabels() {
		return Object.keys(this.json);
	}

}

/**
 * Extracts a column from the given 2D array
 * and returns the column as a 1D array.
 *
 */
function extractColumn(twoDArray, specCol) {
	if (twoDArray.length == 0) {
		return;
	}
	let extrCol = [];
	for (let i = 0; i < twoDArray.length; i++) {
		extrCol.push(twoDArray[i][specCol]);
	}
	return extrCol;
}

/**
 * Extracts and returns the first n-1 columns
 * of the given 2D array as a 2D array.
 *
 * n-1 means all the features x
 *
 */
function extractXData(twoDArray) {
	if (twoDArray.length == 0) {
		return;
	}
	let xData = [];
	let xColsLen = twoDArray[0].length - 1;
	for (let i = 0; i < twoDArray.length; i++) {
		let xDataRow = [];
		for (let j = 0; j < xColsLen; j++) {
			xDataRow.push(twoDArray[i][j]);
		}
		xData.push(xDataRow);
	}
	return xData;
}

module.exports.hapMLContainer = hapMLContainer;
module.exports.extractColumn = extractColumn;
module.exports.extractXData = extractXData;