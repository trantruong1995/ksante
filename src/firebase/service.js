// tao keywords cho displayName, su dung cho search
import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, Timestamp, updateDoc, where} from "firebase/firestore";
import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage';
import {db, storage} from "./config";
import {v4 as uuid} from "uuid";

export const generateKeywords = (displayName) => {
    // liet ke tat cac hoan vi. vd: name = ["David", "Van", "Teo"]
    // => ["David", "Van", "Teo"], ["David", "Teo", "Van"], ["Teo", "David", "Van"],...
    const name = displayName.split(' ').filter((word) => word);

    const length = name.length;
    let flagArray = [];
    let result = [];
    let stringArray = [];

    /**
     * khoi tao mang flag false
     * dung de danh dau xem gia tri
     * tai vi tri nay da duoc su dung
     * hay chua
     **/
    for (let i = 0; i < length; i++) {
        flagArray[i] = false;
    }

    const createKeywords = (name) => {
        const arrName = [];
        let curName = '';
        name.split('').forEach((letter) => {
            curName += letter;
            arrName.push(curName);
        });
        return arrName;
    };

    function findPermutation(k) {
        for (let i = 0; i < length; i++) {
            if (!flagArray[i]) {
                flagArray[i] = true;
                result[k] = name[i];

                if (k === length - 1) {
                    stringArray.push(result.join(' '));
                }

                findPermutation(k + 1);
                flagArray[i] = false;
            }
        }
    }

    findPermutation(0);

    return stringArray.reduce((acc, cur) => {
        const words = createKeywords(cur);
        return [...acc, ...words];
    }, []);
};

export const addDocument = async (collectionName,data) =>{
    try {
        await addDoc(collection(db,collectionName),{
            ...data,
            createAt: Timestamp.now()
        })
    }catch (err){
        console.log(err)
    }
}
export const getDocument = async (docRef) =>{
    try {
        const doc = await getDoc(docRef)
        return doc.data()
    }catch (err){
        console.log(err)
    }
}


export const updateDocument = async (docRef,data) => {
    try {
        await updateDoc(docRef,data)
    }catch (e){
        console.log(e)
    }
}
export const deleteDocument = async (docRef) => {
    try {
        await deleteDoc(docRef)
    }catch (e){
        console.log(e)
    }
}

export const deleteRoomMessage = async (roomId) => {

    const q = query(collection(db, "messages"), where("roomId", "==", roomId));
    const snapShot = await getDocs(q)
    snapShot.forEach((snap) => {
        let docRef = doc(db,'messages',snap.id)
        deleteDocument(docRef)
    });
}

export const uploadFile = async (file) => {

    const storageRef = ref(storage, uuid());
    const uploadTask = uploadBytesResumable(storageRef, file);

    await uploadTask

    return  await getDownloadURL(uploadTask.snapshot.ref)
}


export async function fetchUserList(search,curMembers) {

    const q = query(collection(db,'users'),where('keywords', 'array-contains', search.toLowerCase()))

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
        return {
            id: doc.id,
            label: doc.data().displayName,
            value: doc.data().uid,
            photoURL: doc.data().photoURL
        }
    }).filter(opt => !curMembers.includes(opt.value))
}