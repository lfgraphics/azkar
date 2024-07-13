const apiUrl = 'https://api.airtable.com/v0/appBoPMjYxqwSDKIm/Data';
const apiToken = 'patnCr19WLGkMZysq.f3f250cf950294b0c3e68a07f95f024575ed84fa4a42b64f9625b6396e41999c';
const headers = {
    Authorization: `Bearer ${apiToken}`,
    'Content-Type': 'application/json'
};

document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');

    if (!userId || !name) {
        window.location.href = '/login.html';
        return;
    }

    document.getElementById('userId').value = userId;
    document.getElementById('name').value = name;

    const today = new Date().toISOString().split('T')[0];
    const dayOfWeek = new Date().getDay();
    if (dayOfWeek === 5) { // Friday
        document.getElementById('waqeaField').style.display = 'block';
    }

    fetch(`${apiUrl}?filterByFormula={userId}='${userId}'`, { headers })
        .then(response => response.json())
        .then(data => {
            if (data.records.length > 0) {
                const todayRecords = data.records.filter(record => record.fields.date === today);
                if (todayRecords.length > 0) {
                } else {
                    console.log("No record found for today.");
                }
                populateForm(todayRecords[0].fields);
                document.getElementById('dailyForm').setAttribute('data-record-id', todayRecords[0].id);
            }
        })
        .catch(error => console.error('Error fetching data:', error));

    document.getElementById('dailyForm').addEventListener('submit', handleSubmit);
});

function populateForm(fields) {
    for (const key in fields) {
        if (fields.hasOwnProperty(key) && document.getElementById(key)) {
            if (typeof fields[key] === "boolean") {
                document.getElementById(key).checked = fields[key];
            } else {
                document.getElementById(key).value = fields[key];
            }
        }
    }
}

function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value === 'on' ? true : value;
    });
    data['data'] = new Date().toISOString().split('T')[0];

    if (confirm(`Please cross Check your Details before confirming as it cna't be updated later\n Details:\n ${JSON.stringify(data, null, 2)}`)) {
        const recordId = document.getElementById('dailyForm').getAttribute('data-record-id');
        const method = recordId ? 'PATCH' : 'POST';
        const url = recordId ? `${apiUrl}/${recordId}` : apiUrl;
        fetch(url, {
            method,
            headers,
            body: JSON.stringify({ fields: data })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('Form submitted successfully!');
            })
            .catch(error => console.error('Error submitting form:', error));
    }
}

function logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    window.location.href = '/login.html'; // Redirect to login page
}