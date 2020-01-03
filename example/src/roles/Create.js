import React from "react";
import { compose } from "recompose";
import { Create, SimpleForm, TextInput } from "react-admin";
import RemoteErrorsInterceptor, { withErrors } from "ra-remote-validator";

const RoleCreate = ({ errors, ...props }) => (
  <Create {...props}>
    <SimpleForm redirect="list" validate={() => errors}>
      <RemoteErrorsInterceptor errors={errors} />
      <TextInput source="code" />
      <TextInput source="name" />
    </SimpleForm>
  </Create>
);

export default compose(withErrors)(RoleCreate);
