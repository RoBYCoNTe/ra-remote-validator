import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  BooleanField,
  ArrayField,
  SingleFieldList,
  ChipField
} from "react-admin";
import Filters from "./Filters";

const UserList = props => (
  <React.Fragment>
    <List {...props} perPage={10} filters={<Filters />}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <BooleanField source="is_active" />
        <TextField source="username" />
        <ArrayField source="roles">
          <SingleFieldList>
            <ChipField source="name" />
          </SingleFieldList>
        </ArrayField>
        <EditButton />
      </Datagrid>
    </List>
  </React.Fragment>
);
export default UserList;
