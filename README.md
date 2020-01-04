# ra-remote-validator

> React-Admin (3.\*) remote validator

[![NPM](https://img.shields.io/npm/v/ra-remote-validator.svg)](https://www.npmjs.com/package/ra-remote-validator) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save ra-remote-validator
```

## Usage

Edit your admin access point:

```jsx
import React, { Component } from "react";
import { errorsReducer, errorsSaga } from "ra-remote-validator";
const App = () => (
  <Admin
    customReducers={{
      errors: errorsReducer
    }}
    customSagas={[errorsSaga]}
  >
    <Resource />
  </Admin>
);
```

After you can customize your Create/Edit views adding few settings:

```jsx
import { compose } from "recompose";
import RemoteErrorsInterceptor, { withErrors } from "ra-remote-validator";

const MyCustomFormCreate = ({ dispatch, validate, errors, ...props }) => (
  <Create {...props}>
    <SimpleForm redirect="list" validate={validate}>
      <RemoteErrorsInterceptor errors={errors} dispatch={dispatch} />
      <TextInput source="code" />
      <TextInput source="name" />
    </SimpleForm>
  </Create>
);

export default compose(withErrors)(MyCustomFormCreate);
```

The `validate` method is valorized with lambda that simply returns errors provided by props.
Inside the form, to ensure benefits provided by react-final-form, we have to add
a simple component (that returns null anyway) called `RemoteErrorsInterceptor`, this
component will be responsible for the error's state management inside every field of the form.

Finally the entire component is exported using `withErrors` that will provide access to
many props: errors, validate, dispatch.

## API

My primary goals was to implement a library compatible with CakePHP validation errors schema.
But if you want to implements your own schema, you can use `setErrorsMapper` function.
With this function you can parse server response and returns validation details like
in this example:

```jsx
import { setErrorsMapper } from "ra-remote-validator";

setErrorsMapper(action => {
  const { payload } = action;
  // TODO: payload contains your server response.
  return {
    // Validation errors like you do with client side validation.
    // But now you can use your server validation data.
  };
});
```

_Notes_: setErrorsMapper can be called everywhere in your app, this function will replace
default validation function and I suggest you to exec the configuration inside your
app index.js (in the starting point).

_Please_: I've implemented this library after checking the capabilities of react-final-form.
I will really appreciate if someone has new suggestion that can be used to improve this project in
terms of code or design. In any case I hope this can help you too.

## License

MIT © [RoBYCoNTe](https://github.com/RoBYCoNTe)
