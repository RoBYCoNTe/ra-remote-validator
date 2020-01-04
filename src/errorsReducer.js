import {
  CRUD_REMOTE_VALIDATION_ERROR,
  CRUD_REMOTE_VALIDATION_CLEAR
} from "./errorsSaga";
const unset = (object, name) => {
  let args = name.split(".");
  let cursor = object;
  for (var i = 0; i < args.length; i++) {
    if (i === args.length - 1) {
      delete cursor[args[i]];
    } else {
      cursor = object[args[i]];
    }
  }
  return object;
};
export default (previousState = {}, { type, payload }) => {
  if (type === CRUD_REMOTE_VALIDATION_ERROR) {
    return payload;
  } else if (type === CRUD_REMOTE_VALIDATION_CLEAR) {
    console.info({
      type,
      payload
    });
    const { modifiedFields } = payload;
    if (modifiedFields === false) {
      return {};
    }
    const stateCopy = { ...previousState };
    const nextState = modifiedFields.reduce(
      (state, field) => unset(state, field),
      stateCopy
    );
    return nextState;
  }
  return previousState;
};
