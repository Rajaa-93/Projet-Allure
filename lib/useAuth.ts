"use client";

import { useEffect, useState } from "react";

type AuthProfile = {
  firstName: string;
  lastName: string;
  email: string;
  premium: boolean;
};

type AuthState = {
  authenticated: boolean;
  profile: AuthProfile;
};

const AUTH_STORAGE_KEY = "allure:auth";

const defaultProfile: AuthProfile = {
  firstName: "Alice",
  lastName: "Martin",
  email: "alice.allure@gmail.com",
  premium: false,
};

function persistAuthState(nextState: AuthState) {
  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));
  } catch {
    // Ignore storage failures so auth actions still update the in-memory UI state.
  }
}

export function useAuth() {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<AuthState>({
    authenticated: true,
    profile: defaultProfile,
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) {
        setReady(true);
        return;
      }

      const parsed = JSON.parse(raw);
      if (
        typeof parsed?.authenticated === "boolean" &&
        typeof parsed?.profile?.firstName === "string" &&
        typeof parsed?.profile?.lastName === "string" &&
        typeof parsed?.profile?.email === "string"
      ) {
        setState({
          authenticated: parsed.authenticated,
          profile: {
            firstName: parsed.profile.firstName,
            lastName: parsed.profile.lastName,
            email: parsed.profile.email,
            premium: Boolean(parsed.profile.premium),
          },
        });
      }
    } catch {
      setState({
        authenticated: true,
        profile: defaultProfile,
      });
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    persistAuthState(state);
  }, [ready, state]);

  function updateAuthState(updater: (prev: AuthState) => AuthState) {
    setState((prev) => {
      const nextState = updater(prev);
      persistAuthState(nextState);
      return nextState;
    });
  }

  function login() {
    updateAuthState((prev) => ({ ...prev, authenticated: true }));
  }

  function logout() {
    updateAuthState((prev) => ({ ...prev, authenticated: false }));
  }

  function register(profile: AuthProfile) {
    const nextState = {
      authenticated: true,
      profile,
    };
    persistAuthState(nextState);
    setState(nextState);
  }

  function activatePremium() {
    updateAuthState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        premium: true,
      },
    }));
  }

  return {
    ready,
    authenticated: state.authenticated,
    profile: state.profile,
    login,
    logout,
    register,
    activatePremium,
  };
}
