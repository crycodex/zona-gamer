import { useCurrentUser } from 'vuefire'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import { auth } from '@/config/firebase'

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials extends LoginCredentials {
  email: string
  password: string
}

export function useAuth() {
  const currentUser = useCurrentUser()

  const signIn = async ({ email, password }: LoginCredentials): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  }

  const signUp = async ({ email, password }: SignupCredentials): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return userCredential.user
  }

  const signOut = async (): Promise<void> => {
    await firebaseSignOut(auth)
  }

  return {
    currentUser,
    signIn,
    signUp,
    signOut,
  }
}

