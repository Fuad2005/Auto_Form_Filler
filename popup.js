const container = document.querySelector('.input-els');

// Functions -------------------------------------------------------
function createField(fieldName = '', valueName = '') {
  const newField = document.createElement('div');
  newField.classList.add('d-flex', 'gap-2');
  newField.innerHTML = `
    <input name="field" value="${fieldName}" class="form-control" type="text" placeholder="Enter new field">
    <input name="value" value="${valueName}" class="form-control" type="text" placeholder="Enter value">
    
  `;
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn', 'btn-danger');
  deleteButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
    </svg>
  `
  deleteButton.id = `remove-field-${container.children.length}`;
  newField.appendChild(deleteButton);
  newField.id = `field-${container.children.length}`;
  container.appendChild(newField);

  deleteButton.addEventListener('click', () => {
    container.removeChild(newField);
  });

}

function removeAllFields() {
  Array.from(container.children).forEach((field) => {
    container.removeChild(field);
  });
}

function slugify(str) {
  return str.replace(/ /g, '-')
}


function getData() {
  const data = {};
  Array.from(container.children).forEach((field) => {
    const fieldName = field.querySelector('input[name="field"]').value;
    const fieldValue = field.querySelector('input[name="value"]').value;
    data[fieldName] = fieldValue;
  });
  return data;
}

async function loadProfiles() {
  const data = await loadData(null); // Load all of the profiles
  let profiles = Object.keys(data);
  // console.log(profiles);
  profiles = profiles.filter((profile) => profile !== 'Default-Profile');
  const profilesSelect = document.querySelector('#profile-select');
  profiles.forEach((profile) => {
    const option = document.createElement('option');
    option.value = profile;
    option.textContent = profile;
    profilesSelect.appendChild(option);
  });

}

function loadData(profile) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: 'loadData', data: profile }, (response) => {
      resolve(response);
    });
  });
}


async function updateFields(profile) {
  let data = await loadData(profile);
  // console.log(data)
  data = data[profile] || {};
  if (data && Object.keys(data).length !== 0) {
    removeAllFields();
  }
  Object.keys(data).forEach((key) => {
    createField(key, data[key]);
  });
}


// DOM ------------------------------------------------------------


document.getElementById('add-field').addEventListener('click', () => {
  createField();

});


document.querySelector('#save').addEventListener('click', () => {
  const profile = document.querySelector('#profile-select').value;
  const data = getData();
  console.log(data);
  chrome.runtime.sendMessage({ action: 'saveData', data: { [profile]: data } });


});

document.querySelector('#add-profile').addEventListener('click', () => {
  const profileName = document.querySelector('#new-profile-name').value;
  if (profileName) {
    const profiles = document.querySelector('#profile-select');
    const option = document.createElement('option');
    option.value = slugify(profileName);
    option.textContent = profileName;
    profiles.appendChild(option);
    document.querySelector('#new-profile-name').value = '';
  }

});


document.querySelector('#profile-select').addEventListener('change', () => {
  const profile = document.querySelector('#profile-select').value;
  updateFields(profile);
})






document.addEventListener('DOMContentLoaded', function () {
  const profile = document.querySelector('#profile-select').value;
  updateFields(profile);

  loadProfiles();
});



// chrome.storage.local.clear(function() {
//   console.log('Storage cleared');
//   chrome.runtime.reload();
// });

// Cover letter


document.getElementById('generate-cover-letter-btn').addEventListener('click', () => {
  document.getElementById('cover-letter-form').style.display = 'block';
});

document.getElementById('cancel-cover-letter-btn').addEventListener('click', () => {
  document.getElementById('cover-letter-form').style.display = 'none';
});

document.getElementById('send-cover-letter-btn').addEventListener('click', async () => {
  const jobTitle = document.getElementById('job-title').value;
  const jobPlatform = document.getElementById('ad-platform').value;
  const hirerAddress = document.getElementById('hirer-address').value;
  const previousJobs = document.getElementById('previous-jobs').value;
  const specificSkills = document.getElementById('specific-skills').value;
  const aboutYourself = document.getElementById('about-yourself').value;

  const selectedProfile = document.querySelector('#profile-select').value;
  const allData = await loadData(null);
  const profileData = allData[selectedProfile] || {};

  const name = `${profileData['name'] || 'Your'} ${profileData['surname'] || 'Name'}`;
  const experience = profileData['experience'] || 'Your Experience';
  const email = profileData['email'] || 'Your Email';
  const number = profileData['number'] || 'Your Number';
  const position = profileData['position'] || 'Your position';

  if (!jobTitle || !previousJobs || !aboutYourself || !jobPlatform || !hirerAddress || !specificSkills) {
    alert('Please fill all the fields.');
    return;
  }

  const prompt = `
  Generate a professional and complete cover letter for the job title "${jobTitle}" using only the information provided below.
  - Previous job roles: ${previousJobs}
  - Where I saw the add: ${jobPlatform}
  - Hirer Address: ${hirerAddress}
  - Specific Skills and Tech: ${specificSkills}
  - About me and achievements: ${aboutYourself}
  - Date: ${new Date().toISOString().split('T')[0]}
  - Name: ${name}
  - Experience: ${experience}
  - Email: ${email}
  - Phone number: ${number}
  - Position: ${position}

  Ensure:
  1. The letter is polished and ready to send.
  2. There are no placeholder fields or sections requiring manual input.
  3. Do not include any text requesting additional details, only use the provided data.
  4. Dont make comments about how cover letter should be. Work with the info provided only.
`;


  console.log(prompt);


  try {
    const coverLetter = await sendPromptToGemini(prompt);

    console.log(coverLetter);


    downloadCoverLetter(coverLetter);
  } catch (error) {
    console.error('Error generating cover letter:', error);
    alert('Failed to generate the cover letter.');
  }
});

async function sendPromptToGemini(prompt) {

  const payload = JSON.stringify({
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  });

  const apiKey = 'YOUR_API_KEY';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: payload
  });

  if (!response.ok) {
    throw new Error('Failed to communicate with the API');
  }

  const data = await response.json();
  console.log(data);
  return data?.candidates?.[0]?.content?.parts?.[0]?.text;
}

function downloadCoverLetter(text) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const filename = 'cover_letter.txt';

  chrome.downloads.download({
    url: url,
    filename: filename,
    saveAs: true
  }, () => {
    URL.revokeObjectURL(url);
  });
}
