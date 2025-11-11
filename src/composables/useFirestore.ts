import { useCollection, useDocument } from 'vuefire'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  type DocumentReference,
  type CollectionReference,
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Ref } from 'vue'

export function useFirestoreCollection<T>(collectionPath: string) {
  const collectionRef = collection(db, collectionPath) as CollectionReference<T>
  const documents = useCollection(collectionRef)

  const addDocument = async (data: T): Promise<DocumentReference<T>> => {
    return await addDoc(collectionRef, data)
  }

  return {
    documents,
    addDocument,
  }
}

export function useFirestoreDocument<T>(collectionPath: string, documentId: string) {
  const documentRef = doc(db, collectionPath, documentId) as DocumentReference<T>
  const document = useDocument(documentRef)

  const updateDocument = async (data: Partial<T>): Promise<void> => {
    await updateDoc(documentRef, data as any)
  }

  const deleteDocument = async (): Promise<void> => {
    await deleteDoc(documentRef)
  }

  return {
    document: document as Ref<T | undefined>,
    updateDocument,
    deleteDocument,
  }
}

