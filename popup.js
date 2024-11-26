document.getElementById('add-profile').addEventListener('click', () => {
    const profileName = prompt('Enter a name for the new profile:');
    if (profileName) {
      let profiles = JSON.parse(localStorage.getItem('profiles')) || [];
      profiles.push(profileName);
      localStorage.setItem('profiles', JSON.stringify(profiles));
      updateProfileDropdown(profiles);
    }
  });
  

  function updateProfileDropdown(profiles) {
    const profileSelect = document.getElementById('profile-select');
    profileSelect.innerHTML = ''; 
    profiles.forEach(profile => {
      const option = document.createElement('option');
      option.value = profile;
      option.textContent = profile;
      profileSelect.appendChild(option);
    });
  }
  

  document.getElementById('save-field').addEventListener('click', () => {
    const field = document.getElementById('field-input').value;
    if (field) {
      let fields = JSON.parse(localStorage.getItem('fields')) || [];
      fields.push(field);
      localStorage.setItem('fields', JSON.stringify(fields));
      updateFieldsList(fields);
      document.getElementById('field-input').value = ''; 
    }
  });
  

  function updateFieldsList(fields) {
    const fieldsList = document.getElementById('fields-list');
    fieldsList.innerHTML = '';
    fields.forEach(field => {
      const li = document.createElement('li');
      li.textContent = field;
      fieldsList.appendChild(li);
    });
  }
  

  document.addEventListener('DOMContentLoaded', () => {
    const profiles = JSON.parse(localStorage.getItem('profiles')) || [];
    updateProfileDropdown(profiles);
  
    const fields = JSON.parse(localStorage.getItem('fields')) || [];
    updateFieldsList(fields);
  });
  