# Real-Time Data Processing System for Weather Monitoring with Rollups and Aggregates

This project implements a real-time weather monitoring system that collects, processes, and displays weather data with Rollups and Aggregates for multiple cities including the 6 major metro cities of India. It provides users with current weather information, daily summaries, forecasts, and temperature trends utilizing data from the OpenWeatherMap API (https://openweathermap.org/)  ,all accessible through a web interface.


# Features:

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

## Tech Stack:

**Client:** HTML5, CSS, JavaScript

**Server:** Python v3.12, Flask 2.0.1, Sqlite


## Directory Organization:
![Screenshot 2024-10-25 094039](https://github.com/user-attachments/assets/223e28f3-1f86-44c1-88e1-f108f06756c1)

## Installation:

- Clone the repository

```bash
  git clonehttps://github.com/vineethvinayak/Real-Time-Data-Processing-System-for-Weather-Monitoring-with-Rollups-and-Aggregates.git
  cd Real-Time-Data-Processing-System-for-Weather-Monitoring-with-Rollups-and-Aggregates
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

# Security Considerations (BONUS): 
- Input Validation: - Implemented strict input validation for all user inputs, especially for the city search and alert threshold features. 
- API Security: - Implemented rate limiting on my API to prevent abuse and potential DoS attacks. And  use of HTTPS to encrypt data in transit between the client and server. 
- Error Handling: - Implemented proper error handling to avoid exposing sensitive information in  error messages. 
- Sensitive Data Handling: -Avoided storing sensitive information (like API keys) in client-side code.

# Performance Considerations (BONUS):
- Caching: -Implemented caching mechanisms for frequently accessed data, such as current weather 
conditions and daily summaries.
- API Rate Limiting: -Implemented API rate limiting for external API calls to avoid hitting usage limits.

# Conclusion:
In conclusion, the Real-Time Data Processing System for Weather Monitoring has successfully met its 
objectives by delivering a powerful, user-friendly platform for accessing, analyzing, and visualizing weather 
data. Through the integration with OpenWeatherMap API, the system ensures real-time access to current 
weather conditions and multi-day forecasts, addressing the challenge of dynamic data retrieval. The 
implementation of a SQLite database for historical data storage and retrieval allows users to track weather 
patterns over time, providing valuable insights into historical trends. 

The project’s structured, modular design—encompassing API interaction, data processing, database 
management, and web presentation—ensures maintainability and scalability, while performance 
optimizations support efficient processing of increasing data volumes. Security measures, including the use 
of environment variables for sensitive information, enhance reliability and data protection. 

By combining modern web technologies like Flask, SQLAlchemy, and responsive web design, this project 
creates a comprehensive and accessible weather monitoring tool. It sets a solid foundation for future 
enhancements, such as additional data sources or expanded analytics capabilities. Overall, this project is a 
testament to effective real-time data processing and user-centered design, transforming complex weather 
data into an intuitive platform for monitoring and analysis.
