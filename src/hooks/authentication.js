import { useEffect, useState } from "react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { firebaseAuth, firebaseStorage, firestoreDatabase } from "../firebase/config"
import { useAuthContext } from "./useAuthContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, displayName, thumbnail) => {
    setError(null);
    setIsPending(true);

    try {
      // signup user
      const res = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      
      if (!res) {
        throw new Error('Could not complete signup');
      }

      // upload user thumbnail
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
      const img = ref(firebaseStorage, uploadPath);
      await uploadBytes(img, thumbnail);
      const imgUrl = await getDownloadURL(ref(img));

      // add display name to user
      await updateProfile(res.user, { displayName, photoURL: imgUrl });

      // create a user document
      await setDoc(doc(collection(firestoreDatabase, 'users'), res.user.uid), {
        online: true,
        displayName,
        photoURL: imgUrl
      });

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user });

      // update state
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (error) {
      if (!isCancelled) {
        console.error(error.message);
        setError(error.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    setIsCancelled(false);
    return () => setIsCancelled(true);
  }, [])

  return { error, isPending, signup }
}

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(null);
  const { dispatch, user } = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);

    // sign the user out
    try {
      // update online status
      const { uid } = user;
      await updateDoc(doc(collection(firestoreDatabase, 'users'), uid), { online: false });

      await signOut(firebaseAuth);

      // dispatch logout action
      dispatch({ type: 'LOGOUT' });

      // update state
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }      
    } catch (error) {
      if (!isCancelled) {
        console.error(error.message);
        setError(error.message);
        setIsPending(false);
      }
    }
  }

  useEffect(() => {
    setIsCancelled(false);
    return () => setIsCancelled(true);
  }, [])

  return { error, isPending, logout }
}

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    // sign the user in
    try {
      const res = await signInWithEmailAndPassword(firebaseAuth, email, password);

      if (!res) {
        throw new Error('Could not complete login');
      }

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user });

      // update online status
      await updateDoc(doc(collection(firestoreDatabase, 'users'), res.user.uid), { online: true });

      // update state
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }      
    } catch (error) {
      if (!isCancelled) {
        console.error(error.message);
        setError(error.message);
        setIsPending(false);
      }
    }
  }

  useEffect(() => {
    setIsCancelled(false);
    return () => setIsCancelled(true);
  }, [])

  return { error, isPending, login }
}