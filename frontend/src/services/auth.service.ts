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
    getDefaultAuthHeaders(): { Authorization: string } | Record<string, never> {
        const token = this.getAuthToken();
        if (!token) {
            return {};
        }
        return { Authorization: `Token ${token}` };
    },
};

export default AuthService;
