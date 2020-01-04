import { useForm } from "react-final-form";
import PropTypes from "prop-types";

import { CRUD_REMOTE_VALIDATION_CLEAR } from "./errorsSaga";

const getKeyAndValue = (object, prefix = null) => {
  let keys = Object.keys(object);
  let array = [];
  for (var i = 0; i < keys.length; i++) {
    let keyValue = object[keys[i]];
    let keyName = [prefix, keys[i]].filter(p => p !== null).join(".");
    if (typeof keyValue !== "string") {
      array = array.concat(getKeyAndValue(keyValue, keyName));
    } else {
      array.push({ name: keyName, value: keyValue });
    }
  }
  return array;
};

const RemoteErrorsInterceptor = ({ dispatch, errors }) => {
  if (!errors) {
    return null;
  }
  const form = useForm();
  const keysAndValues = getKeyAndValue(errors);
  // See: https://final-form.org/docs/final-form/types/FormApi
  //      https://final-form.org/docs/final-form/types/FormState
  if (keysAndValues.length > 0) {
    form.subscribe(
      ({ dirtyFieldsSinceLastSubmit }) => {
        let keysAndValues = getKeyAndValue(errors);
        if (keysAndValues.length === 0) {
          return;
        }
        let keys = keysAndValues.map(kv => kv.name);
        let modifiedFields = Object.keys(dirtyFieldsSinceLastSubmit).filter(
          key =>
            dirtyFieldsSinceLastSubmit[key] === true && keys.indexOf(key) !== -1
        );
        if (modifiedFields.length > 0) {
          modifiedFields.forEach(name => form.resetFieldState(name));
          dispatch({
            type: CRUD_REMOTE_VALIDATION_CLEAR,
            payload: { modifiedFields }
          });
        }
      },
      { dirtyFieldsSinceLastSubmit: true }
    );
  }
  keysAndValues.map(kv => kv.name).forEach(name => form.blur(name));
  return null;
};

RemoteErrorsInterceptor.propTypes = {
  dispatch: PropTypes.func.isRequired,
  errors: PropTypes.any.isRequired
};

export default RemoteErrorsInterceptor;
