
import { useEffect, useState } from "react";

function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Get countries
  useEffect(() => {
    fetch("https://location-selector.labs.crio.do/countries")
      .then((response) => response.json())
      .then((data) => {
        setCountries(data);
      });
  }, []);

  // Get states when country changes
  useEffect(() => {
    if (!selectedCountry) {
      setStates([]);
      setCities([]);
      setSelectedState("");
      setSelectedCity("");
      return;
    }

    fetch(
      `https://location-selector.labs.crio.do/country=${selectedCountry}/states`
    )
      .then((response) => response.json())
      .then((data) => {
        setStates(data);
        setCities([]);
        setSelectedState("");
        setSelectedCity("");
      });
  }, [selectedCountry]);

  // Get cities when state changes
  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      setSelectedCity("");
      return;
    }

    fetch(
      `https://location-selector.labs.crio.do/country=${selectedCountry}/state=${selectedState}/cities`
    )
      .then((response) => response.json())
      .then((data) => {
        setCities(data);
        setSelectedCity("");
      });
  }, [selectedState, selectedCountry]);

  return (
    <div>
      <h1>Select Location</h1>

      {/* Country Dropdown */}
      <select
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
      >
        <option value="">Select Country</option>

        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>

      {/* State Dropdown */}
      <select
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
        disabled={!selectedCountry}
      >
        <option value="">Select State</option>

        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>

      {/* City Dropdown */}
      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        disabled={!selectedState}
      >
        <option value="">Select City</option>

        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      {/* Selected Location */}
      {selectedCity && (
        <h2>
          You selected {selectedCity}, {selectedState}, {selectedCountry}
        </h2>
      )}
    </div>
  );
}

export default App;