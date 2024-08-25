const apiKey = '1a2eae63deeb413eae152522242508';

const countryCityData = {
    "United States": [
        { city: "New York", zipcode: "10001" },
        { city: "Los Angeles", zipcode: "90001" }
    ],
    "Canada": [
        { city: "Toronto", zipcode: "M5A" },
        { city: "Vancouver", zipcode: "V5K" }
    ],
    "India": [
        { city: "Mumbai", zipcode: "400001" },
        { city: "Delhi", zipcode: "110001" },
        { city: "Bangalore", zipcode: "560001" }
    ]
};

function loadCountries() {
    const countrySelect = document.getElementById('countrySelect');
    for (const country in countryCityData) {
        let option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    }
}

function loadCities() {
    const country = document.getElementById('countrySelect').value;
    const citySelect = document.getElementById('citySelect');
    citySelect.innerHTML = '<option value="" disabled selected>Select a city</option>';

    countryCityData[country].forEach(cityInfo => {
        let option = document.createElement('option');
        option.value = cityInfo.city;
        option.textContent = `${cityInfo.city}, ${cityInfo.zipcode}`;
        citySelect.appendChild(option);
    });
}

function getWeather() {
    const city = document.getElementById('citySelect').value.trim();
    if (!city) {
        alert("Please select a city.");
        return;
    }

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.current) {
                displayWeather(data);
                getForecast(data.location.lat, data.location.lon);
            } else {
                handleWeatherError(city);
            }
        })
        .catch(error => {
            console.error("Error fetching the weather data:", error);
            handleWeatherError(city);
        });
}

function getForecast(lat, lon) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=5`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const forecastDisplay = document.getElementById('forecastDisplay');
            forecastDisplay.innerHTML = ''; 

            if (data && data.forecast && data.forecast.forecastday) {
                data.forecast.forecastday.forEach(forecast => {
                    const dateString = forecast.date;

                    const forecastElement = document.createElement('p');
                    forecastElement.innerText = `${dateString}: ${forecast.day.condition.text}, Temp: ${forecast.day.avgtemp_c}°C`;
                    forecastDisplay.appendChild(forecastElement);
                });
            } else {
                console.error('5-day forecast data is not available');
            }
        })
        .catch(error => {
            console.error("Error fetching the forecast data:", error);
        });
}

function displayWeather(data) {
    document.getElementById('city').innerText = `City: ${data.location.name}`;
    document.getElementById('temp').innerText = `Temperature: ${data.current.temp_c}°C`;
    document.getElementById('humidity').innerText = `Humidity: ${data.current.humidity}%`;
    document.getElementById('description').innerText = `Weather: ${data.current.condition.text}`;
}

function handleWeatherError(city) {
    alert(`Weather data not available for ${city}. Please select another city.`);
}

document.addEventListener('DOMContentLoaded', loadCountries);
