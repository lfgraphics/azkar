const apiUrl = 'https://api.airtable.com/v0/appBoPMjYxqwSDKIm';
const apiToken = 'patnCr19WLGkMZysq.f3f250cf950294b0c3e68a07f95f024575ed84fa4a42b64f9625b6396e41999c';
const headers = {
    Authorization: `Bearer ${apiToken}`,
    'Content-Type': 'application/json'
};

function stringToHash(string) {
    return string.split('').reduce((hash, char) => {
        return char.charCodeAt(0) + (hash << 6) + (hash << 16) - hash;
    }, 0);
}

function checkLogin() {
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');
    const loggedIn = localStorage.getItem('loggedIn');

    if (loggedIn && userId && name) {
        window.location.href = '/';
    } else {
        showLoginForm();
    }
}

function showLoginForm() {
    document.getElementById('app').innerHTML = `
                <h1 class="text-2xl font-bold mb-4">Login</h1>
                <form id="loginForm" class="space-y-4">
                    <div>
                        <label class="block font-medium text-gray-700">User ID</label>
                        <input type="text" id="userId" name="userId" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" required>
                    </div>
                    <div>
                        <label class="block font-medium text-gray-700">Password</label>
                        <input type="password" id="password" name="password" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" required>
                    </div>
                    <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md">Login</button>
                    <p id="errorMessage" class="text-red-500 mt-2"></p>
                </form>
        <p class="mt-4">Don't have an account? <a href="/signup.html" class="text-blue-500 underline">Signup here</a></p>
            `;

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

function handleLogin(event) {
    event.preventDefault();
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;
    const hashedPassword = stringToHash(password).toString();

    fetch(`${apiUrl}/users?filterByFormula={userId}='${userId}'`, { headers })
        .then(response => response.json())
        .then(data => {
            if (data.records.length === 0) {
                showError('User ID does not exist.');
            } else {
                const user = data.records[0].fields;
                if (user.password === hashedPassword) {
                    localStorage.setItem('userId', user.userId);
                    localStorage.setItem('name', user.name);
                    localStorage.setItem('loggedIn', 'true');
                    window.location.href = '/';
                } else {
                    showError(`Incorrect password. <a class="text-blue-500 underline" href="https://wa.me/916393440986?&message=forgot%20password%20userid:%20${userId}">Contact Admin to get your password changed</a>`);
                }
            }
        })
        .catch(error => console.error('Error fetching user data:', error));
}

function showError(message) {
    document.getElementById('errorMessage').innerHTML = message;
}

document.addEventListener('DOMContentLoaded', checkLogin);
