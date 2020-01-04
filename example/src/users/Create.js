import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  ReferenceArrayInput,
  CheckboxGroupInput
} from "react-admin";
import { compose } from "recompose";
import RemoteErrorsInterceptor, { withErrors } from "ra-remote-validator";

const FormatRoles = roles => (roles ? roles.map(r => r.id) : []);
const ParseRoles = roles => (roles ? roles.map(id => ({ id })) : []);

const MyCheckboxGroupInput = ({ loaded, ...props }) => (
  <CheckboxGroupInput {...props} choices={props.choices || []} />
);

const UserCreate = ({ dispatch, validate, errors, ...props }) => {
  return (
    <Create {...props}>
      <SimpleForm redirect="list" validate={validate}>
        <RemoteErrorsInterceptor errors={errors} dispatch={dispatch} />
        <TextInput source="email" />
        <TextInput source="username" />
        <TextInput source="password" type="password" />
        <TextInput source="profile.name" defaultValue="" />
        <TextInput source="profile.surname" defaultValue="" />
        <ReferenceArrayInput
          format={FormatRoles}
          parse={ParseRoles}
          source="roles"
          reference="roles"
        >
          <MyCheckboxGroupInput />
        </ReferenceArrayInput>
      </SimpleForm>
    </Create>
  );
};
export default compose(withErrors)(UserCreate);
