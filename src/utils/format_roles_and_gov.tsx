import { RootState } from "@/lib/global-redux/store";
import { governance } from "@/models/governance";
import { roleModel } from "@/models/roles";

const formatRolesAndGov = ({
  roleId,
  govId,
  governanceData,
  rolesData,
}: {
  roleId?: number | any;
  govId?: number | any;
  governanceData?: governance[] | null;
  rolesData?: roleModel[] | null;
}) => {
  if (roleId && rolesData) {
    const matchedRole = rolesData.find((role) => role.id === roleId);
    return matchedRole?.role_name || "not found";
  }
  if (govId && governanceData) {
    const matchedGov = governanceData.find((gov) => gov.id === govId);
    return matchedGov?.gov_name || "not found";
  }
  return "something went wrong";
};

export default formatRolesAndGov;
