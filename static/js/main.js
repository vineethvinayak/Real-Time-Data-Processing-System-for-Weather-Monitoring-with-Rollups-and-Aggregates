let temperatureUnit = 'celsius';
let alertsList = [];


function updateCurrentWeather() {
    fetch('/api/current_weather')
        .then(response => response.json())
        .then(data => {
            for (const [city, weather] of Object.entries(data)) {
                const container = document.getElementById(`current-weather-${city.toLowerCase()}`);
                if (container) {
                    const temp = convertTemperature(weather.temperature);
                    const feelsLike = convertTemperature(weather.feels_like);
                    container.innerHTML = `
                        <h3>${city}</h3>
                        <p>Condition: ${weather.main}</p>
                        <p>Temperature: ${temp.toFixed(1)}°${temperatureUnit === 'celsius' ? 'C' : 'K'}</p>
                        <p>Feels like: ${feelsLike.toFixed(1)}°${temperatureUnit === 'celsius' ? 'C' : 'K'}</p>
                        <p>Humidity: ${weather.humidity}%</p>
                        <p>Wind speed: ${weather.wind_speed} m/s</p>
                        <p>Last updated: ${new Date(weather.timestamp * 1000).toLocaleString()}</p>
                    `;
                }
            }
        });
}

function updateDailySummaries() {
    fetch('/api/daily_summary')
        .then(response => response.json())
        .then(data => {
            for (const [city, summary] of Object.entries(data)) {
                const container = document.getElementById(`daily-summary-${city.toLowerCase()}`);
                if (container) {
                    const avgTemp = convertTemperature(summary.avg_temp);
                    const maxTemp = convertTemperature(summary.max_temp);
                    const minTemp = convertTemperature(summary.min_temp);
                    container.innerHTML = `
                        <h3>${city}</h3>
                        <p>Average Temperature: ${avgTemp.toFixed(1)}°${temperatureUnit === 'celsius' ? 'C' : 'K'}</p>
                        <p>Max Temperature: ${maxTemp.toFixed(1)}°${temperatureUnit === 'celsius' ? 'C' : 'K'}</p>
                        <p>Min Temperature: ${minTemp.toFixed(1)}°${temperatureUnit === 'celsius' ? 'C' : 'K'}</p>
                        <p>Max Humidity: ${summary.max_humidity}%</p>
                        <p>Min Humidity: ${summary.min_humidity}%</p>
                        <p>Average Humidity: ${summary.avg_humidity.toFixed(1)}%</p>
                        <p>Average Wind Speed: ${summary.avg_wind_speed.toFixed(1)} m/s</p>
                        <p>Dominant Condition: ${summary.dominant_condition}</p>
                    `;
                }
            }
        });
}

function convertTemperature(celsius) {
    return temperatureUnit === 'celsius' ? celsius : celsius + 273.15;
}

function changeTemperatureUnit() {
    temperatureUnit = document.getElementById('temperature-unit').value;
    updateCurrentWeather();
    updateDailySummaries();
}

function searchCity() {
    const city = document.getElementById('search-input').value;
    fetch(`/api/weather/${city}`)
        .then(response => response.json())
        .then(data => displaySearchResults(data))
        .catch(error => {
            console.error('Error:', error);
            const resultContainer = document.getElementById('search-result');
            resultContainer.innerHTML = `<p class="error">An error occurred while fetching the weather data. Please try again.</p>`;
        });
}

function displaySearchResults(data) {
    const resultContainer = document.getElementById('search-result');
    if (data.error) {
        resultContainer.innerHTML = `<p class="error">${data.error}</p>`;
    } else {
        let forecastHtml = data.forecast.map(f => `
            <tr>
                <td>${f.date_time}</td>
                <td>${((-f.temperature.toFixed(1)) - 221.5).toFixed(2)}°C</td>
                <td>${f.condition}</td>
            </tr>
        `).join('');

        resultContainer.innerHTML = `
            <h3>${data.city}</h3>
            <div class="weather-details">
                <p><strong>Main Condition:</strong> ${data.main}</p>
                <p><strong>Temperature:</strong> ${data.temperature.kelvin.toFixed(2)} °C / ${(-(-data.temperature.kelvin - 273.15).toFixed(2))} K</p>
                <p><strong>Feels Like:</strong> ${data.feels_like.kelvin.toFixed(2)} °C / ${(-(-data.feels_like.kelvin - 273.15).toFixed(2))} K</p>
                <p><strong>Max Temperature:</strong> ${((-data.temp_max) - 214).toFixed(2)}°C</p>
                <p><strong>Min Temperature:</strong> ${((-data.temp_min) - 224).toFixed(2)}°C</p>
                <p><strong>Average Temperature:</strong> ${((((-data.temp_min) - 220) + ((-data.temp_max)) - 224) / 2).toFixed(2)}°C</p>
                <p><strong>Average Humidity:</strong> ${data.humidity}%</p>
                <p><strong>Average Wind Speed:</strong> ${data.wind_speed} m/s</p>
            </div>
            <h4>Forecast</h4>
            <table class="forecast-table">
                <thead>
                    <tr>
                        <th>Date & Time</th>
                        <th>Forecast Temperature</th>
                        <th>Forecast Condition</th>
                    </tr>
                </thead>
                <tbody>
                    ${forecastHtml}
                </tbody>
            </table>
        `;
    }
}


function updateForecast() {
    const city = document.getElementById('forecast-city').value;
    fetch(`/api/forecast/${city}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('weather-forecast');
            container.innerHTML = '';
            data.forEach(day => {
                const temp = convertTemperature(day.temperature);
                container.innerHTML += `
                    <div>
                        <h4>${new Date(day.date_time).toLocaleString()}</h4>
                        <p>Temperature: ${temp.toFixed(1)}°${temperatureUnit === 'celsius' ? 'C' : 'K'}</p>
                        <p>Condition: ${day.condition}</p>
                    </div>
                `;
            });
        });
}

function updateCurrentWeather() {
    fetch('/api/current_weather')
        .then(response => response.json())
        .then(data => {
            for (const [city, weather] of Object.entries(data)) {
                const container = document.getElementById(`current-weather-${city.toLowerCase()}`);
                if (container) {
                    const temp = convertTemperature(weather.temperature);
                    const feelsLike = convertTemperature(weather.feels_like);
                    container.innerHTML = `
                        <h3>${city}</h3>
                        <p>Condition: ${weather.main}</p>
                        <p>Temperature: ${temp.toFixed(1)}°${temperatureUnit === 'celsius' ? 'C' : 'K'}</p>
                        <p>Feels like: ${feelsLike.toFixed(1)}°${temperatureUnit === 'celsius' ? 'C' : 'K'}</p>
                        <p>Humidity: ${weather.humidity}%</p>
                        <p>Wind speed: ${weather.wind_speed} m/s</p>
                        <p>Last updated: ${new Date(weather.timestamp * 1000).toLocaleString()}</p>
                    `;
                }
            }
            checkAlerts(data);
        });
}

function setAlert() {
    const city = document.getElementById('alert-city').value;
    const threshold = parseFloat(document.getElementById('alert-threshold').value);
    if (city && !isNaN(threshold)) {
        const alertId = Date.now(); // Use timestamp as a unique ID
        alertsList.push({ id: alertId, city, threshold });
        updateAlertsList();
        document.getElementById('alert-city').value = '';
        document.getElementById('alert-threshold').value = '';
    }
}

function updateAlertsList() {
    const alertsListElement = document.getElementById('alerts-list');
    alertsListElement.innerHTML = '';
    alertsList.forEach(alert => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${alert.city}: ${alert.threshold}°C 
            <button onclick="deleteAlert(${alert.id})">Delete</button>
        `;
        alertsListElement.appendChild(li);
    });
}

function deleteAlert(id) {
    alertsList = alertsList.filter(alert => alert.id !== id);
    updateAlertsList();
}

function checkAlerts(weatherData) {
    alertsList.forEach(alert => {
        if (weatherData[alert.city] && weatherData[alert.city].temperature > alert.threshold) {
            console.log(`ALERT: Temperature in ${alert.city} (${weatherData[alert.city].temperature}°C) has exceeded the threshold of ${alert.threshold}°C!`);
            document.getElementById('alerts').innerHTML += `<p>ALERT: Temperature in ${alert.city} (${weatherData[alert.city].temperature}°C) has exceeded the threshold of ${alert.threshold}°C!</p>`;
        }
    });
}


function updateTemperatureTrend() {
    const city = document.getElementById('trend-city').value;
    const container = document.getElementById('temperature-trend-container');
    container.innerHTML = '<p>Loading temperature trend data...</p>';

    fetch(`/api/temperature_trend/${city}`)
        .then(response => response.json())
        .then(data => {
            console.log('Received data:', data);
            if (!data.temperatures || !data.timestamps || data.temperatures.length === 0) {
                throw new Error('No data available');
            }

            container.innerHTML = '<canvas id="temperature-trend-chart"></canvas>';
            const ctx = document.getElementById('temperature-trend-chart').getContext('2d');
            
            // Destroy existing chart if it exists
            if (window.temperatureTrendChart) {
                window.temperatureTrendChart.destroy();
            }

            const chartData = {
                labels: data.timestamps.map(timestamp => new Date(timestamp * 1000)),
                datasets: [{
                    label: `Temperature (°${temperatureUnit === 'celsius' ? 'C' : 'K'})`,
                    data: data.temperatures.map((temp, index) => ({
                        x: new Date(data.timestamps[index] * 1000),
                        y: convertTemperature(temp)
                    })),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    pointRadius: 2,
                    pointHoverRadius: 5
                }]
            };

            const chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Temperature Trend - ${city}`,
                        font: {
                            size: 18
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            displayFormats: {
                                day: 'MMM d'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: `Temperature (°${temperatureUnit === 'celsius' ? 'C' : 'K'})`
                        }
                    }
                }
            };

            window.temperatureTrendChart = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: chartOptions
            });

            console.log('Chart created:', window.temperatureTrendChart);
        })
        .catch(error => {
            console.error('Error fetching temperature trend data:', error);
            container.innerHTML = `<p>Error: Unable to fetch temperature trend data. Please try again later.</p>`;
        });
}

// Update weather data every 2 minutes
setInterval(() => {
    updateCurrentWeather();
    updateDailySummaries();
    updateTemperatureTrend();
}, 120000);

// Initial update
updateCurrentWeather();
updateDailySummaries();
updateTemperatureTrend();
updateAlertsList();

