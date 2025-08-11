import { showFeedback } from './sharedFunctions.js';

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    try {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const response = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });
    const responseBody = await response.json();
    console.log(responseBody);
    localStorage.setItem('jwttoken', responseBody.token);
    showFeedback(responseBody);
    if (responseBody.success === true) {
        window.location.href= "./overview.html"
    }
    } catch (error) {
        console.error(error);
    }
});
