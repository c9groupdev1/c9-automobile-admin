import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
    id: string;
    name: string;
    email: string;
    kycStatus: string;
    roles: string[];
    permissions: string[];
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    _hasHydrated: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            _hasHydrated: false,
            setAuth: (user, token) => {
                // The frontend no longer manages the cookie. 
                // The BFF server intercepts the login response and sets an HttpOnly 'c9_session' cookie.
                set({ user, token, isAuthenticated: true });
            },
            logout: () => {
                // The BFF server will clear the HttpOnly 'c9_session' cookie when /users/logout is called.
                set({ user: null, token: null, isAuthenticated: false });
            },
            setHasHydrated: (state) => {
                set({ _hasHydrated: state });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => sessionStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
