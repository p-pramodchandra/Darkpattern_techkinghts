let list = document.getElementById('emailList');
let loading = document.getElementById('loading');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let emails = request.emails;

    loading.style.display = 'none';

    if (emails == null || emails.length === 0) {
        let li = document.createElement('li');
        li.innerText = "No emails found";
        list.appendChild(li);
    } else {
        emails.forEach((email) => {
            let li = document.createElement('li');
            li.innerText = email;
            list.appendChild(li);
        });
    }
});

async function sendEmailsToBackend(emails) {
    try {
        const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ emails: emails })
        });

        if (!response.ok) {
            throw new Error('Failed to send emails to backend');
        }

        const data = await response.json();
        return data.predicted_class; // Assuming the backend returns predicted class
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    list.innerHTML = ''; // Clear previous results
    loading.style.display = 'block';

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: scrapeEmailsFromPage,
    });
});

function scrapeEmailsFromPage() {
    const textContentRegEx = />([^<]+)</g;
    let matches;
    let emails = [];

    while ((matches = textContentRegEx.exec(document.body.innerHTML)) !== null) {
        emails.push(matches[1].trim());
    }

    // Send scraped emails to the backend for prediction
    sendEmailsToBackend(emails)
        .then(predictedClass => {
            console.log('Predicted Class:', predictedClass);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
