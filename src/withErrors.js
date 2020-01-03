import React from "react";
import { connect } from "react-redux";

/**
 * Expose remote form validations to current component.
 * @param {React.Component} Component
 */
const withErrors = Component =>
  connect(state => ({
    errors: state.errors || []
  }))(({ dispatch, ...props }) => <Component {...props} />);

export default withErrors;
