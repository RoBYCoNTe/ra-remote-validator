import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  CheckboxGroupInput,
  ReferenceArrayInput
} from "react-admin";
import { compose } from "recompose";
import RemoteErrorsInterceptor, { withErrors } from "ra-remote-validator";

const FormatRoles = roles => (roles ? roles.map(r => r.id) : []);
const ParseRoles = roles => (roles ? roles.map(id => ({ id })) : []);

const MyCheckboxGroupInput = ({ loaded, ...props }) => (
  <CheckboxGroupInput {...props} choices={props.choices || []} />
);

const UserEdit = ({ errors, ...props }) => (
  <Edit {...props} undoable={false}>
    <SimpleForm validate={() => errors}>
      <RemoteErrorsInterceptor errors={errors} />
      <BooleanInput source="is_active" />
      <TextInput source="email" />
      <TextInput source="username" />
      <TextInput source="password" type="password" />
      <TextInput source="profile.name" />
      <TextInput source="profile.surname" />
      <ReferenceArrayInput
        format={FormatRoles}
        parse={ParseRoles}
        source="roles"
        reference="roles"
      >
        <MyCheckboxGroupInput />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
);
export default compose(withErrors)(UserEdit);
