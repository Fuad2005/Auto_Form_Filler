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



document.getElementById('add-field').addEventListener('click', () => {
  createField();
  const data = getData();
  console.log(data);
  
  
});


document.querySelector('#save').addEventListener('click', () => {
  const profile = document.querySelector('#profile-select').value;
  const data = getData();
  console.log(data);
  chrome.runtime.sendMessage({ action: 'saveData', data: { [profile]: data } });
  

});