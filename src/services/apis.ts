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

export const fetchL1ControlsByStandardApi = async ({
  method = "GET",
  urlEndpoint,
  headers
}: ApiConfigProps): Promise<AxiosResponse | undefined> => {
  return apiConfig({ method, urlEndpoint, headers });
}