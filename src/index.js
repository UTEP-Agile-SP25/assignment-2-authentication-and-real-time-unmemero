import { login, signup, logout, } from './auth.js';
import { getUserName, getAllSongs, addSong, deleteSong, getSong, updateSong } from './data_handler.js';
import './assets/styles/style.css';
import 'firebase/auth';
import { auth } from './config.js';
import { onAuthStateChanged } from 'firebase/auth';

onAuthStateChanged(auth, (user) => {
    if (!user && 
        !window.location.pathname.endsWith('index.html') && 
        !window.location.pathname.endsWith('register.html')) {
        console.log('User is not logged in, redirecting to login page');
        window.location.href = './index.html';
    } else if (user) {
        console.log('User is logged in');
    }
});



const signupForm = document.querySelector('#signup-form');
const loginForm = document.querySelector('#login-form');

if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fields = [
            document.getElementById('firstName').value,
            document.getElementById('lastName').value,
            document.getElementById('signupEmail').value,
            document.getElementById('signupPassword').value
        ];

        try {
            const response = await signup(fields[0], fields[1], fields[2], fields[3]);
            setFormMessage('signup', "Successfully added user" + response.user.email, true);
            setTimeout(() => {
                window.location.href = './songList.html';
            }, 3000);
        } catch (error) {
            console.error('Error during signup:', error);
            setFormMessage('signup', 'An error occurred during signup. Please try again.', false);
        }
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fields = [
            document.getElementById('email').value,
            document.getElementById('password').value
        ];
        try {
            const response = await login(fields[0], fields[1]);
            setFormMessage('login', "Logged in succesfully!", true);
        } catch (error) {
            console.error('Error during login:', error);
            setFormMessage('login', 'An error occurred during login. Please try again.', false);
        }
    });
}

const logoutBtn = document.getElementById('logout');

if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try{
            await logout();
            userID = null;
            console.log('Successfully logged out');
        }catch(error){
            console.error('Error during logout:', error);
            setFormMessage('logout', 'An error occurred during logout. Please try again.', false);
        }
    });
}

const username_text_box = document.getElementById('username-text');
if (username_text_box) {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const response = await getUserName(user.uid);
            username_text_box.innerText = response;
        } else {
            console.log('User is not logged in');
        }
    });
}

const songList = document.getElementById('song-list');
if(songList){
    await getAllSongs().then((songs) => {
        songs.forEach((song) => {
            const songRow = document.createElement('tr');
            const title = document.createElement('td');
            const artist = document.createElement('td');
            const genre = document.createElement('td');
            const year = document.createElement('td');
            
            const playCell = document.createElement('td');
            const playButton = document.createElement('span');
            playButton.innerText = 'play_arrow';
            playButton.classList.add('material-symbols-outlined');
            playButton.style.cursor = 'pointer';
            playButton.addEventListener('mouseover', () => {
                playButton.style.color = 'red';
            });
            playButton.addEventListener('mouseout', () => {
                playButton.style.transition = 'ease-in 0.5s';
                playButton.style.color = '';
            });
            playButton.addEventListener('click', () => {
                window.open(`https://www.youtube.com/results?search_query=${song.title}+${song.artist}`);
            });
            playCell.appendChild(playButton);



            title.innerText = song.title;
            artist.innerText = song.artist;
            genre.innerText = song.genre;
            year.innerText = song.year;

            songRow.appendChild(title);
            songRow.appendChild(artist);
            songRow.appendChild(genre);
            songRow.appendChild(year);
            songRow.appendChild(playCell);

            const tbody = document.querySelector('tbody');
            tbody.appendChild(songRow);
        });
    });      
}

const songManagerContainer = document.getElementById('song-manager-container');
if(songManagerContainer){
    const songs = await getAllSongs();

    const addSongBtn = document.getElementById('addSongBtn');
    addSongBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await newSong();
    });

    const del_select = document.getElementById('deletable-songs');
    songs.forEach((song) => {
        const option = document.createElement('option');
        option.value = song.id;
        option.innerText = song.title;
        del_select.appendChild(option);
    });

    const deleteSongBtn = document.getElementById('deleteSongBtn');
    deleteSongBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await deleteASong(del_select.value);
    });
    
    const updateForm = document.getElementById('update-song-form');
    const update_select = document.getElementById('update-select');
    songs.forEach((song) => {
        const option = document.createElement('option');
        option.value = song.id;
        option.innerText = song.title;
        update_select.appendChild(option);
    });

    const updateSongBtn = document.getElementById('selectSongToUpdate');
    updateSongBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const song = await getSong(update_select.value);
        updateForm.innerHTML = '';       
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.value = song.title;
        titleInput.id = 'title';
        
        const artistInput = document.createElement('input');
        artistInput.type = 'text';
        artistInput.value = song.artist;
        artistInput.id = 'artist';
        
        const genreInput = document.createElement('input');
        genreInput.type = 'text';
        genreInput.value = song.genre;
        genreInput.id = 'genre';

        const yearInput = document.createElement('input');
        yearInput.type = 'text';
        yearInput.value = song.year;
        yearInput.id = 'year';

        const updateBtn = document.createElement('button');
        updateBtn.innerText = 'Update';
        updateBtn.type = 'button';

        updateForm.appendChild(titleInput);
        updateForm.appendChild(artistInput);
        updateForm.appendChild(genreInput);
        updateForm.appendChild(yearInput);
        updateForm.appendChild(updateBtn);

        updateBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await updateASong(update_select.value, titleInput.value, artistInput.value, genreInput.value, yearInput.value);
        });
    });

}

async function newSong(){
    const songData = [document.getElementById('title').value, 
                    document.getElementById('artist').value, 
                    document.getElementById('genre').value, 
                    document.getElementById('year').value];
    try{
        await addSong(songData[0], songData[1], songData[2], songData[3]);
        setFormMessage('add-song', 'Song added successfully!', true);
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }catch(error){
        console.error('Error during adding song:', error);
        setFormMessage('add-song', 'An error occurred during adding song. Please try again.', false);
    }
}

async function deleteASong(id){
    try{
        await deleteSong(id);
        setFormMessage('delete-song', 'Song deleted successfully!', true);
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }catch(error){
        console.error('Error during deleting song:', error);
        setFormMessage('delete-song', 'An error occurred during deleting song. Please try again.', false);
    }
}

async function updateASong(id, title, artist, genre, year){
    try{
        await updateSong(id, title, artist, genre, year);
        setFormMessage('update-song', 'Song updated successfully!', true);
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }catch(error){
        console.error('Error during updating song:', error);
        setFormMessage('update-song', 'An error occurred during updating song. Please try again.', false);
    }
}
    

function setFormMessage(type, message, positivity) {
    const form = document.getElementById(type + '-form');
    const messageElement = document.createElement('p');
    messageElement.innerText = message;
    const msgStyle = messageElement.style;
    msgStyle.color = (positivity) ? 'green' : 'red';
    msgStyle.fontWeight = 'bold';
    form.appendChild(messageElement);
    setTimeout(() => {
        form.removeChild(messageElement);
    }, 3000);
}