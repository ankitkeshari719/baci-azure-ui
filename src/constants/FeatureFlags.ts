import log from "loglevel";

const env = process.env.REACT_APP_NODE_ENV?.toLocaleLowerCase();

let featureFlags = {
    feedback: true,
    pulseCheck: true,
    rateApp: false,
    report: true,
    stressTest: true,
};
//let api_url = "http://localhost:8081";
let api_url = "";
if (env === 'production') {
    featureFlags = {
        feedback: false,
        pulseCheck: false,
        rateApp: false,
        report: true,
        stressTest: false,
    };
    api_url = "https://prod-api-container-app.happywave-6f9d3247.australiaeast.azurecontainerapps.io"
    log.setLevel(log.levels.ERROR);
} else if (env === 'test') {
    featureFlags = {
        feedback: true,
        pulseCheck: true,
        rateApp: false,
        report: true,
        stressTest: false,
    };
    api_url = "https://baciapi.azurewebsites.net"
    log.setLevel(log.levels.TRACE);
} else if (env === 'development') {
    featureFlags = {
        feedback: true,
        pulseCheck: true,
        rateApp: false,
        report: true,
        stressTest: true,
    };
    api_url = "https://baciapi.azurewebsites.net"
    log.setLevel(log.levels.TRACE);
}

export const FEATURE_FLAGS_SET = featureFlags;
export const API_URL = api_url
