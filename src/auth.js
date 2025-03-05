import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './config.js';
import { db } from './config.js';
import { doc, setDoc } from 'firebase/firestore';



export async function signup(fn, ln, email, password) {
    try {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        const user = doc(db, 'users', response.user.uid);
        await setDoc(user, {
            firstName: fn,
            lastName: ln,
            email: email,
            timeStamp: Date.now()
        });
        return response;

    } catch (error) {
        console.error(error); 
        return error;
    }
}

export async function login(email, password) {
    try{
        const response = await signInWithEmailAndPassword(auth, email, password);
        return response;
    }
    catch(error){
        console.error(error);
        return error;
    }
}