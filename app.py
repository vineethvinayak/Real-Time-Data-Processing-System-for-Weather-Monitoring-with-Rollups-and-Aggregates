from flask import Flask, render_template, jsonify, request
from config import Config
from models import db, WeatherData, DailySummary, Alert
from data_processor import process_weather_data, calculate_daily_summary, check_alert_thresholds
from weather_api import get_forecast_data, get_weather_data
from sqlalchemy import func
import threading
import time
from datetime import datetime, timedelta

app = Flask(__name__)
app.config.from_object(Config)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///weather.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.before_first_request
def create_tables():
    db.create_all()

def update_weather_data():
    with app.app_context():
        while True:
            for city in Config.CITIES:
                process_weather_data(city)
                calculate_daily_summary(city)
            time.sleep(Config.UPDATE_INTERVAL)


@app.route('/')
def index():
    return render_template('index.html', cities=Config.CITIES)

@app.route('/api/weather/<city>')
def get_weather(city):
    try:
        # Get current weather data
        current_data = get_weather_data(city)
        
        if not current_data:
            return jsonify({"error": "City not found"}), 404

        # Get forecast data
        forecast_data = get_forecast_data(city)

        # Process and format the data
        weather_info = {
            "city": city,
            "main": current_data['weather'][0]['main'],
            "temperature": {
                "celsius": current_data['main']['temp'] - 273.15,
                "kelvin": current_data['main']['temp']
            },
            "feels_like": {
                "celsius": current_data['main']['feels_like'] - 273.15,
                "kelvin": current_data['main']['feels_like']
            },
            "temp_max": current_data['main']['temp_max'] - 273.15,
            "temp_min": current_data['main']['temp_min'] - 273.15,
            "humidity": current_data['main']['humidity'],
            "wind_speed": current_data['wind']['speed'],
            "forecast": []
        }

        # Process forecast data
        for forecast in forecast_data['list'][:5]:  # Get next 5 forecasts
            weather_info['forecast'].append({
                "date_time": datetime.fromtimestamp(forecast['dt']).strftime('%Y-%m-%d %H:%M'),
                "temperature": forecast['main']['temp'] - 273.15,
                "condition": forecast['weather'][0]['main']
            })

        return jsonify(weather_info)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/current_weather')
def current_weather():
    data = {}
    for city in Config.CITIES:
        weather = WeatherData.query.filter_by(city=city).order_by(WeatherData.timestamp.desc()).first()
        if weather:
            data[city] = {
                'main': weather.main,
                'temperature': weather.temperature,
                'feels_like': weather.feels_like,
                'humidity': weather.humidity,
                'wind_speed': weather.wind_speed,
                'timestamp': int(weather.timestamp.timestamp())
            }
    return jsonify(data)

@app.route('/api/daily_summary')
def daily_summary():
    data = {}
    for city in Config.CITIES:
        summary = DailySummary.query.filter_by(city=city).order_by(DailySummary.date.desc()).first()
        if summary:
            data[city] = {
                'avg_temp': summary.avg_temp,
                'max_temp': summary.max_temp,
                'min_temp': summary.min_temp,
                'max_humidity': summary.max_humidity,
                'min_humidity': summary.min_humidity,
                'avg_humidity': summary.avg_humidity,
                'avg_wind_speed': summary.avg_wind_speed,
                'dominant_condition': summary.dominant_condition
            }
    return jsonify(data)

@app.route('/api/weather/<city>')
def city_weather(city):
    weather = WeatherData.query.filter_by(city=city).order_by(WeatherData.timestamp.desc()).first()
    if weather:
        return jsonify({
            'main': weather.main,
            'temperature': weather.temperature,
            'feels_like': weather.feels_like,
            'humidity': weather.humidity,
            'wind_speed': weather.wind_speed,
            'timestamp': int(weather.timestamp.timestamp())
        })
    return jsonify({'error': 'City not found'})


@app.route('/api/forecast/<city>')
def forecast(city):
    forecast_data = get_forecast_data(city)
    if forecast_data:
        processed_forecast = []
        for i in range(5):  # 5-day forecast
            date_time = (datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d %H:%M')
            temp = forecast_data['list'][i*8]['main']['temp']  # Get temperature for each day
            condition = forecast_data['list'][i*8]['weather'][0]['description']
            processed_forecast.append({
                'date_time': date_time,
                'temperature': temp,
                'condition': condition
            })
        return jsonify(processed_forecast)
    else:
        return jsonify([])


@app.route('/api/set_alert', methods=['POST'])
def set_alert():
    data = request.json
    city = data.get('city')
    threshold = data.get('temp_threshold')
    if city and threshold:
        alert = Alert(city=city, threshold=float(threshold))
        db.session.add(alert)
        db.session.commit()
        return jsonify({'message': 'Alert set successfully'})
    return jsonify({'error': 'Invalid data'})

@app.route('/api/delete_alert', methods=['POST'])
def delete_alert():
    data = request.json
    city = data.get('city')
    threshold = data.get('threshold')
    if city and threshold:
        Alert.query.filter_by(city=city, threshold=float(threshold)).delete()
        db.session.commit()
        return jsonify({'message': 'Alert deleted successfully'})
    return jsonify({'error': 'Invalid data'})

@app.route('/api/alerts')
def get_alerts():
    alerts = Alert.query.all()
    return jsonify([{'city': alert.city, 'threshold': alert.threshold} for alert in alerts])

@app.route('/api/temperature_trend/<city>')
def get_temperature_trend(city):
    end_date = datetime.now()
    start_date = end_date - timedelta(days=7)  # Get data for the last 7 days
    
    weather_data = WeatherData.query.filter(
        WeatherData.city == city,
        WeatherData.timestamp.between(start_date, end_date)
    ).order_by(WeatherData.timestamp).all()
    
    temperatures = [data.temperature for data in weather_data]
    timestamps = [int(data.timestamp.timestamp()) for data in weather_data]
    
    return jsonify({
        'temperatures': temperatures,
        'timestamps': timestamps
    })


if __name__ == '__main__':
    threading.Thread(target=update_weather_data, daemon=True).start()
    app.run(debug=True)