import "./App.css";
import React from "react";
import axios from "axios";
// import ProductCard from "./Components/ProductCard";
import ProductList from "./Components/ProductList";

// // Default city for the search TODO: swap this to a form input
// let citySearch = "new jersey";


/**
 * WeatherService class handles all API interactions with OpenWeatherMap
 * Provides methods for getting geographical coordinates and current weather data
 */
class WeatherService {
  constructor() {
    this.API_KEY = process.env.REACT_APP_WEATHER_SECRET_KEY;
    this.GEO_URL = "http://api.openweathermap.org/geo/1.0/direct";
    this.WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"; // DOCS -> https://openweathermap.org/current
  }

  // Generic error handler for API calls
  // param is {Error} error - The error object from the API call
  handleError(error) {
    console.error("API Error:", error);
    if (error.response) {
      console.error("Error response:", error.response.data);
    }
  }

    /**
   * Fetches geographical coordinates for a given city name
   * param is {string} city - Name of the city to search for
   * returns a {Promise<{lat: number, lon: number}>} Object containing latitude and longitude
   */
  async getGeoCoordinates(city) {
    try {
      const response = await axios.get(this.GEO_URL, {
        params: {
          q: city,
          appid: this.API_KEY,
        },
      });

      // console.log("getGeoCoordinates Full response:", response); // Log the entire response
      // console.log("getGeoCoordinates Response data:", response.data); // Log just the data portion

      return {
        lat: response.data[0].lat,
        lon: response.data[0].lon,
      };
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

    /**
   * Fetches current weather data for given coordinates
   * param {number} lat - Latitude
   * param {number} lon - Longitude
   * returns {Promise<Object>} Formatted weather data including temperature, conditions, etc.
   */
  async getCurrentWeather(lat, lon) {
    console.log("this is the console log for current weather");
    try {
      const currentWeatherResponse = await axios.get(this.WEATHER_URL, {
        params: {
          lat,
          lon,
          appid: this.API_KEY,
          units: "imperial", // for Fahrenheit
        },
      });

      // console.log("getCurrentWeather Full response:", currentWeatherResponse); // Log the entire response
      // console.log("getCurrentWeather Response data:", currentWeatherResponse.data); // Log just the data portion

      // Format the weather data for easier use in the application
      const currentWeatherData = {
        temperature: currentWeatherResponse.data.main.temp,
        feels_like: currentWeatherResponse.data.main.feels_like,
        todays_high: currentWeatherResponse.data.main.temp_max,
        todays_low: currentWeatherResponse.data.main.temp_min,
        weather_conditions: currentWeatherResponse.data.weather[0].description,
        weather_icon: currentWeatherResponse.data.weather[0].icon,
      };

      // // Logging returned results from get current weather data
      // console.log("Formatted Weather Data:", currentWeatherData);

      return currentWeatherData;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
}

///////////////////////////////////////////////
// Create an instance of WeatherService -- I used this as i was building the version for axios/testing
// const weatherService = new WeatherService();
///////////////////////////////////////////////

// This was used when converting code to axios
// weatherService
//   .getGeoCoordinates(citySearch)
//   .then((coordinates) => {
//     console.log("Coordinates:", coordinates);
//     return weatherService.getCurrentWeather(coordinates.lat, coordinates.lon);
//   })
//   .catch((error) => {
//     console.error("Geo Error:", error);
//   });


/**
 * Main App component for the weather application
 * Manages the state and rendering of weather info
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: null,
      lon: null,
      currentTemp: null,
      feelsLike: null,
      highTemp: null,
      lowTemp: null,
      weatherDescription: null,
      weatherIcon: null,
      isLoading: true,
      error: null,
    };
    // Create instance of WeatherService for API calls
    this.weatherService = new WeatherService();
  }

  /**
   * Lifecycle method that runs after component mounts
   * Fetches initial weather data for the default city
   */
  async componentDidMount() {
    try {
      const citySearch = "new jersey"; 

      // First get the geographical coordinates for the city
      const coordinates = await this.weatherService.getGeoCoordinates(
        citySearch
      );

      // Update state with coordinates
      this.setState({
        lat: coordinates.lat,
        lon: coordinates.lon,
      });

      // Fetch weather data using the coordinates
      const weatherData = await this.weatherService.getCurrentWeather(
        coordinates.lat,
        coordinates.lon
      );

      // Update state with all weather information
      this.setState({
        currentTemp: weatherData.temperature,
        feelsLike: weatherData.feels_like,
        highTemp: weatherData.todays_high,
        lowTemp: weatherData.todays_low,
        weatherDescription: weatherData.weather_conditions,
        weatherIcon: weatherData.weather_icon,
        isLoading: false,
      });


    } catch (error) {
      // Handle any errors during data fetching
      this.setState({
        error: "Failed to load weather data",
        isLoading: false,
      });
      console.error("Error fetching weather data:", error);
    }
  }

  /**
   * Render method for displaying weather information
   * Includes loading and error states
   */
  render() {
    const { isLoading, error } = this.state;

    // Show loading message while data is being fetched
    if (isLoading) {
      return <div>Loading weather data...</div>;
    }

    // Show error message if data fetch failed
    if (error) {
      return <div>Error: {error}</div>;
    }

    // Render weather information
    return (
      <div className="App">
        <h1>Weather App</h1>
        {/* <p>{`API KEY: ${process.env.REACT_APP_WEATHER_SECRET_KEY}`}</p> */}
        <p>{`Location: ${this.state.lat?.toFixed(2)}, ${this.state.lon?.toFixed(
          2
        )}`}</p>

        <div className="weather-info">
          {/* Display current temperature */}
          <p className="current-temp">
            {this.state.currentTemp &&
              `Current temperature: ${Math.round(this.state.currentTemp)}°F`}
          </p>
          <p className="feels-like">
            {/* Display feels-like temperature */}
            {this.state.feelsLike &&
              `Feels like: ${Math.round(this.state.feelsLike)}°F`}
          </p>
          <p className="high-low">
            {/* Display high and low temperatures */}
            {this.state.highTemp &&
              this.state.lowTemp &&
              `High: ${Math.round(this.state.highTemp)}°F / Low: ${Math.round(
                this.state.lowTemp
              )}°F`}
          </p>
          <p className="conditions">
            {/* Display weather conditions */}
            {this.state.weatherDescription &&
              `Conditions: ${this.state.weatherDescription}`}
          </p>
          {/* Display weather icon if available */}
          {this.state.weatherIcon && (
            <img
              src={`http://openweathermap.org/img/w/${this.state.weatherIcon}.png`} // https://openweathermap.org/weather-conditions
              alt="Weather icon"
            />
          )}
        </div>
        {/* <ProductCard /> */}
        <ProductList />
      </div>
    );
  }
}

export default App;
