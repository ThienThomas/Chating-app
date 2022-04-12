
import { auth } from "../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
import { db } from "../firebase";
export async function sendingRequest(item) {
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
    denyRequest(item);
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