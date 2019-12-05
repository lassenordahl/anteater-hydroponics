// hapMLContainer.js
// HAP Machine Learning Functionality
var trainingData = "./dataset/training_data.json";

/**
 * Creates a container of objects we need for HAPAdvicePredictor.
 *
 */
class HAPMLContainer {
	constructor() {
		this.json = this._loadJson();
		this.dataset = this._formatJsonToMatrix();
		this.labels = this._parseLabels();
		this.adviceTypes = this._parseAdviceTypes();
		this.adviceDescs = this._parseAdviceDescs();
	}

    /**
     * Returns the 2D array dataset.
     * 
     * @return
     *     2D array of data
     *
     */
	getData() {
		return this.dataset;
	}

	/**
     * Returns the list of labels.
     * 
     * @return
     *     list of labels
     *
     */
	getLabels() {
		return this.labels;
	}

	/**
	 * Returns the list of advice types.
	 * 
     * @return
     *     list of advice types
     *
     */
	getAdviceTypes() {
		return this.adviceTypes;
	}

	/**
	 * Returns the list of advice descriptions.
	 * 
     * @return
     *     list of advice descriptions
     *
     */
	getAdviceDescs() {
		return this.adviceDescs;
	}

    /**
     * Helper function to load the data in the JSON file.
     * 
     * @return
     *     the JSON data
     *
     */
	_loadJson() {
		return require(trainingData);
	}

	/**
	 * Formats the JSON file into a 2D array.
	 * 
     * @return
     *     a 2D array/matrix of all of the features and labels.
     *
     */
	_formatJsonToMatrix() {
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
     * Extracts labels from json.
	 *
     * The string labels have been assigned their index as a primary key.
     * i.e., the first advice has ID 0, the second advice has ID 1, etc...
     * 
     * @return
     *     list of labels
     *
     */
	_parseLabels() {
		return Object.keys(this.json);
	}

	/**
	 * Extracts advice types from json.
	 *
	 * Each advice has a type. Index into the array to view th advice's type.
	 * i.e., [0] = advice type of first advice, [2] = advice type of third advice, etc...
	 * 
     * @return
     *     list of advice types
     *
     */
	 _parseAdviceTypes() {
	 	let adviceTypes = [];
	 	for (let i = 0; i < this.labels.length; i++) {
	 		adviceTypes.push(this.json[this.labels[i]].type);
	 	}
	 	return adviceTypes;
	 }

	/**
	 * Extracts advice descriptions from json.
	 *
	 * Each advice has a description. Index into the array to view th advice's description.
	 * i.e., [0] = advice desc. of first advice, etc...
	 *
     * @return
     *     list of advice descriptions
     *
     */
	 _parseAdviceDescs() {
	 	let adviceDescs = [];
	 	for (let i = 0; i < this.labels.length; i++) {
	 		adviceDescs.push(this.json[this.labels[i]].description);
	 	}
	 	return adviceDescs;
	 }
}

module.exports.HAPMLContainer = HAPMLContainer;
