import * as React from "react";
import ChieldFeatureApi from "./api/ChildFeatureApi";
import FeatureApi from "./api/FeatureApi";

function App() {
  const api: FeatureApi = new FeatureApi("https://jepria-spring-feature.herokuapp.com");
  const chieldApi: ChieldFeatureApi = new ChieldFeatureApi(
    "https://jepria-spring-feature.herokuapp.com",
  );
  return (
    <div>
      <button
        onClick={() => {
          api.getRecordById("19").then(console.log);
        }}
      >
        Get
      </button>
      <button
        onClick={() => {
          chieldApi.getRecordById("147", "19").then(console.log);
        }}
      >
        Get child
      </button>
      <button
        onClick={() => {
          chieldApi.getAll("19").then(console.log);
        }}
      >
        Get all child
      </button>
    </div>
  );
}

export default App;
