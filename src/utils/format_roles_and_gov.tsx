import { RootState } from "@/lib/global-redux/store";
import React from "react";
import { useSelector } from "react-redux";

const formatRolesAndGov = ({
  roleId,
  govId,
}: {
  roleId?: number | any;
  govId?: number | any;
}) => {
  const governanceData = useSelector(
    (state: RootState) => state.RolesAndGovernance.allGovernance
  );
  const rolesData = useSelector(
    (state: RootState) => state.RolesAndGovernance.allRoles
  );

  if (
    !rolesData ||
    !governanceData ||
    rolesData.length < 1 ||
    governanceData.length < 1
  )
    return "something went wrong";

  if (roleId) {
    const matchedRole = rolesData.find((role) => role.id === roleId);
    return matchedRole?.role_name || "not found";
  }
  if (govId) {
    const matchedGov = governanceData.find((gov) => gov.id === govId);
    return matchedGov?.gov_name || "not found";
  }
};

export default formatRolesAndGov;
