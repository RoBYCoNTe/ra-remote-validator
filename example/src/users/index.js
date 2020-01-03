import UserIcon from "@material-ui/icons/Group";
import List from "./List";
import Edit from "./Edit";
import Create from "./Create";

export default {
  options: {
    group: "admin"
    // roles: ["admin"]
  },
  icon: UserIcon,
  list: List,
  edit: Edit,
  create: Create
};
