const apiUrl = 'https://api.airtable.com/v0/appBoPMjYxqwSDKIm/Data';
const apiToken = 'patnCr19WLGkMZysq.f3f250cf950294b0c3e68a07f95f024575ed84fa4a42b64f9625b6396e41999c';
const headers = {
    Authorization: `Bearer ${apiToken}`,
    'Content-Type': 'application/json'
};

// Function to fetch and populate All Data tab
function populateAllData() {
    fetch(apiUrl, {
        headers,
        // Adjust query parameters as needed for your Airtable schema
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            const allDataBody = document.getElementById('allDataBody');
            allDataBody.innerHTML = '';

            // Sort records by date in descending order
            data.records.sort((a, b) => {
                if (a.fields.date > b.fields.date) return -1;
                if (a.fields.date < b.fields.date) return 1;
                return 0;
            });

            data.records.forEach(record => {
                const fields = record.fields;
                const row = document.createElement('tr');
                // <td>${fields.userId}</td>
                row.innerHTML = `
                <td>${fields.name}</td>
                <td>${fields.date}</td>
                <td class="${fields.tahajjud ? 'true-checkmark' : 'false-checkmark'}"></td>
                <td class="${fields.yaseen ? 'true-checkmark' : 'false-checkmark'}"></td>
                <td class="${fields.ishraq ? 'true-checkmark' : 'false-checkmark'}"></td>
                <td class="${fields.chasht ? 'true-checkmark' : 'false-checkmark'}"></td>
                <td class="${fields.laIlahIlallah ? 'true-checkmark' : 'false-checkmark'}"></td>
                <td class="${fields.astaghfar ? 'true-checkmark' : 'false-checkmark'}"></td>
                <td class="${fields.daroodShareef ? 'true-checkmark' : 'false-checkmark'}"></td>
                <td class="${fields.Allah ? 'true-checkmark' : 'false-checkmark'}"></td>
                <td class="${fields.tilawateQuraan ? 'true-checkmark' : 'false-checkmark'}"></td>
                <td class="${fields.awwabeen ? 'true-checkmark' : 'false-checkmark'}"></td>
                <td class="${fields.waqea ? 'true-checkmark' : 'false-checkmark'}"></td>
                <td class="${fields.mulk ? 'true-checkmark' : 'false-checkmark'}"></td>
                <td class="${fields.kahaf ? 'true-checkmark' : 'false-checkmark'}"></td>
                <td>${fields.totalPoints}</td>
            `;
                allDataBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching all data:', error));
}

// Function to fetch and populate Analysis tab
function populateAnalysis() {
    fetch(`${apiUrl}?view=Grid%20view`, { headers })
        .then(response => response.json())
        .then(data => {
            const analysisBody = document.getElementById('analysisBody');
            analysisBody.innerHTML = '';

            const usersMap = new Map(); // To store unique users and their total points

            data.records.forEach(record => {
                const fields = record.fields;
                const userId = fields.userId;
                const totalPoints = fields.totalPoints || 0;

                if (usersMap.has(userId)) {
                    usersMap.set(userId, usersMap.get(userId) + totalPoints);
                } else {
                    usersMap.set(userId, totalPoints);
                }
            });

            usersMap.forEach((points, userId) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                            <td>${userId}</td>
                            <td>${data.records.find(record => record.fields.userId === userId)?.fields.name || '-'}</td>
                            <td>${points}</td>
                        `;
                analysisBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching analysis data:', error));
}

// Function to switch between tabs
function openTab(evt, tabName) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    const activeTab = document.getElementById(tabName);
    activeTab.classList.add('active');

    if (tabName === 'allData') {
        populateAllData();
    } else if (tabName === 'analysis') {
        populateAnalysis();
    }
}

// Initial load: Populate All Data tab
populateAllData();