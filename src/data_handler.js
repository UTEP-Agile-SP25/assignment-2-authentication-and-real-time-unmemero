import { db } from './config.js';
import { doc, collection, setDoc, getDoc, getDocs, deleteDoc } from 'firebase/firestore';

export async function getUserName(uid) {
    if (!uid) {
        return 'Hi, Stranger';
    }
    try {
        const user = await getDoc(doc(db, 'users', uid));
        return 'Hi, ' + user.data().firstName + ' ' + user.data().lastName;
    } catch (error) {
        console.error(error);
    }
}

export async function getAllSongs() {
    try {
        const songsCollection = collection(db, 'songs');
        const songsSnapshot = await getDocs(songsCollection);
        return songsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error(error);
    }
}

export async function getSong(id) {
    try {
        const song = await getDoc(doc(db, 'songs', id));
        return song.data();
    } catch (error) {
        console.error(error);
    }
}

export async function addSong(title, artist, genre, year) {
    try {
        const song = doc(db, 'songs', title);
        await setDoc(song, {
            title: title,
            artist: artist,
            genre: genre,
            year: year
        });
    } catch (error) {
        console.error(error);
    }
}

export async function deleteSong(id) {
    try {
        await deleteDoc(doc(db, 'songs', id));
    } catch (error) {
        console.error(error);
    }
}

export async function updateSong(id, title, artist, album, year) {
    try {
        const song = doc(db, 'songs', id);
        await setDoc(song, {
            title: title,
            artist: artist,
            album: album,
            year: year
        });
    } catch (error) {
        console.error(error);
    }
}