const apiKey = "0f8b5e4cc7d635e9520a2ecde4ddcde1";

const cityEl = document.querySelector(".city");
const tempEl = document.querySelector(".temp");
const descEl = document.querySelector(".description");
const iconEl = document.querySelector(".weather-icon");
const dateEl = document.querySelector(".date");
const clockEl = document.querySelector(".clock");
const searchInput = document.querySelector(".search-section input");
const searchBtn = document.querySelector(".search-section button");
const forecastEl = document.querySelector(".forecast");
const toggleBtn = document.querySelector(".mode-toggle");
const body = document.body;

let clockInterval;

// 🌤 Fetch Weather
async function fetchWeather(city = "New York") {
  setSearchLoading(true);

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    const data = await res.json();

    if (data.cod !== 200) {
      alert("City not found!");
      return;
    }

    updateWeatherUI(data);
    updateClockAndDate(data.timezone);
    fetchForecastFake(); // Still using fake forecast

    const localHour = new Date((data.dt + data.timezone) * 1000).getHours();
    setDarkMode(localHour >= 18 || localHour < 6);

  } catch (err) {
    console.error("Weather fetch error:", err);
  } finally {
    setSearchLoading(false);
  }
}

// ⏱️ Clock & Date
function updateClockAndDate(offsetSeconds) {
  clearInterval(clockInterval);

  clockInterval = setInterval(() => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const localTime = new Date(utc + offsetSeconds * 1000);

    clockEl.textContent = localTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    dateEl.textContent = localTime.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const hour = localTime.getHours();
    setDarkMode(hour >= 18 || hour < 6);
  }, 1000);
}

// 🌤 Update UI
function updateWeatherUI(data) {
  cityEl.textContent = `${data.name}, ${data.sys.country}`;
  tempEl.textContent = `${Math.round(data.main.temp)}°C`;
  descEl.textContent = data.weather[0].description;
  iconEl.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="${data.weather[0].description}" width="80" height="80">`;
}

// 🌓 Toggle Dark Mode
function setDarkMode(enabled) {
  body.classList.toggle("dark-mode", enabled);
  toggleBtn.textContent = enabled ? "🌙" : "☀";
}

// 🔍 Search Loading State
function setSearchLoading(isLoading) {
  searchBtn.disabled = isLoading;
  searchBtn.textContent = isLoading ? "⏳" : "🔍";
}

// 🎲 Fake Forecast
function fetchForecastFake() {
  forecastEl.innerHTML = "";

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayIndex = new Date().getDay();

  for (let i = 1; i <= 5; i++) {
    const dayIndex = (todayIndex + i) % 7;
    const randomTemp = Math.floor(Math.random() * 20) + 10;
    const iconCode = getRandomWeatherIconCode();

    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <div>${days[dayIndex]}</div>
      <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Icon" width="50" height="50">
      <div>${randomTemp}°C</div>
    `;
    forecastEl.appendChild(card);
  }
}

function getRandomWeatherIconCode() {
  const icons = ["01d", "02d", "03d", "04d", "09d", "10d", "11d", "13d", "50d"];
  return icons[Math.floor(Math.random() * icons.length)];
}

// 🖱️ Events
document.querySelector(".search-section").addEventListener("submit", (e) => {
  e.preventDefault();
  const city = searchInput.value.trim();
  if (city) fetchWeather(city);
  else alert("Please enter a city.");
});

toggleBtn.addEventListener("click", () => {
  const isDark = body.classList.contains("dark-mode");
  setDarkMode(!isDark);
});

// 🚀 Initial Load
fetchWeather();
