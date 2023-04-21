import {useEffect, useState} from "react";
import {collection, onSnapshot,query,where,orderBy} from "firebase/firestore";
import {db} from "../firebase/config";

export const useFireStore = (collections,condition) => {

    const [doc,setDoc] = useState([])

    useEffect(() => {

        let q = query(collection(db, collections),orderBy('createAt'));

        if (condition){
            // if no condition
            if (!condition.compareValue || !condition.compareValue.length) {
                // reset documents data
                setDoc([]);
                return;
            }
            q = query(collection(db, collections), where(condition.fieldName, condition.operator, condition.compareValue),orderBy('createAt'));
        }

        const unsubscribe = onSnapshot(q, (querySnapshot) => {

            const data = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setDoc(data)
        });

        return unsubscribe

    },[condition, collections])

    return doc
};