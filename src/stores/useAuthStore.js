import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { create } from "zustand";
import { auth } from "../firebase-config";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { toast } from "sonner";

export const useAuthStore = create((set) => ({
  user: null,
  error: null,
  setUser: (user) => set({ user }),
  //states - user,error
  //actions - signup,login,logout,initAuth
  signup: async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });
      set({ user: userCredential.user, error: null });
      toast.success("Signup successful!");
    } catch (error) {
      set({ error: error.message });
      toast.error(`Signup failed: ${error.message}`);
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
      const user = userCredential.user;
      set({ user, error: null });
      toast.success("Logged in successfully!");

    } catch (error) {
      set({ error: error.message });
      toast.error(`Login failed: ${error.message}`);
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
      toast.success("Logged in successfully!");
    } catch (error) {
      set({ error: error.message });
      toast.error(`Logout failed: ${error.message}`);
    }
  },

  initAuth: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user });
    });
  },

  deleteAccount: async (email, password) => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        set({ error: "No user is currently signed in." });
        toast.error("No user is currently signed in.");
        return;
      }

      // Re-authenticate the user
      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(currentUser, credential);

      // Now delete the account
      await currentUser.delete();
      set({ user: null, error: null });
      toast.success("Account deleted successfully!");
    } catch (error) {
      set({ error: error.message });
      toast.error(`Account deletion failed: ${error.message}`);
    }
  },
}));
