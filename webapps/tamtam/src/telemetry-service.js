import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";

class TelemetryService {

    constructor() {
        this.reactPlugin = new ReactPlugin();
    }

    initialize(reactPluginConfig) {
        console.log(`Instrumenting with key ${process.env.REACT_APP_INSTRUMENTATIONKEY.substr(0, 10)}`);
        const INSTRUMENTATION_KEY = process.env.REACT_APP_INSTRUMENTATIONKEY; 
        
        this.appInsights = new ApplicationInsights({
            "config": {
                "instrumentationKey": INSTRUMENTATION_KEY,
                "maxBatchInterval": 0,
                "disableFetchTracking": false,
                "extensions": [this.reactPlugin],
                "extensionConfig": {
                    [this.reactPlugin.identifier]: reactPluginConfig
                }
            }
        });
        this.appInsights.loadAppInsights();
    }
}

export const ai = new TelemetryService();