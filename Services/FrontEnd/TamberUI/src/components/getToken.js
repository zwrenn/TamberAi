const axios = require("axios");

const clientId = "e74b4171efe74283b6e4f39d226eb8a7";
const clientSecret = "e340ccf080004ed8a00fdceb3c1253b9";
const refreshToken = "USER_REFRESH_TOKEN";

const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

const getToken = async () => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=refresh_token&refresh_token=" + refreshToken,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
};

const accessToken = getToken();
console.log("Access Token:", accessToken); // Print the obtained access token
