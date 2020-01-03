import React from "react";
import { Filter, TextInput } from "react-admin";
const RoleFilters = props => (
  <Filter {...props}>
    <TextInput key="q" label="Search" source="q" alwaysOn />
  </Filter>
);
export default RoleFilters;
