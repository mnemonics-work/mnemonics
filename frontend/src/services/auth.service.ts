const tokenItemName = "authToken";

const AuthService = {
    getAuthToken(): string | null {
        return localStorage.getItem(tokenItemName);
    },

    removeAuthToken(): void {
        localStorage.removeItem(tokenItemName);
    },

    setAuthToken(token: string): void {
        localStorage.setItem(tokenItemName, token);
    },
};

export default AuthService;
