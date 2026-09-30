import { useEffect, useState } from "react";

function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [error, setError] = useState("");

  // Get countries
  useEffect(() => {
    fetch("https://location-selector.labs.crio.do/countries")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }

        return response.text();
      })
      .then((text) => {
        if (!text) {
          throw new Error("Failed to fetch countries");
        }

        return JSON.parse(text);
      })
      .then((data) => {
        setCountries(data);
        setError("");
      })
      .catch(() => {
        setCountries([]);
        setError("Failed to load countries");
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
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch states");
        }

        return response.text();
      })
      .then((text) => {
        if (!text) {
          throw new Error("Failed to fetch states");
        }

        return JSON.parse(text);
      })
      .then((data) => {
        setStates(data);
        setCities([]);
        setSelectedState("");
        setSelectedCity("");
        setError("");
      })
      .catch(() => {
        setStates([]);
        setCities([]);
        setError("Failed to load states");
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
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch cities");
        }

        return response.text();
      })
      .then((text) => {
        if (!text) {
          throw new Error("Failed to fetch cities");
        }

        return JSON.parse(text);
      })
      .then((data) => {
        setCities(data);
        setSelectedCity("");
        setError("");
      })
      .catch(() => {
        setCities([]);
        setError("Failed to load cities");
      });
  }, [selectedState, selectedCountry]);

  return (
    <div>
      <h1>Location Selector</h1>

      {/* Country */}
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

      {/* State */}
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

      {/* City */}
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

      {/* Error */}
      {error && <p>{error}</p>}

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