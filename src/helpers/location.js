const axios = require("axios");


/**
 * CALCULATE CITY , COUNTRY , REGION FROM POSTAl CODE
 * @param filters
 * @param multiple
 * @returns {Promise<*>}
 */

const getGeocodeData = async (postalCode) => {
  const apiKey = "AIzaSyBGm8JnJuyLBjlfBX1z8NAVefFeKWIYNc4";
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&key=${apiKey}`;

  try {
    const response = await axios.get(geocodeUrl);
    const data = response.data;
    if (data.status === 'OK') {
      const addressComponents = data.results[0].address_components;
      let country, city, region;

      addressComponents.forEach(component => {
        if (component.types.includes('country')) {
          country = component.long_name;
        } else if (component.types.includes('administrative_area_level_1')) {
          region = component.long_name;
        } else if (component.types.includes('locality')) {
          city = component.long_name;
        }
      });

      return { country, city, region };
    } else {
      throw new Error('Geocode was not successful for the following reason: ' + data.status);
    }
  } catch (error) {
    console.error('Error fetching geocode data:', error);
    throw error;
  }
};
/**
 * CALCULATE LONGITUDE AND LATITUDE FROM POSTAL CODE
 * @param filters
 * @param multiple
 * @returns {Promise<*>}
 */

async function getCoordinatesFromPostalCode(postalCode) {
  try {
    const mapAddress = "https://maps.googleapis.com/maps/api/geocode/json";
    const apiKey = "AIzaSyBGm8JnJuyLBjlfBX1z8NAVefFeKWIYNc4";
    const response = await axios.get(
      `${mapAddress}?address=${postalCode}&key=${apiKey}`
    );
    // Check if the response is successful and contains results
    if (response.data.status === "OK" && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      const latitude = location.lat;
      const longitude = location.lng;

      return { latitude, longitude };
    } else {
      throw new Error("Failed to fetch coordinates from postal code");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    throw error;
  }
}

module.exports = {
  getGeocodeData,
  getCoordinatesFromPostalCode
}