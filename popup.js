const notification = document.getElementById("notification");

// document.getElementById('add-profile').addEventListener('click', () => {
//     const profileName = prompt('Enter a name for the new profile:');
//     if (profileName) {
//       let profiles = JSON.parse(localStorage.getItem('profiles')) || [];
//       profiles.push(profileName);
//       localStorage.setItem('profiles', JSON.stringify(profiles));
//       updateProfileDropdown(profiles);
//     }
//   });
  

  // function updateProfileDropdown(profiles) {
  //   const profileSelect = document.getElementById('profile-select');
  //   profileSelect.innerHTML = ''; 
  //   profiles.forEach(profile => {
  //     const option = document.createElement('option');
  //     option.value = profile;
  //     option.textContent = profile;
  //     profileSelect.appendChild(option);
  //   });
  // }
  


  // document.addEventListener('DOMContentLoaded', () => {
  //   const profiles = JSON.parse(localStorage.getItem('profiles')) || [];
  //   updateProfileDropdown(profiles);
  
  //   const fields = JSON.parse(localStorage.getItem('fields')) || [];
  //   updateFieldsList(fields);
  // });






const container = document.querySelector('.input-els');


function createField() {
  const newField = document.createElement('div');
  newField.classList.add('d-flex', 'gap-2');
  newField.innerHTML = `
    <input name="field" class="form-control" type="text" placeholder="Enter new field">
    <input name="value" class="form-control" type="text" placeholder="Enter value">
  `;

  newField.id = `field-${container.children.length}`;
  container.appendChild(newField);

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



// async function loadData() {
//   const profile = document.querySelector('#profile-select').value;
//   const response = await chrome.runtime.sendMessage({ action: 'loadData', profile });
//   return response;
// }
async function loadData() {
  const profile = document.querySelector('#profile-select').value;
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: 'loadData', profile }, (response) => {
      resolve(response);
    });
  });
}


document.getElementById('add-field').addEventListener('click', () => {
  createField();
  
});


document.querySelector('#save').addEventListener('click', () => {
  const profile = document.querySelector('#profile-select').value;
  const data = getData();
  console.log(data);
  chrome.runtime.sendMessage({ action: 'saveData', data: { [profile]: data } });
  

});





document.addEventListener('DOMContentLoaded', async function () {
  const data = await loadData();
  console.log(data)
});

//Extract data as json
exportDataButton.addEventListener('click', function () {
  chrome.storage.local.get(null, (data) => {
      if (data && Object.keys(data).length > 0) {
          const jsonString = JSON.stringify(data, null, 2);
          const blob = new Blob([jsonString], { type: "application/json" });
          const url = URL.createObjectURL(blob);

          chrome.downloads.download({
              url: url,
              filename: 'AllProfilesData.json',
              saveAs: true 
          }, function () {
              URL.revokeObjectURL(url);
          });

      } else {
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000); 
    }
  });
});
