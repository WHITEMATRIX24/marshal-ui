import {
  insertGovernanceData,
  insertRolesData,
} from "@/lib/global-redux/features/roles_and_gov";
import {
  fetchAllGovernanceDataApi,
  fetchAllRolesDataApi,
} from "@/services/apis";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGovAndRoles = () => {
  const dispatch = useDispatch();
  const token = Cookies.get("access_token");

  const [initialRender, setInitialRender] = useState({
    govData: true,
    roleData: true,
  });
  const { data: governanceData, error: governanceError } = useQuery({
    queryKey: ["allgovernances"],
    queryFn: () =>
      fetchAllGovernanceDataApi({
        method: "GET",
        urlEndpoint: "/governance",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
  const { data: rolesData, isError: rolesError } = useQuery({
    queryKey: ["allroles"],
    queryFn: async () =>
      await fetchAllRolesDataApi({
        method: "GET",
        urlEndpoint: "/role/roles",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });

  useEffect(() => {
    if (governanceData?.data && initialRender.govData) {
      dispatch(insertGovernanceData(governanceData.data.items));
      setInitialRender((prevState) => ({
        ...prevState,
        govData: false,
      }));
    }
    if (rolesData?.data && initialRender.roleData) {
      dispatch(insertRolesData(rolesData.data.items));
      setInitialRender((prevState) => ({
        ...prevState,
        roleData: false,
      }));
    }
  }, [dispatch, governanceData, rolesData]);
};

export default useGovAndRoles;
