import { auth } from './firebase.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export const setAuthPersistence = async (rememberMe) => {
  const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
  try {
    await setPersistence(auth, persistenceType);
  } catch (error) {
    console.error("Error setting auth persistence:", error);
  }
};

export const resetPasswordWithEmail = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent successfully.");
  } catch (error) {
    console.error("Error sending password reset email:", error.code, error.message);
    throw error;
  }
};

export const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User signed up successfully:", user.uid);
    return user;
  } catch (error) {
    console.error("Error signing up user:", error.code, error.message);
    throw error;
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User logged in successfully:", user.uid);
    return user;
  } catch (error) {
    console.error("Error logging in user:", error.code, error.message);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("User logged in with Google successfully:", user.uid);
    return user;
  } catch (error) {
    console.error("Error logging in with Google:", error.code, error.message);
    throw error;
  }
};

export const logoutUser = async () => {
    return signOut(auth);
};

export { onAuthStateChanged, auth };
