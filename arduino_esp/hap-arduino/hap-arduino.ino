/**
 * hap-arduino.ino
 * 
 * Hydroponics Anteater Project (HAP)
 * 
 */
#include <Wire.h>

// Constants to be used
const int TRANSMISSION_BAUD_RATE = 115200;
const int PRINT_BAUD_RATE = 9600;
const int WIRE_ADDRESS = 0x08;
const int PIN_MODE = 13;

const int LIGHT_SENSOR_PIN = A0;
const int MIN_LIGHT_SENSOR_VALUE = 0;
const int MAX_LIGHT_SENSOR_VALUE = 767;

const int WATER_SENSOR_PIN = A3;
const int MIN_WATER_SENSOR_VALUE = 500;
const int MID_WATER_SENSOR_VALUE = 720;
const int MAX_WATER_SENSOR_VALUE = 740;

const int MIN_PERCENT_VALUE = 0;
const int MID_PERCENT_VALUE = 30;
const int MAX_PERCENT_VALUE = 100;

const char METRIC_MODE_LIGHT = 'a';
const char METRIC_MODE_WATER = 'b';

/** 
 * metricMode is a variable that determines
 * what metric the slave will send to the master. 
 *  
 * This variable is changed depending on what char
 * the master sends.
 * 
 *     'a' = light level metric
 *     'b' = water level metric
 *  
 */
char metricMode = METRIC_MODE_LIGHT;

void setup()
{
    Serial.begin(TRANSMISSION_BAUD_RATE); // Begin transmission with master on 115200
    Wire.begin(WIRE_ADDRESS);
    pinMode(PIN_MODE, OUTPUT);
    Wire.onReceive(setMetricMode);
    Wire.onRequest(sendMetricToMaster);
}

void loop()
{
//    int readWaterValue = analogRead(WATER_SENSOR_PIN);
//    byte latestWaterValue = getPercentage(readWaterValue, metricMode); 
//    Serial.println("readwaterval = " + String(readWaterValue));
//    Serial.println("latestWaterValue = " + String(latestWaterValue));
//    delay(1000);
}

/**
 * Sets the variable metricMode to whatever 
 * mode the master requires.
 * 
 */
void setMetricMode() {
    metricMode = Wire.read();
}

/**
 * Sends a metric to the master depending on what the
 * variable metricMode is set to.
 * 
 */
void sendMetricToMaster() {
    if (metricMode == METRIC_MODE_LIGHT) {
        int readLightValue = analogRead(LIGHT_SENSOR_PIN);
        byte latestLightValue = getPercentage(readLightValue, metricMode);
        Wire.write(latestLightValue);  
    }
    else if (metricMode == METRIC_MODE_WATER) {
        int readWaterValue = analogRead(WATER_SENSOR_PIN);
        byte latestWaterValue = getPercentage(readWaterValue, metricMode);
        Wire.write(latestWaterValue);
    }
}

/**
 * Takes an integer metric value and maps it to a percentage
 * value depending on what metric type it is.
 * 
 * @arg metricValue
 *         the value to be mapped
 * @arg metricModeCopy
 *         the metric mode at the time the function is called
 * @return
 *         the percentage value of the metric
 *         
 */
int getPercentage(int metricValue, char metricModeCopy) {
    int resultValue = 0;
    
    if (metricModeCopy == METRIC_MODE_LIGHT) {
        resultValue = map(metricValue,
                          MIN_LIGHT_SENSOR_VALUE, MAX_LIGHT_SENSOR_VALUE,
                          MIN_PERCENT_VALUE, MAX_PERCENT_VALUE);
    } else if (metricModeCopy == METRIC_MODE_WATER) {
        // Adjustments for water sensor sensitivity
        if (metricValue >= MID_WATER_SENSOR_VALUE) {
            resultValue = map(metricValue,
                              MID_WATER_SENSOR_VALUE, MAX_WATER_SENSOR_VALUE,
                              MID_PERCENT_VALUE, MAX_PERCENT_VALUE);
        } else {
            resultValue = map(metricValue,
                              MIN_WATER_SENSOR_VALUE, MID_WATER_SENSOR_VALUE,
                              MIN_PERCENT_VALUE, MID_PERCENT_VALUE);
        }             
    }
    
    resultValue = constrain(resultValue, MIN_PERCENT_VALUE, MAX_PERCENT_VALUE);
    return resultValue;
}
