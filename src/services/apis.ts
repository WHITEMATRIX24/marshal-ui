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

export const fetchStandardsApi = async ({
  method,
  urlEndpoint,
  data,
  headers,
}: ApiConfigProps): Promise<AxiosResponse> => {
  return await apiConfig({ urlEndpoint, data, method, headers });
};

export const fetchL1ControlsByStandardApi = async ({
  method,
  urlEndpoint,
  headers,
}: ApiConfigProps): Promise<AxiosResponse | undefined> => {
  return apiConfig({ method, urlEndpoint, headers });
};
export const updateControlsApi = async ({
  method,
  urlEndpoint,
  headers,
  data,
}: ApiConfigProps): Promise<AxiosResponse | undefined> => {
  return apiConfig({ method, urlEndpoint, headers, data });
};

export const deleteControlsApi = async ({
  method,
  urlEndpoint,
  headers,
}: ApiConfigProps): Promise<AxiosResponse | undefined> => {
  return apiConfig({ method, urlEndpoint, headers });
};

export const fetchActivitesControlsApi = async ({
  method,
  urlEndpoint,
  headers,
}: ApiConfigProps): Promise<AxiosResponse | undefined> => {
  return apiConfig({ method, urlEndpoint, headers });
};

export const fetchUsersDataApi = async ({
  method,
  urlEndpoint,
  headers,
}: ApiConfigProps): Promise<AxiosResponse | undefined> => {
  return apiConfig({ method, urlEndpoint, headers });
};

export const fetchAllGovernanceDataApi = async ({
  method,
  urlEndpoint,
  headers,
}: ApiConfigProps): Promise<AxiosResponse | undefined> => {
  return apiConfig({ method, urlEndpoint, headers });
};

export const fetchAllRolesDataApi = async ({
  method,
  urlEndpoint,
  headers,
}: ApiConfigProps): Promise<AxiosResponse | undefined> => {
  return apiConfig({ method, urlEndpoint, headers });
};

export const createUserApi = async ({
  method,
  urlEndpoint,
  headers,
  data,
}: ApiConfigProps): Promise<AxiosResponse | undefined> => {
  return apiConfig({ method, urlEndpoint, headers, data });
};

export const updateUserApi = async ({
  method,
  urlEndpoint,
  headers,
  data,
}: ApiConfigProps): Promise<AxiosResponse | undefined> => {
  return apiConfig({ method, urlEndpoint, headers, data });
};

export const deleteUserApi = async ({
  method,
  urlEndpoint,
  headers,
  data,
}: ApiConfigProps): Promise<AxiosResponse | undefined> => {
  return apiConfig({ method, urlEndpoint, headers, data });
};
export const fetchRolesApi = async ({
  method,
  urlEndpoint,
  headers,
}: ApiConfigProps): Promise<AxiosResponse | undefined> => {
  return apiConfig({ method, urlEndpoint, headers });
};
export const fetchClientRolesApi = async ({
  method,
  urlEndpoint,
  headers,
}: ApiConfigProps): Promise<AxiosResponse | undefined> => {
  return apiConfig({ method, urlEndpoint, headers });
};
export const AddRolesApi = async ({
  method,
  urlEndpoint,
  headers,
  data,
}: ApiConfigProps): Promise<AxiosResponse | undefined> => {
  return apiConfig({ method, urlEndpoint, headers, data });
};
export const EditRolesApi = async ({
  method,
  urlEndpoint,
  headers,
  data
}: ApiConfigProps): Promise<AxiosResponse | undefined> => {
  return apiConfig({ method, urlEndpoint, headers, data });
};