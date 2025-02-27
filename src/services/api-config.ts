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
    });
    return response;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.detail);
    }
    throw new Error("unknown API error");
  }
};

export default apiConfig;
