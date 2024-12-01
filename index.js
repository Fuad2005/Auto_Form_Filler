// Load applications from Chrome storage and display them
chrome.storage.local.get({ applications: [] }, (result) => {
    const applications = result.applications;
    const applicationList = document.getElementById('applicationList');

    applications.forEach((app, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
        <td><a href="${app.url}" target="_blank">${app.url}</a></td>
        <td>${app.dateApplied}</td>
        <td>
            <select data-index="${index}" class="status-selector">
            <option value="Pending" ${app.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Interview" ${app.status === 'Interview' ? 'selected' : ''}>Interview</option>
            <option value="Offer Received" ${app.status === 'Offer Received' ? 'selected' : ''}>Offer Received</option>
            <option value="Rejected" ${app.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
            </select>
        </td>
        `;

        applicationList.appendChild(row);
    });
});

// Update status in Chrome storage when the user selects a new status
document.addEventListener('change', (event) => {
if (event.target.classList.contains('status-selector')) {
    const index = event.target.dataset.index;
    const newStatus = event.target.value;

    chrome.storage.local.get({ applications: [] }, (result) => {
    const applications = result.applications;
    applications[index].status = newStatus;
    chrome.storage.local.set({ applications });
    console.log("Status updated:", applications[index]);
    });
}
});



