import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
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
        setTimeout(() => {
            window.location.href = './songList.html';
        }, 3000);
        return response;
    }
    catch(error){
        console.error(error);
        return error;
    }
}

export async function logout() {
    try {
        await signOut(auth);
        setTimeout(() => {
            window.location.href = './index.html';
        }, 2000);
    } catch (error) {
        console.error(error);
    }
}