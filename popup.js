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





document.addEventListener('DOMContentLoaded', async function () {
  const data = await loadData();
  console.log(data)
});



// chrome.storage.local.clear(function() {
//   console.log('Storage cleared');
//   chrome.runtime.reload();
// });