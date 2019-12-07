# CS147 Project - Anteater Hydroponics

Anteater Hydroponics is the project developed by Lasse Nordahl and Jesse Chong for UC Irvine's [CS147 course](http://catalogue.uci.edu/allcourses/compsci/) (IoT Software and Systems).

This was a project based class where the goal was to develop a robust IoT system that utilized an arduino and various sensors, connection to a cloud platform, and development of an interactive front-end to utilize the data.

When Jesse and I started the project, we wanted to keep the data flow and schema simple, while still going a little further with the front-end to make an interactive application people would want to use. The result was Anteater Hydroponics, a robust health monitoring system for various plants.

## Overview

Below are the project tasks we submitted as completed for our final project report.

### Front-end:
We completed features such as a dashboard showing all data with real-time updating from AWS, a rendered plant representing the monitored plant’s health, a plant selection screen, a settings panels to change the weights and view plant’s health, and date selections for the various metrics recorded. We also included a system-wide “dark mode” that triggers when the current light level recorded becomes noticeably low. This makes the app easier to view at night. 

### Back-end:
A NodeJS back-end was written to handle all of the endpoints we needed for our application. These endpoints accessed the MySQL database instances deployed on AWS DynamoDB and RDS. The endpoints we completed include pulling plant metrics, retrieving metric thresholds, and getting metric averages, maximums, and minimums. There are also additional endpoints for features such as adding a new plant or retrieving the most recent metric value. These endpoints could be used in the future if the app were to expand (see Figure 7 below for the full list of endpoints). Besides that, the back-end is served on the web and also includes the proper HTTP response codes.

### AWS (database):
On AWS, DynamoDB and RDS (mySQL) have been connected successfully with the back-end. These instance connections are properly authenticated within the NodeJS back-end. The table schema is simple, allowing the creation and usage of endpoints to be a pain-free process.

### Arduino Uno/ESP8266 Thing:
The Arduino Uno was connected to the water level and light sensors. The ESP8266 was connected to the humidity and temperature sensor. The Arduino Uno writes water and light metrics to the ESP8266 via the I2C serial protocol. The ESP8266 then combines those metrics with the humidity and temperature metrics it gathers, and combines it into a post request that is made to the NodeJS back-end. The back-end then takes this data and moves it into the AWS DB. By doing this, we were able to successfully push data to the AWS DB via the Arduino/ESP8266.

Machine Learning:
With the extra time we had left, we were able to add in a prototype machine learning feature that curates personalized advice to the user. Currently, we are using a Gaussian Naive Bayes model that is trained on prepared labeled data. Whenever the user views the plant’s health, weighted heuristics are passed as arguments into the model. The model then returns a prediction on what advice to give.

## Screenshots

### Select Plant Screen
![SelectPlant](https://user-images.githubusercontent.com/13127625/70379590-7fdc2c80-18e3-11ea-97b7-d0a308a331ca.png)

We showed a select plant screen that showed all available plants in the database.

### Plant Dashboard
![PlantDashboard](https://user-images.githubusercontent.com/13127625/70379600-92eefc80-18e3-11ea-8891-d19285089f47.png)

Above is the dashboard for the program. It features data panels that shows the data points, thresholds, and averages for the date specified. To the left is a plant rendered with p5js that represents the health of the plant based on user defined heuristics.

### Metric View
![MetricView](https://user-images.githubusercontent.com/13127625/70379610-aac68080-18e3-11ea-8647-1d8e3ffe1a0f.png)

The user can click a data card to open an expanded view, showing the minimum, maximum, and average values for the data type.

### System Wide Darkmode
![Darkmode](https://user-images.githubusercontent.com/13127625/70379632-eeb98580-18e3-11ea-85ad-e6ab90efeda2.png)

A system wide darkmode was developed for the program as well. This darkmode turns on when the most recent light value from the arduino shows a light level low enough to be considered bedtime.

### Select Plant Screen
![SelectPlant](https://user-images.githubusercontent.com/13127625/70379640-fbd67480-18e3-11ea-8cf4-062a42fb8149.png)

A settings panel is available for changing the plant name, thresholds, and weights for how much each data type affects the overall health of the plant.


### Health View & Curated Advice
![HealthViw](https://user-images.githubusercontent.com/13127625/70379621-c2056e00-18e3-11ea-92e7-d2c9d67425d1.png)

A health panel shows the current plant health, plant health of the time period earlier than the defined date range (if you selected to show data for the last week, this plant health would show the health from two weeks ago), and finally a piece of curated advice chosen by our ML model for what is affecting the plant health the most.

## Final Thoughts

Overall, this project was super fun to work on. The challenge of the rendered plant combined with making sure our application is fully linked up to the cloud was hectic, but satisfying to complete in the 6 weeks the project took to develop. In the future we would like to add functionality allowing the user to input their view of the health of the plant based on what they see, which we would use to further train our models to more accurately give plant healthcare advice. Go Hydroponics!

## Work Distribution

### Lasse Nordahl
Ask me about..
* Why I should've paid closer attention to the waves unit in Algebra 2
* Front-end development with React and P5JS
* REST API development using NodeJS
* Why I need to remember to close AWS instances to avoid overage charges
* AWS Cloud Platform with DynamoDB and RDS
  
### Jesse Chong

Ask me about..

