import React, { Component } from "react";
import { Admin, Resource } from "react-admin";
import dataProvider from "./dataProvider";
import authProvider from "./authProvider";
import addAuthHeaderFeature from "./addAuthHeaderFeature";
import {
  errorsSaga,
  errorsReducer
  // setErrorsMapper
} from "ra-remote-validator";
import users from "./users";
import roles from "./roles";

const dp = addAuthHeaderFeature(dataProvider);
// setErrorsMapper(action => console.warn("action: ", action));

export default class App extends Component {
  render() {
    return (
      <Admin
        customSagas={[errorsSaga]}
        customReducers={{
          errors: errorsReducer
        }}
        dataProvider={dp}
        authProvider={authProvider}
      >
        <Resource name="users" {...users} />
        <Resource name="roles" {...roles} />
      </Admin>
    );
  }
}
