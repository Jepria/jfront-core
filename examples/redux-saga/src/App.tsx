import configureStore from "./app/store/configureStore";
import * as React from "react";
import { Provider } from "react-redux";
import { List } from "./list/List";

function App() {
  return (
    <Provider store={configureStore()}>
      <List />
    </Provider>
  );
}

export default App;
