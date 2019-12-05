// hapMLHelpers.js
// HAP Machine Learning Functionality

/**
 * Extracts a column from the given 2D array
 * and returns the column as a 1D array.
 *
 * @arg twoDArray
 *     matrix to process
 * @arg specCol
 *     specified column to extract
 * @return
 *     the extracted column
 *
 */
export function extractColumn(twoDArray, specCol) {
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
 * @arg twoDArray
 *     matrix to process
 * @return
 *     the X data
 *
 */
export function extractXData(twoDArray) {
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

