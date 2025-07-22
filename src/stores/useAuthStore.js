import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { create } from "zustand";
import { auth } from "../firebase-config";

export const useAuthStore = create((set) => ({
  user: null,
  error: null,
  //states - user,error
  //actions - signup,login,logout,initAuth
  signup: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      set({ user: userCredential.user, error: null });
    } catch (error) {
      set({ error: error.message });
    }
  },

  login: async (email, password) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      set({ user: userCredential.user, error: null });
    } catch (error) {
      set({ error: error.message });
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error) {
      set({ error: error.message });
    }
  },

  initAuth: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user });
    });
  },
}));
