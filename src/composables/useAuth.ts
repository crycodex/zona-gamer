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

const SESSION_DATE_KEY = 'zonagamer_session_date'

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 */
const getCurrentDate = (): string => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

/**
 * Guarda la fecha de inicio de sesión en localStorage
 */
const saveSessionDate = (): void => {
  const today = getCurrentDate()
  localStorage.setItem(SESSION_DATE_KEY, today)
}

/**
 * Verifica si ha cambiado el día desde el inicio de sesión
 */
export const hasDayChanged = (): boolean => {
  const savedDate = localStorage.getItem(SESSION_DATE_KEY)
  if (!savedDate) {
    return true // Si no hay fecha guardada, considerar que cambió
  }
  const currentDate = getCurrentDate()
  return savedDate !== currentDate
}

/**
 * Limpia la fecha de sesión guardada
 */
const clearSessionDate = (): void => {
  localStorage.removeItem(SESSION_DATE_KEY)
}

export function useAuth() {
  const currentUser = useCurrentUser()

  const signIn = async ({ email, password }: LoginCredentials): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    // Guardar la fecha de inicio de sesión
    saveSessionDate()
    return userCredential.user
  }

  const signUp = async ({ email, password }: SignupCredentials): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    // Guardar la fecha de inicio de sesión
    saveSessionDate()
    return userCredential.user
  }

  const signOut = async (): Promise<void> => {
    await firebaseSignOut(auth)
    // Limpiar la fecha de sesión
    clearSessionDate()
  }

  return {
    currentUser,
    signIn,
    signUp,
    signOut,
  }
}

