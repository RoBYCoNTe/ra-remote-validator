import React from "react";
import { Edit, SimpleForm, TextInput } from "react-admin";
import { compose } from "recompose";
import RemoteErrorsInterceptor, { withErrors } from "ra-remote-validator";

const RoleEdit = ({ dispatch, validate, errors, ...props }) => (
  <Edit {...props} undoable={false}>
    <SimpleForm redirect="list" validate={validate}>
      <RemoteErrorsInterceptor errors={errors} dispatch={dispatch} />
      <TextInput source="code" />
      <TextInput source="name" />
    </SimpleForm>
  </Edit>
);
export default compose(withErrors)(RoleEdit);
