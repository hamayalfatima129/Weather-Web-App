const apiKey = "5b4748c3a988f68bc6532c8d72b78b0c";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const locationEl = document.getElementById("location");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const forecastEl = document.getElementById("forecastDays");

const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

async function fetchWeather(city) {
  try {

    const response = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    updateWeather(data);


    const forecastRes = await fetch(`${forecastUrl}?q=${city}&appid=${apiKey}&units=metric`);
    const forecastData = await forecastRes.json();
    updateForecast(forecastData);

  } catch (error) {
    locationEl.textContent = "City not found 😢";
    temperature.textContent = "--°C";
    condition.textContent = "----";
  }
}


function getWeatherEmoji(condition) {
  switch (condition) {
    case "Clear": return "☀️";
    case "Clouds": return "☁️";
    case "Rain": return "🌧️";
    case "Snow": return "❄️";
    case "Thunderstorm": return "⛈️";
    default: return "🌤️";
  }
}

function updateWeather(data) {
  const cityName = data.name;
  const temp = Math.round(data.main.temp);
  const weatherCondition = data.weather[0].main;
  const humidityValue = data.main.humidity;
  const windSpeed = data.wind.speed;
  const feels = Math.round(data.main.feels_like);


  const emoji = getWeatherEmoji(weatherCondition);


  locationEl.textContent = cityName;
  temperature.textContent = `${temp}°C`;
  condition.textContent = `${weatherCondition} ${emoji}`;
  humidity.textContent = `Humidity: ${humidityValue}%`;
  wind.textContent = `Wind: ${windSpeed} m/s`;
  feelsLike.textContent = `Feels like: ${feels}°C`;
}


function updateForecast(forecastData) {
  forecastEl.innerHTML = "";


  for (let i = 0; i < forecastData.list.length; i += 8) {
    const dayData = forecastData.list[i];
    const date = new Date(dayData.dt_txt);
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });

    const emoji = getWeatherEmoji(dayData.weather[0].main);
    const temp = Math.round(dayData.main.temp);

    const div = document.createElement("div");
    div.classList.add("day");
    div.innerHTML = `
      <p>${weekday}</p>
      <p>${emoji}</p>
      <p>${temp}°C</p>
    `;
    forecastEl.appendChild(div);
  }
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

window.addEventListener("load", () => {
  fetchWeather("ISLAMABAD");
});
