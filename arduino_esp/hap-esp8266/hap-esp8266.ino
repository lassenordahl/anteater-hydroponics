/**
 * hap-esp8266.ino
 * 
 * Hydroponics Anteater Project (HAP)
 * 
 */

// Libraries to be included
#include <Wire.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <SparkFun_RHT03.h>

// Constants to be used
const String WIFI_USER = "UCInet Mobile Access";
const String WIFI_PASS = "";
const String SEND_METRICS_ENDPOINT = "http://a7a3bd1c.ngrok.io/api/plant/5/data?";

const int TRANSMISSION_BAUD_RATE = 115200;
const int PRINT_BAUD_RATE = 9600;
const int WIRE_ADDRESS = 0x08;
const int SERVER_PORT = 80;
const int DELAY_TIME = 1000;
const int SUCCESS_CODE = 1;
const int ERROR_CODE = -1;

const String CONTENT_TYPE = "Content-Type";
const String TEXT_PLAIN = "text/plain";
const String EMPTY_HTTP_BODY = "";

const int ESP_SDA_PIN = 2;
const int ESP_SCL_PIN = 14;
const int RHT_SENSOR_PIN = 4;
const char METRIC_MODE_LIGHT = 'a';
const char METRIC_MODE_WATER = 'b';

// Objects to be initialized
WiFiServer server(SERVER_PORT); 
RHT03 rht;

void setup () {
    // Setup for Arduino Uno + ESP8266 connection
    Wire.begin(ESP_SDA_PIN, ESP_SCL_PIN);
    
    // Begin transmission with slave on 115200
    Serial.begin(TRANSMISSION_BAUD_RATE);
    Wire.beginTransmission(WIRE_ADDRESS);
    
    // Print results to 9600
    Serial.begin(PRINT_BAUD_RATE);
    WiFi.begin(WIFI_USER, WIFI_PASS);
    rht.begin(RHT_SENSOR_PIN);
    server.begin();
    
    while (WiFi.status() != WL_CONNECTED) {
        Serial.println("Connecting...");
        delay(DELAY_TIME);
    }
}

void loop() {
    if (WiFi.status() == WL_CONNECTED) { 
        sendMetricsToWebApp();
    }
    else {
        printWifiErrorMessage();
    }
}

/**
 * Gets all of the sensor data and then sends the metrics to the web app.
 * 
 * If we can't get all of the data, then send nothing and wait.
 * 
 */
void sendMetricsToWebApp() {
    int rhtResult[2];
    int latestHumidityValue;
    int latestTemperatureValue;
    int latestLightValue;
    int latestWaterValue;
    
    // (1) Get humidity and temperature data...
    int rhtResultCode = updateRHTSensor(rhtResult);
    if (rhtResultCode == ERROR_CODE) {
        Serial.println("RHT sensor update failed...\n");
        delay(DELAY_TIME);   
        return;
    }
    latestHumidityValue = rhtResult[0];
    latestTemperatureValue = rhtResult[1];
    Serial.println("Humidity = " + String(latestHumidityValue) + " %");
    Serial.println("Temp (F) = " + String(latestTemperatureValue) + " degrees");
    
    // (2) Get light level data...
    latestLightValue = getLightLevelValue();
    if (latestLightValue == ERROR_CODE) {
        Serial.println("Light level sensor update failed...\n");
        delay(DELAY_TIME);   
        return;
    }
    Serial.println("Lght val = " + String(latestLightValue) + " %");
    
    // (3) Get water level data...
    latestWaterValue = getWaterLevelValue();
    if (latestWaterValue == ERROR_CODE) {
        Serial.println("Water level sensor update failed...\n");
        delay(DELAY_TIME);   
        return;
    }
    Serial.println("Watr val = " + String(latestWaterValue) + " %");
    
    // (4) Finally, send the post request
    String postRequest = buildPostRequest(latestHumidityValue, latestLightValue, latestTemperatureValue, latestWaterValue);
    Serial.println("Post req = " + postRequest);
    sendPostRequest(postRequest);
    Serial.println("Post request sent successfully\n");
    delay(DELAY_TIME);
    return;
}

void printWifiErrorMessage() {
    Serial.println("Error in wifi connection... please wait\n");
    delay(DELAY_TIME);
}

/**
 * Builds a post request based on the sensor values passed into the function.
 *
 * @arg humidityValue
 *         the humidity value
 * @arg lightValue
 *         the light value        
 * @arg temperatureValue
 *         the temperature value   
 * @arg waterValue
 *         the water value
 * @return
 *         the post request
 *         
 */
String buildPostRequest(int humidityValue, int lightValue, int temperatureValue, int waterValue) {
    String postRequest = SEND_METRICS_ENDPOINT;
    postRequest += "humidity=" + String(humidityValue) + "&";
    postRequest += "light=" + String(lightValue) + "&";
    postRequest += "temperature=" + String(temperatureValue) + "&";
    postRequest += "water=" + String(waterValue);
    return postRequest;
}

/**
 * Initializes an HTTP client, sends a post request, then closes the client.
 * 
 * @arg postRequest
 *         the post request
 *         
 */
void sendPostRequest(String postRequest) {
    HTTPClient http;
    http.begin(postRequest);
    http.addHeader(CONTENT_TYPE, TEXT_PLAIN);
    int httpCode = http.POST(EMPTY_HTTP_BODY);
    String payload = http.getString();
    Serial.println("Received HTTP code = " + String(httpCode));
    Serial.println("Received payload = " + payload);
    http.end();
}

/**
 * Updates the RHT sensor and passes the humidity and temperature values
 * to the argument int array.
 * 
 * Returns 1 on success; returns -1 on failure.
 * 
 * @arg rhtResult
 *         the int array of RHT sensor values
 * @return
 *         the result code
 *         
 */
int updateRHTSensor(int* rhtResult) {
    int rhtUpdate = rht.update();
    
    if (rhtUpdate == SUCCESS_CODE) {
        rhtResult[0] = rht.humidity();
        rhtResult[1] = rht.tempF();
        return SUCCESS_CODE;
    }
    else {
        return ERROR_CODE;
    }
}

/**
 * Reads the light level metric from the slave.
 * 
 * Returns the light value on success; returns -1 on failure.
 * 
 * @return
 *         the result code
 *         
 */
int getLightLevelValue() {
    specifiyMetricToSlave(METRIC_MODE_LIGHT);
    Wire.requestFrom(WIRE_ADDRESS, 1);
    
    if (Wire.available()) {
        int latestLightValue = Wire.read();
        return latestLightValue;
    } else {
        return ERROR_CODE;
    }
}

/**
 * Reads the water level metric from the slave.
 * 
 * Returns the water value on success; returns -1 on failure.
 * 
 * @return
 *         the result code
 *         
 */
int getWaterLevelValue() {
    specifiyMetricToSlave(METRIC_MODE_WATER);
    Wire.requestFrom(WIRE_ADDRESS, 1);
    
    if (Wire.available()) {
        int latestWaterValue = Wire.read();
        return latestWaterValue;
    } else {
        return ERROR_CODE;
    }
}

/**
 * Specifies which metric the slave must transmit.
 *     'a' = light level metric
 *     'b' = water level metric
 *     
 * @arg metricMode
 *         the metric to be transmitted
 *         
 */
void specifiyMetricToSlave(char metricMode) {
    Wire.beginTransmission(WIRE_ADDRESS);
    Wire.write(metricMode);
    Wire.endTransmission(true);
}

//void makeGetRequest() {
//    HTTPClient http;
//    http.begin("http://jsonplaceholder.typicode.com/users/1");
//    int httpCode = http.GET();
//    Serial.println("Received HTTP code = " + String(httpCode));
//    if (httpCode > 0) {
//        String payload = http.getString();
//        Serial.println("Received payload = " + payload);
//    }
//    http.end();
//}
