import * as React from "react";
import FeatureApi from "./api/FeatureApi";

function App() {
  const api: FeatureApi = new FeatureApi("https://jepria-spring-feature.herokuapp.com");

  return (
    <div>
      <button onClick={() => {
        api.getRecordById("7").then(console.log);
      }}>Get
      </button>
    </div>
  );
}

export default App;
