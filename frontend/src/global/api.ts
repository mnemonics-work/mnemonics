import { Configuration } from "./generated-api";
import { AnalyticsApi as _AnalyticsApi, ApiApi as _ApiApi } from "./generated-api";

import { MNEMONICS_BASE_URL } from "./constants";

const config = new Configuration({
    basePath: `${MNEMONICS_BASE_URL}`,
});

export const AnalyticsApi = new _AnalyticsApi(config);
export const MnemonicsAppApi = new _ApiApi(config);
