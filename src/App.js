import "./App.css";
import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: null,
      lon: null,
      currentTemp: null,
      weatherDescription: null
    };
  }

  componentDidMount() {
    this.getCoordinatesWithFetch();
  }

  // fetch
  getCoordinatesWithFetch = async () => {
    let apiKey = process.env.REACT_APP_WEATHER_SECRET_KEY;
    let city = "Canton";
    let url = "http://api.openweathermap.org/geo/1.0/direct";

    try {
      let res = await fetch(`${url}?q=${city}&appid=${apiKey}`);
      console.log(res);

      if (!res.ok) {
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }

      let data = await res.json();
      console.log(data);
      this.setState({
        lat: data[0].lat,
        lon: data[0].lon,
        // After we set the latitude and longitude in our state (line 39) invoke function to get weather. 
      }, () => this.getCurrentWeather());
    } catch (error) {
      // if we get a error console log it
      console.log(error.message);
    }
  };

  // Current Weather Data - This function gets the actual weather data using our coordinates
  getCurrentWeather = async () => {
    //https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
    
    // Various Variables
    let currentUrl = "https://api.openweathermap.org/data/2.5/weather";
    let cordLat = this.state.lat;
    let cordLon = this.state.lon;
    let apiKey = process.env.REACT_APP_WEATHER_SECRET_KEY;

    try {
      // makes our API call / builds the route(link) we need for the api
      let response = await fetch(
        // added imperial to change from Celsius to Fahrenheit
        `${currentUrl}?lat=${cordLat}&lon=${cordLon}&appid=${apiKey}&units=imperial`
      );

      // checks if our api call worked // if fails throws status code at my face
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Turn the response into JSON data we can use
      // WHY: The response is actually coming over as string text so it needs to be converted to .json.
      let data = await response.json();
      
      // Save the weather info to our state!
      // We're grabbing:
      // - temperature from data.main.temp
      // - weather description from data.weather[0].description
      this.setState({
        currentTemp: data.main.temp,
        weatherDescription: data.weather[0].description,
      });
    } catch (error) {
      console.log(error.message);
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
