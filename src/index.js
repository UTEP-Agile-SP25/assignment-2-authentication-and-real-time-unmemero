import { signup } from './auth.js';

const signupForm = document.querySelector('#signup-form');

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
    } catch (error) {
        console.error('Error during signup:', error);
        setFormMessage('signup', 'An error occurred during signup. Please try again.', false);
    }
});

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