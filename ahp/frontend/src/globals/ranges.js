
// 1 - Could be better
// 2 - Lowkey Dying
// 3 - Good
// 4 - Excellent


// 40
export function getLightHealth(threshold, average) {
  if (threshold <= average) {
    return 4;
  } else if (threshold - 10 <= average) {
    return 3;
  } else if (threshold - 20 <= average) {
    return 2;
  } else {
    return 1;
  }
}

// 50
export function getWaterHealth(threshold, average) {
  if (threshold <= average) {
    return 4;
  } else if (threshold - 10 <= average) {
    return 3;
  } else if (threshold - 20 <= average) {
    return 2;
  } else {
    return 1;
  }
}

// 70
export function getTemperatureHealth(threshold, average) {
  if (threshold <= average && average <= threshold + 10) {
    return 4;
  } else if (threshold - 10 <= average && average <= threshold + 20) {
    return 3;
  } else if (threshold - 20 <= average && average <= threshold + 30) {
    return 2;
  } else {
    return 1;
  }
}

// 60
export function getHumidityHealth(threshold, average) {
  if (threshold <= average && average <= threshold + 5) {
    return 4;
  } else if (threshold - 5 <= average && average <= threshold + 10) {
    return 3;
  } else if (threshold - 15 <= average && average <= threshold + 20) {
    return 2;
  } else {
    return 1;
  }
}