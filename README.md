# Real-Time Data Processing System for Weather Monitoring with Rollups and Aggregates

This project implements a real-time weather monitoring system that collects, processes, and displays weather data with Rollups and Aggregates for multiple cities including the 6 major metro cities of India. It provides users with current weather information, daily summaries, forecasts, and temperature trends utilizing data from the OpenWeatherMap API (https://openweathermap.org/)  ,all accessible through a web interface.


# Features

- Real-time weather data with rollups and aggregates and forecast displayed for any city in the world through the search tab.(BONUS)
- Continuously Updated (every 2 min) current weather conditions for six major cities in India though the Current Weather card.
- Quick access tab for six major cities for Daily weather summaries with aggregated data in the Daily Summary card.
- 5-day weather forecast for selected six major cities.(BONUS)
- Temperature trend visualization for the six major cities for detailed visual display for past weather in the Temperature Trends card.
- Temperature unit conversion (Celsius/Kelvin).
- Weather alert system based on user-defined thresholds for the major cities for the user to set the temperature threshold and the Alert will be seen in the alerts card. 
- Modification of set alerts though current alerts card for the user.(BONUS)
- Custom city weather search functionality.(BONUS)
- Responsive web interface for easy access on various devices.(BONUS)
- Extended support to multiple weather parameters from the API and incorporation into rollups and aggregates.(BONUS)

## Tech Stack

**Client:** HTML5, CSS, JavaScript

**Server:** Python v3.12, Flask 2.0.1, Sqlite


## Directory Organization
## Installation

- Clone the repository

```bash
  git clonehttps://github.com/vineethvinayak/Real-Time-Data-Processing-System-for-Weather-Monitoring-with-Rollups-and-Aggregates.git
  cd weather_monitor_system
```
- Create Virtual Envirnoment and activate it 

```bash
   python -m venv venv
   `venv\Scripts\activate`  # On Linux use `source venv/bin/activate`
```
- Install the required dependencies

```bash
   pip install -r requirements.txt
```
- Add your OpenWeatherMap API key in config.py file

```bash
   OPENWEATHERMAP_API_KEY=your_api_key_here
```
- Initialize the database

```bash
   flask db init
   flask db migrate
   flask db upgrade
```
- Run the application

```bash
   python run.py
```
