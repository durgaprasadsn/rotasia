// authService.js
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, set, get, child, onValue } from '@firebase/database';
import { setAuthenticated } from './preferences';

function isAuthenticated() {
    return auth.currentUser;
}

const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.log("Error in signup " + error);
    throw error;
  }
};

const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("auth service login " + userCredential.user.email);
    return userCredential.user;
  } catch (error) {
    console.log("Error while logging in " + error);
    throw error;
  }
};

const logOut = async () => {
  try {
    await signOut(auth);
    setAuthenticated("false");
    window.localStorage.setItem("authenticated", "false");
  } catch (error) {
    console.log("Error in Logout " + error);
    throw error;
  }
};

const insert = async (path, json) => {
    try {
        console.log(path, json);
        const status = await set(ref(db, path), json).then(() => {
            console.log("Successufully updated the db");
            // <Alert severity="success">
            // {/* <AlertTitle>Success</AlertTitle> */}
            // This is a success alert — <strong>check it out!</strong>
            // </Alert>
        }).catch(alert);
    } catch (error) {
        console.log("Error in insert " + error);
        throw error;
    }
}

// const getFromDB = (path) => {
//     try {
//         get(child(ref(db), path)).then((snapshot) => {
//             if (snapshot.exists()) {
//                 console.log("Snapshot in get " + snapshot.val());
//                 return snapshot.val();
//             } else {
//                 console.log("Data not found");
//             }
//         });
//     } catch (error) {
//         console.log("Error in getting the data from DB");
//     }
// }

const getFromDB = (path) => {
  return new Promise((resolve, reject) => {
      try {
          get(child(ref(db), path)).then((snapshot) => {
              if (snapshot.exists()) {
                  console.log("Snapshot in get " + snapshot.val());
                  resolve(snapshot.val()); // Resolve the promise with the value
              } else {
                  console.log("Data not found");
                  resolve(null); // Resolve with null if data not found
              }
          });
      } catch (error) {
          console.log("Error in getting the data from DB");
          reject(error); // Reject the promise if there's an error
      }
  });
}

const onValueFromDB = async (path) => {
    try {
        const reference = ref(db, path);
        onValue(reference, (snapshot) => {
            const data = snapshot.val();
            if (!!data) {
                return data;
            } else {
                console.log("Data not found");
            }
        })
    } catch (error) {
        console.log("Error in onvlaue " + error);
    } 
}

export { signUp, logIn, logOut, insert, getFromDB, onValueFromDB, isAuthenticated };
