import React from "react";
import {
  Filter,
  TextInput,
  ReferenceInput,
  SelectInput,
  BooleanInput
} from "react-admin";
const UserFilters = props => (
  <Filter {...props}>
    <TextInput source="q" alwaysOn />
    <BooleanInput source="active" />
    <ReferenceInput source="role" reference="roles" allowEmpty>
      <SelectInput optionText="name" />
    </ReferenceInput>
  </Filter>
);
export default UserFilters;
