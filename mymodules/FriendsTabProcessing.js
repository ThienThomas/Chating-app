
import { auth } from "../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove, addDoc, collection, setDoc} from "firebase/firestore";

import { db } from "../firebase";
export async function sendingMyRequest(item) {
    Promise.all([
      updateDoc(doc(db, "users", item.uid), {
      receivedRequest: arrayUnion(auth.currentUser.uid)
      }),
     updateDoc(doc(db, "users", auth.currentUser.uid), {
      SendRequest: arrayUnion(item.uid)
    })
   ])
  }
export async function acceptRequest(item){
    Promise.all([
      updateDoc(doc(db, "users", auth.currentUser.uid), {
        listfriends: arrayUnion(item.uid)
      }),
      updateDoc(doc(db, "users", item.uid), {
        listfriends: arrayUnion(auth.currentUser.uid)
      })
    ])
    const docid = item.uid > auth.currentUser.uid ? auth.currentUser.uid + "-" + item.uid : item.uid + "-" + auth.currentUser.uid
    setDoc(doc(db, 'chatrooms', docid),{
      draf: [],
      users: item.uid > auth.currentUser.uid ? [auth.currentUser.uid, item.uid] : [item.uid, auth.currentUser.uid]
    })
    const colRef = collection(doc(db, 'chatrooms', docid), "messages");
    addDoc(colRef, {
      Initmessages: [],
    })
    const colRef2 = collection(doc(db, 'chatrooms', docid), "videocall");
    addDoc(colRef2, {
      Initvideo: []
    })
    denyRequest(item);
    Promise.all([
      updateDoc(doc(db, "users", auth.currentUser.uid), {
        listchats: arrayUnion(docid)
      }),
      updateDoc(doc(db, "users", item.uid), {
        listchats: arrayUnion(docid)
      })
    ])
    
  }
export async function revokeRequest(item) {
    Promise.all([
      updateDoc(doc(db, "users", item.uid), {
        receivedRequest: arrayRemove(auth.currentUser.uid)
      }),
      updateDoc(doc(db, "users", auth.currentUser.uid), {
        SendRequest: arrayRemove(item.uid)
      })
    ])
  };
export function denyRequest(item) {
    Promise.all([
      updateDoc(doc(db, "users", auth.currentUser.uid), {
        receivedRequest: arrayRemove(item.uid)
      }),
      updateDoc(doc(db, "users", item.uid), {
        SendRequest: arrayRemove(auth.currentUser.uid)
      })
    ])
  };