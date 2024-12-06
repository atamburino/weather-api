import "./App.css";
import React from "react";
import axios from "axios"

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
    this.getCoordinatesWithAxios();
  }

  // fetch
  getCoordinatesWithAxios = async () => {
    let apiKey = process.env.REACT_APP_WEATHER_SECRET_KEY;
    let city = "Canton";
    let url = "http://api.openweathermap.org/geo/1.0/direct";

    try {
      const response = await axios.get(url, {
        params: {
          q: city,
          appid: apiKey,
        },
      });

      // With axios, we don't need to check response.ok or call .json()
      // The data is automatically parsed and available in response.data
      const data = response.data;

      this.setState(
        {
          lat: data[0].lat,
          lon: data[0].lon,
        },
        () => this.getCurrentWeather()
      );
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.log(
          "Error response:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.log("Error request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error message:", error.message);
      }
    }
  };

  // Current Weather Data - This function gets the actual weather data using our coordinates
  getCurrentWeather = async () => {
    console.log("I fired get current weather");

    // Various Variables
    let currentUrl = "https://api.openweathermap.org/data/2.5/weather";
    let cordLat = this.state.lat;
    let cordLon = this.state.lon;
    let apiKey = process.env.REACT_APP_WEATHER_SECRET_KEY;

    try {
      // With axios, we can pass the parameters in a params object
      // This is cleaner than string interpolation
      const response = await axios.get(currentUrl, {
        params: {
          lat: cordLat,
          lon: cordLon,
          appid: apiKey,
          units: "imperial", // for Fahrenheit
        },
      });

      // Axios automatically converts to JSON and throws on bad status codes
      // So we can directly use response.data
      const data = response.data;

      this.setState({
        currentTemp: data.main.temp,
        weatherDescription: data.weather[0].description,
      });
    } catch (error) {
      if (error.response) {
        // Server responded with error status
        console.log(`Error: ${error.response.status}`);
        console.log("Error data:", error.response.data);
      } else if (error.request) {
        // Request made but no response received
        console.log("Error: No response received");
      } else {
        // Error in setting up the request
        console.log("Error:", error.message);
      }
    }
  };

  render() {
    return (
      <div className="App">
        <h1>App</h1>
        <p>{`API KEY: ${process.env.REACT_APP_WEATHER_SECRET_KEY}`}</p>
        <p>{`Lat: ${this.state.lat}, Lon: ${this.state.lon}`}</p>

        {/*
        Ternary operators if temp exists show it rounded else show "temp..."
        the rounding here is a self design choice. 
        
        Math.round() follows standard rounding rules:
          72.5 and above rounds up to 73
          72.4 and below rounds down to 72
        */}

        <p>
          {this.state.currentTemp
            ? `Current temperature: ${Math.round(this.state.currentTemp)}°F`
            : "temp..."}
        </p>
        {/* Ternary operators if conditions exists show it, else show "conditions..." */}
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
