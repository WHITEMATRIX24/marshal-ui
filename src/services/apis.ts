import axios, { AxiosResponse } from "axios";
import apiConfig, { ApiConfigProps } from "./api-config";
import Cookies from "js-cookie";
///////////////////////////////// auth

export const loginApiHandler = async ({
  method,
  urlEndpoint,
  data,
  headers,
}: ApiConfigProps): Promise<AxiosResponse | undefined> => {
  return apiConfig({ urlEndpoint, data, method, headers });
};

export const fetchStandardsApi = async ({
  method,
  urlEndpoint,
  data,
  headers,
}: ApiConfigProps): Promise<AxiosResponse> => {
  return await apiConfig({ urlEndpoint, data, method, headers });
};
export const fetchControlsByStandardApi = async (
  stdId: string
): Promise<any[]> => {
  try {
    const token = Cookies.get("access_token"); // ✅ Get token from cookies

    if (!token) {
      console.error("No access token found!");
      return [];
    }

    const response: AxiosResponse = await axios.get(
      `http://3.108.62.30:8000/api/v1/controls/?std_code_id=${stdId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Pass token in headers
          Accept: "application/json",
        },
      }
    );

    console.log("API Response:", response.data);
    return response.data || [];
  } catch (error: any) {
    console.error(
      "Error fetching controls:",
      error.response?.data || error.message
    );
    return [];
  }
};
