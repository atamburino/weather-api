import "./App.css";
import React from "react";
import axios from "axios";

// Weather Service Helper
class WeatherService {
  constructor() {
    this.API_KEY = process.env.REACT_APP_WEATHER_SECRET_KEY;
    this.GEO_URL = "http://api.openweathermap.org/geo/1.0/direct";
    this.WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
  }

  async getLocationCoordinates(city) {
    try {
      const response = await axios.get(this.GEO_URL, {
        params: {
          q: city,
          appid: this.API_KEY,
        },
      });
      
      return {
        lat: response.data[0].lat,
        lon: response.data[0].lon,
      };
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getCurrentWeather(lat, lon) {
    try {
      const response = await axios.get(this.WEATHER_URL, {
        params: {
          lat,
          lon,
          appid: this.API_KEY,
          units: "imperial",
        },
      });
      
      return {
        temperature: response.data.main.temp,
        description: response.data.weather[0].description,
      };
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  handleError(error) {
    if (error.response) {
      console.log("Error response:", error.response.status, error.response.data);
    } else if (error.request) {
      console.log("Error request:", error.request);
    } else {
      console.log("Error message:", error.message);
    }
  }
}

// Create a single instance of the weather service
const weatherService = new WeatherService();

// App Component
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: null,
      lon: null,
      currentTemp: null,
      weatherDescription: null,
    };
  }

  componentDidMount() {
    this.fetchWeatherData();
  }

  fetchWeatherData = async () => {
    try {
      // Get coordinates
      const coordinates = await weatherService.getLocationCoordinates("Canton");
      
      // Update coordinates in state
      this.setState({ lat: coordinates.lat, lon: coordinates.lon });
      
      // Get weather data
      const weatherData = await weatherService.getCurrentWeather(
        coordinates.lat,
        coordinates.lon
      );
      
      // Update weather data in state
      this.setState({
        currentTemp: weatherData.temperature,
        weatherDescription: weatherData.description,
      });
    } catch (error) {
      console.log("Failed to fetch weather data:", error);
    }
  };

  render() {
    return (
      <div className="App">
        <h1>App</h1>
        <p>{`API KEY: ${process.env.REACT_APP_WEATHER_SECRET_KEY}`}</p>
        <p>{`Lat: ${this.state.lat}, Lon: ${this.state.lon}`}</p>
        <p>
          {this.state.currentTemp
            ? `Current temperature: ${Math.round(this.state.currentTemp)}°F`
            : "temp..."}
        </p>
        <p>
          {this.state.weatherDescription
            ? `Weather conditions: ${this.state.weatherDescription}`
            : "conditions..."}
        </p>
      </div>
    );
  }
}

export default App;