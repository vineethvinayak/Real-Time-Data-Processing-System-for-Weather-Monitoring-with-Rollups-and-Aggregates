from models import db, WeatherData, DailySummary
from weather_api import get_weather_data
from sqlalchemy import func
from datetime import datetime, date

def process_weather_data(city):
    data = get_weather_data(city)
    if data:
        weather = WeatherData(
            city=city,
            main=data['weather'][0]['main'],
            temperature=data['main']['temp'],
            feels_like=data['main']['feels_like'],
            humidity=data['main']['humidity'],
            wind_speed=data['wind']['speed'],
            timestamp=datetime.fromtimestamp(data['dt'])
        )
        db.session.add(weather)
        db.session.commit()

def calculate_daily_summary(city):
    today = date.today()
    daily_data = WeatherData.query.filter(
        WeatherData.city == city,
        func.date(WeatherData.timestamp) == today
    ).all()

    if daily_data:
        temps = [d.temperature for d in daily_data]
        humidities = [d.humidity for d in daily_data]
        wind_speeds = [d.wind_speed for d in daily_data]
        conditions = [d.main for d in daily_data]

        summary = DailySummary(
            city=city,
            date=today,
            avg_temp=sum(temps) / len(temps),
            max_temp=max(temps),
            min_temp=min(temps),
            max_humidity=max(humidities),
            min_humidity=min(humidities),
            avg_humidity=sum(humidities) / len(humidities),
            avg_wind_speed=sum(wind_speeds) / len(wind_speeds),
            dominant_condition=max(set(conditions), key=conditions.count)
        )
        db.session.add(summary)
        db.session.commit()

def check_alert_thresholds(city, temp_threshold):
    latest_data = WeatherData.query.filter_by(city=city).order_by(WeatherData.timestamp.desc()).limit(2).all()
    if len(latest_data) == 2:
        if all(data.temperature > temp_threshold for data in latest_data):
            return f"Alert: Temperature in {city} has exceeded {temp_threshold}°C for two consecutive updates!"
    return None