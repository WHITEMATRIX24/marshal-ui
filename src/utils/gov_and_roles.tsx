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
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const govAndRoles = () => {
  const dispatch = useDispatch();
  const token = Cookies.get("access_token");
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
    if (governanceData?.data) {
      dispatch(insertGovernanceData(governanceData.data.items));
    }
    if (rolesData?.data) {
      dispatch(insertRolesData(rolesData.data.items));
    }
  }, [dispatch, governanceData, rolesData]);
};

export default govAndRoles;
