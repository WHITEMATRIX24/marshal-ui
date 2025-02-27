import { AxiosResponse } from "axios";
import apiConfig, { ApiConfigProps } from "./api-config";

///////////////////////////////// auth

export const loginApiHandler = async ({
  method,
  urlEndpoint,
  data,
  headers,
}: ApiConfigProps): Promise<AxiosResponse | undefined> => {
  return apiConfig({ urlEndpoint, data, method, headers });
};
