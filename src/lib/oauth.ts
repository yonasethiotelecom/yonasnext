import axios from "axios";
import { getEnvVariable } from "./env";
import { decode, JwtPayload } from 'jsonwebtoken';

/**
 * Checks if a given JWT token is expired.
 * @param token - The JWT token to check.
 * @returns `true` if the token is expired or invalid, otherwise `false`.
 */
export function isTokenExpired(token: string): boolean {
  try {
    // Decode the token using the `decode` method from jsonwebtoken
    const decoded = decode(token) as JwtPayload | null;

    // If decoding fails or the token doesn't have an expiration, consider it expired
    if (!decoded || !decoded.exp) {
      return true;
    }

    // Compare the expiration time with the current time
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Consider the token expired if decoding fails
  }
}

 


// Function to get the initial Azure AD access token using the Resource Owner Password Credentials (ROPC) flow
export async function getAzureAccessToken(username: string, password: string) {
  const OAUTH_SERVER_URL = getEnvVariable("OAUTH_SERVER_URL");
  const AZURE_AD_CLIENT_ID = getEnvVariable("AZURE_AD_CLIENT_ID");
  const AZURE_AD_CLIENT_SECRET = getEnvVariable("AZURE_AD_CLIENT_SECRET");
  const SCOPE = getEnvVariable("SCOPE");

  try {
    const response = await axios.post(
      OAUTH_SERVER_URL,
      new URLSearchParams({
        grant_type: "password", // Using password grant type
        client_id: AZURE_AD_CLIENT_ID, // Your Azure AD client ID
        client_secret: AZURE_AD_CLIENT_SECRET, // Your Azure AD client secret
        scope: SCOPE, // Scope for the initial token
        username: username, // User's username
        password: password, // User's password
      }).toString(), // URLSearchParams converts the body to application/x-www-form-urlencoded
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Required Content-Type for Azure AD
        },
      }
    );

    return response.data; // Return the token response (access_token, token_type, expires_in, scope)
  } catch (error: any) {
    console.error("Error getting access token 1:", error.response?.data || error.message);
    throw new Error("Error fetching access token");
  }
}

// Function to get a new Azure AD token with a different scope using client credentials flow
export async function getNewTokenWithScope(username: string, password: string) {
  const OAUTH_SERVER_URL = getEnvVariable("OAUTH_SERVER_URL");
  const AZURE_AD_CLIENT_ID = getEnvVariable("AZURE_AD_CLIENT_ID");
  const AZURE_AD_CLIENT_SECRET = getEnvVariable("AZURE_AD_CLIENT_SECRET");
  

  try {
    // Use the client_credentials grant type to obtain a new token with a different scope
    const response = await axios.post(
      OAUTH_SERVER_URL,
      new URLSearchParams({
        grant_type: "password",// Correct grant type for client credentials flow
        client_id: AZURE_AD_CLIENT_ID, // Your Azure AD client ID
        client_secret: AZURE_AD_CLIENT_SECRET, // Your Azure AD client secret
        scope: "offline_access api://24dfb5c5-1fa4-44e4-97c6-daf83e7b3227/read_data", // New scope for the new token
        username: username, // User's username
        password: password, // User's password
      }).toString(), // URLSearchParams formats the body as application/x-www-form-urlencoded
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Required Content-Type for Azure AD
        },
      }
    );

    return response.data; // Return the new token response (access_token, token_type, expires_in)
  } catch (error: any) {
    console.error("Error getting new access token 2:", error.response?.data || error.message);
    throw new Error("Error fetching new access token");
  }
}




export async function refreshToken(refreshToken: string):Promise<{ access_token: string, refresh_token: string }> {
  const OAUTH_SERVER_URL = getEnvVariable("OAUTH_SERVER_URL");
  const AZURE_AD_CLIENT_ID = getEnvVariable("AZURE_AD_CLIENT_ID");
  const AZURE_AD_CLIENT_SECRET = getEnvVariable("AZURE_AD_CLIENT_SECRET");
  try {
    const response = await axios.post(
      OAUTH_SERVER_URL,
      new URLSearchParams({
       // Correct grant type for client credentials flow
        client_id: AZURE_AD_CLIENT_ID, // Your Azure AD client ID
        client_secret: AZURE_AD_CLIENT_SECRET, // Your Azure AD client secret
        grant_type: "refresh_token",
        scope: "offline_access api://24dfb5c5-1fa4-44e4-97c6-daf83e7b3227/read_data", 
        refresh_token: refreshToken ,// New scope for the new token
       
      }).toString(), // URLSearchParams formats the body as application/x-www-form-urlencoded
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Required Content-Type for Azure AD
        },
      }
    );

    return    response.data; //
  } catch (error) {
    console.error('Error refreshing token:', error);

    throw new Error("Error fetching new access token");
  }
}
