import { Feature, FeatureCreate, FeatureUpdate } from "../dto/Feature";
import { ConnectorChield } from "@jfront/core-rest";

class ChieldFeatureApi extends ConnectorChield<Feature, string, FeatureCreate, FeatureUpdate> {
  constructor(baseUrl: string) {
    baseUrl = baseUrl + "/feature";
    super(baseUrl, "feature-process");
  }
}

export default ChieldFeatureApi;
