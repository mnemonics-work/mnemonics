const environmentVariables = process.env;
export const MNEMONICS_BASE_URL = environmentVariables.MNEMONICS_BASE_URL;
export const MNEMONICS_WEB_URL = environmentVariables.MNEMONICS_WEB_URL;
export const GOOGLE_APP_ID = environmentVariables.GOOGLE_APP_ID;
export const GOOGLE_SCOPE = "email+profile";
export const GOOGLE_REDIRECT_URI = MNEMONICS_WEB_URL + "/login";
export const GOOGLE_LINK =
    "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&scope=" +
    GOOGLE_SCOPE +
    "&access_type=offline&include_granted_scopes=true&client_id=" +
    GOOGLE_APP_ID +
    "&redirect_uri=" +
    GOOGLE_REDIRECT_URI;
