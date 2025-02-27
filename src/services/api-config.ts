import axios, { AxiosResponse } from "axios";

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
}: ApiConfigProps): Promise<AxiosResponse | undefined> => {
  try {
    const response = await axios({
      baseURL: process.env.NEXT_PUBLIC_BASE_SERVER_URL,
      url: `/api/v1${urlEndpoint}`,
      data,
      method,
    });
    return response;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export default apiConfig;
