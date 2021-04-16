import { Configuration } from "./generated-api";
import {
    MnemonicsApi as _MnemonicsApi,
    ExpressionsApi as _ExpressionsApi,
    CategoriesApi as _CategoriesApi,
    MnemonicTypesApi as _MnemonicsTypesApi,
    TagsApi as _TagsApi,
} from "./generated-api";

import { MNEMONICS_BASE_URL } from "./constants";

const config = new Configuration({
    basePath: `${MNEMONICS_BASE_URL}/api`,
});

export const MnemonicsApi = new _MnemonicsApi(config);
export const ExpressionsApi = new _ExpressionsApi(config);
export const CategoriesApi = new _CategoriesApi(config);
export const MnemonicTypesApi = new _MnemonicsTypesApi(config);
export const TagsApi = new _TagsApi(config);
