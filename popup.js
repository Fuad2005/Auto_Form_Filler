const notification = document.querySelector('#notification');
const container = document.querySelector('.input-els');
const requiredFields = ['name', 'surname', 'email', 'address']

// Functions -------------------------------------------------------





function createDefFields() {
  const fieldNames = ['name', 'surname', 'email', 'address', 'number', 'position', 'experience'];
  fieldNames.forEach((fieldName) => {
    createField(fieldName);
  });
}


function createField(fieldName='', valueName='') {
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
  const fieldInput = newField.querySelector('input[name="field"]');
  if (requiredFields.includes(fieldInput.value)) {
    newField.id = `field-${container.children.length}`;
    container.appendChild(newField);
  } else {
    deleteButton.id = `remove-field-${container.children.length}`;
    newField.appendChild(deleteButton);
    newField.id = `field-${container.children.length}`;
    container.appendChild(newField);
  
    deleteButton.addEventListener('click', () => {
      container.removeChild(newField);
    });
  }

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
    const fieldName = field.querySelector('input[name="field"]').value.trim();
    const fieldValue = field.querySelector('input[name="value"]').value.trim();
    data[fieldName] = fieldValue;
  });

  if (Object.values(data).some((value) => value === '')) {
    return 'Error: Some fields are empty.';
  } else {
    return data;
  }

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
    Object.keys(data).forEach((key) => {
      createField(key, data[key]);
    });
  } else {
    removeAllFields();
    createDefFields();
  }
}


// DOM ------------------------------------------------------------


document.getElementById('add-field').addEventListener('click', () => {
  createField();
  
});


document.querySelector('#save').addEventListener('click', () => {
  const profile = document.querySelector('#profile-select').value;
  const data = getData();
  console.log(data);
  if (typeof data === 'string') {
    notification.textContent = data;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
      notification.textContent = '';

    }, 3000); 
    

  } else {
    chrome.runtime.sendMessage({ action: 'saveData', data: { [profile]: data } });

  }
  

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