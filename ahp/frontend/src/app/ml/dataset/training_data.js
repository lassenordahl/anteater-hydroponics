export default {
    "LightAdvice1": {
        "type": "light",
        "description": "Increase lighting by moving your plant under a lamp.",
        "states": [
            {
                "light": 20,
                "humidity": 61,
                "water": 81,
                "temperature": 77
            },
            {
                "light": 25,
                "humidity": 54,
                "water": 84,
                "temperature": 75
            },
            {
                "light": 22,
                "humidity": 49,
                "water": 97,
                "temperature": 73
            }
        ]
    },
    "LightAdvice2": {
        "type": "light",
        "description": "Increase lighting by moving your plant closer to the outdoors.",
        "states": [
            {
                "light": 11,
                "humidity": 78,
                "water": 84,
                "temperature": 67
            },
            {
                "light": 14,
                "humidity": 76,
                "water": 81,
                "temperature": 68
            },
            {
                "light": 13,
                "humidity": 85,
                "water": 96,
                "temperature": 65
            }
        ]
    },
    "LightAdvice3": {
        "type": "light",
        "description": "Increase lighting by getting your plant access to direct sunlight.",
        "states": [
            {
                "light": 9,
                "humidity": 75,
                "water": 85,
                "temperature": 59
            },
            {
                "light": 4,
                "humidity": 73,
                "water": 89,
                "temperature": 58
            },
            {
                "light": 2,
                "humidity":78,
                "water": 95,
                "temperature": 61
            }
        ]
    },
    "LightAdvice4": {
        "type": "light",
        "description": "Decrease lighting by keeping your plant under the shade.",
        "states": [
            {
                "light": 100,
                "humidity": 52,
                "water": 86,
                "temperature": 83
            },
            {
                "light": 90,
                "humidity": 55,
                "water": 80,
                "temperature": 85
            },
            {
                "light": 95,
                "humidity":50,
                "water": 96,
                "temperature": 90
            }
        ]
    },
    "LightAdvice5": {
        "type": "light",
        "description": "Decrease lighting by turning off lights nearby to your plant.",
        "states": [
            {
                "light": 80,
                "humidity": 59,
                "water": 80,
                "temperature": 75
            },
            {
                "light": 89,
                "humidity": 52,
                "water": 86,
                "temperature": 73
            },
            {
                "light": 86,
                "humidity": 51,
                "water": 95,
                "temperature": 78
            }
        ]
    },
    "HumidityAdvice1": {
        "type": "humidity",
        "description": "Decrease air humidity by placing your plant near an open window.",
        "states": [
            {
                "light": 51,
                "humidity": 78,
                "water": 91,
                "temperature": 72
            },
            {
                "light": 43,
                "humidity": 85,
                "water": 87,
                "temperature": 70
            },
            {
                "light": 56,
                "humidity": 80,
                "water": 96,
                "temperature": 71
            }
        ]
    },
    "HumidityAdvice2": {
        "type": "humidity",
        "description": "Decrease air humidity by placing a fan near your plant.",
        "states": [
            {
                "light": 59,
                "humidity": 89,
                "water": 90,
                "temperature": 75
            },
            {
                "light": 67,
                "humidity": 95,
                "water": 86,
                "temperature": 73
            },
            {
                "light": 45,
                "humidity": 97,
                "water": 97,
                "temperature": 79
            }
        ]
    },
    "HumidityAdvice3": {
        "type": "humidity",
        "description": "Increase air humidity by spraying your plant with warm water.",
        "states": [
            {
                "light": 50,
                "humidity": 23,
                "water": 87,
                "temperature": 64
            },
            {
                "light": 68,
                "humidity": 31,
                "water": 79,
                "temperature": 69
            },
            {
                "light": 64,
                "humidity": 29,
                "water": 91,
                "temperature": 65
            }
        ]
    },
    "HumidityAdvice4": {
        "type": "humidity",
        "description": "Increase air humidity by placing an air humidifier near your plant.",
        "states": [
            {
                "light": 50,
                "humidity": 13,
                "water": 87,
                "temperature": 62
            },
            {
                "light": 73,
                "humidity": 24,
                "water": 82,
                "temperature": 69
            },
            {
                "light": 67,
                "humidity": 19,
                "water": 92,
                "temperature": 63
            }
        ]
    },
    "HumidityAdvice5": {
        "type": "humidity",
        "description": "Increase air humidity by keeping your plant next to other plants.",
        "states": [
            {
                "light": 54,
                "humidity": 13,
                "water": 89,
                "temperature": 81
            },
            {
                "light": 73,
                "humidity": 15,
                "water": 72,
                "temperature": 71
            },
            {
                "light": 67,
                "humidity": 17,
                "water": 91,
                "temperature": 78
            }
        ]
    },
    "WaterAdvice1": {
        "type": "water",
        "description": "Increase the water level by pouring some more water in.",
        "states": [
            {
                "light": 54,
                "humidity": 13,
                "water": 10,
                "temperature": 80
            },
            {
                "light": 73,
                "humidity": 15,
                "water": 15,
                "temperature": 72
            },
            {
                "light": 40,
                "humidity": 17,
                "water": 0,
                "temperature": 74
            }
        ]
    },
    "WaterAdvice2": {
        "type": "water",
        "description": "Maintain the water level by keeping it out of direct sunlight.",
        "states": [
            {
                "light": 80,
                "humidity": 34,
                "water": 100,
                "temperature": 88
            },
            {
                "light": 92,
                "humidity": 55,
                "water": 90,
                "temperature": 89
            },
            {
                "light": 75,
                "humidity": 17,
                "water": 95,
                "temperature": 77
            }
        ]
    },
    "TemperatureAdvice1": {
        "type": "temperature",
        "description": "Decrease the temperature by using a hydroponics water chiller.",
        "states": [
            {
                "light": 85,
                "humidity": 34,
                "water": 78,
                "temperature": 95
            },
            {
                "light": 34,
                "humidity": 53,
                "water": 90,
                "temperature": 105
            },
            {
                "light": 65,
                "humidity": 64,
                "water": 99,
                "temperature": 120
            }
        ]
    },
    "TemperatureAdvice2": {
        "type": "temperature",
        "description": "Increase the temperature by using a hydroponics water heater.",
        "states": [
            {
                "light": 32,
                "humidity": 74,
                "water": 80,
                "temperature": 33
            },
            {
                "light": 11,
                "humidity": 55,
                "water": 99,
                "temperature": 51
            },
            {
                "light": 0,
                "humidity": 68,
                "water": 76,
                "temperature": 25
            }
        ]
    }
}