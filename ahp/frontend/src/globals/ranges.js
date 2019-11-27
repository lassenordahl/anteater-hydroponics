
// 1 - Could be better
// 2 - Lowkey Dying
// 3 - Good
// 4 - Excellent


export function getLightHealth(average) {
  if (40 <= average) {
    return 4;
  } else if (30 <= average) {
    return 3;
  } else if (20 <= average) {
    return 2;
  } else {
    return 1;
  }
}

export function getWaterHealth(average) {
  if (50 <= average) {
    return 4;
  } else if (40 <= average) {
    return 3;
  } else if (30 <= average) {
    return 2;
  } else {
    return 1;
  }
}

export function getTemperatureHealth(average) {
  if (70 <= average && average <= 80) {
    return 4;
  } else if (60 <= average && average <= 90) {
    return 3;
  } else if (50 <= average && average <= 100) {
    return 2;
  } else {
    return 1;
  }
}

export function getHumidityHealth(average) {
  if (60 <= average && average <= 65) {
    return 4;
  } else if (55 <= average && average <= 70) {
    return 3;
  } else if (45 <= average && average <= 80) {
    return 2;
  } else {
    return 1;
  }
}