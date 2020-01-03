import React, { Component } from "react";

import ExampleComponent, { withErrors } from "ra-remote-validator";

export default class App extends Component {
  render() {
    return (
      <div>
        <ExampleComponent text="Modern React component module" />
      </div>
    );
  }
}
