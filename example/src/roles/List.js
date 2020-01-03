import React from "react";
import { List, Datagrid, TextField, EditButton } from "react-admin";
import Filters from "./Filters";

const UserList = props => (
  <React.Fragment>
    <List {...props} perPage={10} filters={<Filters />}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="code" />
        <TextField source="name" />
        <EditButton />
      </Datagrid>
    </List>
  </React.Fragment>
);
export default UserList;
