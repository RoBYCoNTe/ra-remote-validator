import { put, takeEvery } from "redux-saga/effects";
import { CRUD_UPDATE_FAILURE, CRUD_CREATE_FAILURE } from "ra-core";

export const CRUD_REMOTE_VALIDATION_ERROR = "RA/CRUD_REMOTE_VALIDATION_ERROR";
export const CRUD_REMOTE_VALIDATION_CLEAR = "RA/CRUD_REMOTE_VALIDATION_CLEAR";
export const LOCATION_CHANGE = "@@router/LOCATION_CHANGE";

const mapFieldErrors = (field, errors) => {
  const keys = Object.keys(errors);
  const messages = keys.filter(k => typeof errors[k] === "string");

  if (messages.length > 0) {
    return {
      [field]: messages.map(m => errors[m]).join("\n")
    };
  } else {
    const out = keys.reduce(
      (errorMap, key) => ({
        ...errorMap,
        ...mapFieldErrors(key, errors[key])
      }),
      {}
    );
    return {
      [field]: out
    };
  }
};

function* crudRemoteValidationClear() {
  yield put({
    type: CRUD_REMOTE_VALIDATION_CLEAR,
    payload: { modifiedFields: false }
  });
}

function* crudCreateFailure(action) {
  if (!action.payload) {
    return;
  }
  if (action.payload.data.code !== 422) {
    return;
  }
  var json = action.payload;
  if (!json.data) {
    return;
  }
  var errors = json.data.errors;
  var fields = Object.keys(errors);
  var validationErrors = fields.reduce((errorsMap, field) => {
    return {
      ...errorsMap,
      ...mapFieldErrors(field, errors[field])
    };
  }, {});
  yield put({ type: CRUD_REMOTE_VALIDATION_ERROR, payload: validationErrors });
}

export default function* errorSagas() {
  yield takeEvery(CRUD_CREATE_FAILURE, crudCreateFailure);
  yield takeEvery(CRUD_UPDATE_FAILURE, crudCreateFailure);
  yield takeEvery(LOCATION_CHANGE, crudRemoteValidationClear);
}
