import { useReducer, useEffect, useState, useRef } from "react"
import { firestoreDatabase } from "../firebase/config"
import { collection, addDoc, deleteDoc, doc, Timestamp, onSnapshot, query, where, orderBy, updateDoc } from "firebase/firestore";

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return { isPending: true, document: null, success: false, error: null };
    case 'ADDED_DOCUMENT':
      return { isPending: false, document: action.payload, success: true, error: null };
    case 'DELETED_DOCUMENT':
      return { isPending: false, document: null, success: true, error: null };
    case 'UPDATED_DOCUMENT':
      return { isPending: false, document: action.payload, success: true, error: null };
    case 'ERROR':
      return { isPending: false, document: null, success: false, error: action.payload };
    default:
      return state;
  }
}

export const useFirestore = (collectionName) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  // collection ref
  const ref = collection(firestoreDatabase, collectionName);

  // only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action)
    }
  }

  // add document
  const addDocument = async (doc) => {
    dispatch({ type: 'IS_PENDING' });

    try {
      const createdAt = Timestamp.fromDate(new Date());
      const addedDocument = await addDoc(ref, { ...doc, createdAt });  
      dispatchIfNotCancelled({ type: "ADDED_DOCUMENT", payload: addedDocument })
    } catch (error) {
      console.error(error.message);
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not add' });
    }
  };

  // delete document
  const deleteDocument = async (id) => {
    dispatch({ type: 'IS_PENDING' });

    try {
      await deleteDoc(doc(ref, id));
      dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' });
    } catch (error) {
      console.error(error.message);
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not delete' });
    }
  };

  // update documents
  const updateDocument = async (id, updates) => {
    dispatch({ type: 'IS_PENDING' });

    try {
      const updatedDocument = await updateDoc(doc(firestoreDatabase, collectionName, id), updates);
      dispatchIfNotCancelled({ type: 'UPDATED_DOCUMENT', payload: updatedDocument })
      return updatedDocument;
    } catch (error) {
      console.error(error.message);
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not delete' });
      return null;
    }
  }

  useEffect(() => {
    setIsCancelled(false);  
    return () => setIsCancelled(true);
  }, []);

  return { response, addDocument, deleteDocument, updateDocument };
}

export const useCollection = (_collection, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  // if we don't use a ref --> infinite loop in useEffect
  // _query is an array and is "different" on every function call
  const queryRef = useRef(_query).current;
  const orderByRef = useRef(_orderBy).current;

  useEffect(() => {
    let ref = query(collection(firestoreDatabase, _collection));

    if (queryRef) {
      ref = query(ref, where(...queryRef));
    }
    if (orderByRef) {
      ref = query(ref, orderBy(...orderByRef));
    }

    const unsubscribe = onSnapshot(ref, snapshot => {
      let results = []
      snapshot.docs.forEach(doc => {
        results.push({ ...doc.data(), id: doc.id });
      });
      
      // update state
      setDocuments(results);
      setError(null);
    }, error => {
      console.error(error);
      setError('could not fetch the data');
    })

    // unsubscribe on unmount
    return () => unsubscribe();

  }, [_collection, queryRef, orderByRef])

  return { documents, error }
}

export const useDocument = (_collection, id) => {
  const [document, setDocument] = useState(null)
  const [error, setError] = useState(null)

  // realtime document data
  useEffect(() => {
    const ref = doc(firestoreDatabase, _collection, id);

    const unsubscribe = onSnapshot(ref, snapshot => {
      // need to make sure the doc exists & has data
      if(snapshot.data()) {
        setDocument({...snapshot.data(), id: snapshot.id})
        setError(null)
      }
      else {
        setError('No such document exists')
      }
    }, err => {
      console.log(err.message)
      setError('failed to get document')
    })

    // unsubscribe on unmount
    return () => unsubscribe()

  }, [_collection, id])

  return { document, error }
}