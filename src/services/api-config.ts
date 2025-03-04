import axios, { AxiosError, AxiosResponse } from "axios";

export interface ApiConfigProps {
  urlEndpoint: string;
  data?: any;
  method: string;
  headers?: {};
}

const apiConfig = async ({
  urlEndpoint,
  data,
  method,
  headers,
}: ApiConfigProps): Promise<AxiosResponse> => {
  try {
    const response = await axios({
      baseURL: process.env.NEXT_PUBLIC_BASE_SERVER_URL,
      url: `/api/v1${urlEndpoint}`,
      data,
      method,
      headers,
    });
    return response;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(error.response?.data.detail);
      } else {
        throw new Error(error.message);
      }
    }
    throw new Error("unknown API error");
  }
};

export default apiConfig;
