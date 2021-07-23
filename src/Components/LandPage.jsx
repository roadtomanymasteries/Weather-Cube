import React, { useState, useCallback } from "react";
import fetchGeoCode from "../Utils/geoCode.util";
import fetchWeather from "../Utils/oneCall.utils";
import moment from "moment";

function LandPage({ location, setLocation }) {
  const [geoCodes, setGeoCodes] = useState([]);
  const [sevenDays, setSevenDays] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setLocation(event.target.value);
    setGeoCodes([]);
    setSevenDays([]);
  };

  const handleBtn = async (event) => {
    try {
      setLoading(true);
      const geoResults = await fetchGeoCode(location);
      setGeoCodes(geoResults);
      setLoading(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGeoLocation = async (geoCode) => {
    try {
      setLoading(true);
      const { lat, lon } = geoCode;
      const sevenDay = await fetchWeather(lat, lon);
      setSevenDays(sevenDay);
      setLoading(false);
      setGeoCodes([geoCode]);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div>
        <input
          type="text"
          name="location"
          placeholder="Enter location here"
          onChange={handleChange}
        />
        <button onClick={handleBtn} disabled={location.length < 2}>
          Search
        </button>
        {loading && <span>loading</span>}
      </div>
      <div>
        <ul>
          {geoCodes.map((geoCode) => {
            const { name, country } = geoCode;
            return (
              <li>
                <button
                  onClick={() => handleGeoLocation(geoCode)}
                  className="btn-location-list"
                >
                  {name} {country}
                </button>
              </li>
            );
            // geoCode = {name: "Lon", country: "UK"}
          })}
        </ul>
      </div>
      <div>
        <ul>
          {sevenDays.map((sevenDay) => {
            const { icon, main } = sevenDay.weather[0];
            return (
              <li>
                {`${moment(sevenDay.dt * 1000).format("DD/MM/YY")} ${main}`}

                <img
                  src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
                  alt=""
                />
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default LandPage;
