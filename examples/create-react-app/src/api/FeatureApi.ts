import { Feature, FeatureCreate, FeatureUpdate } from "../dto/Feature";
import { ConnectorCrud } from "@jfront/core-rest";

class ExampleApi extends ConnectorCrud<Feature, string, FeatureCreate, FeatureUpdate> {
  constructor(baseUrl: string) {
    baseUrl = baseUrl + "/feature";
    super(baseUrl, false);
  }
}

export default ExampleApi;
