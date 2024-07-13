const apiUrl = 'https://api.airtable.com/v0/appBoPMjYxqwSDKIm/users';
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

document.getElementById('userId').addEventListener('blur', () => {
    const userId = document.getElementById('userId').value.trim();
    if (userId) {
        fetch(`${apiUrl}?filterByFormula={userId}='${userId}'`, { headers })
            .then(response => response.json())
            .then(data => {
                const userIdError = document.getElementById('userIdError');
                const forgotPasswordLink = document.getElementById('forgotPasswordLink');
                if (data.records.length > 0) {
                    const user = data.records[0].fields;
                    userIdError.classList.remove('hidden');
                    if (user.name === document.getElementById('name').value.trim()) {
                        forgotPasswordLink.classList.remove('hidden');
                        forgotPasswordLink.href = `https://wa.me/916393440986?&message=forgot%20password%20userid:%20${userId}%2C%20name:%20${user.name}`;
                    } else {
                        forgotPasswordLink.classList.add('hidden');
                    }
                } else {
                    userIdError.classList.add('hidden');
                    forgotPasswordLink.classList.add('hidden');
                }
            })
            .catch(error => console.error('Error fetching user ID:', error));
    }
});

document.getElementById('togglePassword').addEventListener('click', () => {
    const passwordField = document.getElementById('password');
    const toggleButton = document.getElementById('togglePassword');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleButton.textContent = 'Hide';
    } else {
        passwordField.type = 'password';
        toggleButton.textContent = 'Show';
    }
});

document.getElementById('signupForm').addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userId = formData.get('userId').trim();
    const name = formData.get('name').trim();
    const password = stringToHash(formData.get('password').trim()).toString();

    console.log(userId, name, password)

    fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            fields: { userId, name, password }
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Signup successful! You can now login.');
            window.location.href = '/login.html';
        })
        .catch(error => console.error('Error signing up:', error));
});