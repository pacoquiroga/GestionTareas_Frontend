"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";

type AuthState = {
  token: string | null;
  user: { id: number; username: string } | null;
};

type AuthAction =
  | {
      type: "SET_AUTH";
      payload: { token: string; user: { id: number; username: string } };
    }
  | { type: "LOGOUT" };

const initialState: AuthState = {
  token: null,
  user: null,
};

const AuthContext = createContext<
  { state: AuthState; dispatch: React.Dispatch<AuthAction> } | undefined
>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_AUTH":
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
      };
    case "LOGOUT":
      return {
        ...state,
        token: null,
        user: null,
      };
    default:
      return state;
  }
};

const isTokenExpired = (token: string) => {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Failed to decode token", error);
    return true;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (isTokenExpired(user.token)) {
          dispatch({ type: "LOGOUT" });
        } else {
          dispatch({ type: "SET_AUTH", payload: user });
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    if (state.token) {
      const interval = setInterval(() => {
        if (isTokenExpired(state.token!)) {
          dispatch({ type: "LOGOUT" });
          clearInterval(interval);
          localStorage.removeItem("user");
        }
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [state.token]);

  if (!isClient) return null;

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
