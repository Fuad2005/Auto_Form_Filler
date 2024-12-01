chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.action === 'getPopupData') {
      const formData = request.data;
      const [pageForm, formElements] = getFormElements();
      let fullname = null
      if (!('surname' in pageForm || 'last_name' in pageForm)) {
           fullname = formData.name + ' ' + formData.surname;
      }
      
      Object.keys(pageForm).forEach((field) => {
        const fieldId = field;
        const fieldValue = formData[fieldId];

        


        if (fieldValue) {
        //   console.log(`${fieldId} : ${fieldValue}`);
          if (fullname && (fieldId.toLowerCase() === 'name' || fieldId.toLowerCase() === 'full_name' || fieldId.toLowerCase() === 'fullname')) {
            formElements[field].value = fullname;
          } 
          else if (fieldId.toLowerCase() === 'first_name' || fieldId.toLowerCase() === 'name' || fieldId.toLowerCase() === 'firstname') {
            formElements[field].value = formData.first_name;
          }
          else if (fieldId.toLowerCase() === 'last_name' || fieldId.toLowerCase() === 'lastname' || fieldId.toLowerCase() === 'surname') {
            formElements[field].value = formData.last_name;
          }
          else if (fieldId.toLowerCase() === 'phone' || fieldId.toLowerCase() === 'number' || fieldId.toLowerCase() === 'phone_number') {
            formElements[field].value = formData.phone;
          }
          
          else {
              formElements[field].value = fieldValue;
          }
        } else {
        //   console.log(`${fieldId} ---------------`);
        }
      });
        
      sendResponse({ message: 'Message received' });
      return true;
    }
  });



function getFormElements() {
    const form = document.querySelector('form');
    const formElements = form.elements;
  
    // Array.from(formElements).forEach(element => {
    //     element.value = 'test';
    //   });
    
    const pageFormData = {};

    Array.from(formElements).forEach(element => {
        if (element.id) {
        pageFormData[element.id] = element.value;
        }
    });

    return [pageFormData, formElements];
  }


  
  //dashboard

document.addEventListener('submit', (event) => {
  event.preventDefault();

  const currentUrl = window.location.href;
  const applicationData = {
    url: currentUrl,
    dateApplied: new Date().toISOString().split('T')[0],
    status: "Pending" 
  };

  chrome.storage.local.get({ applications: [] }, (result) => {
    const applications = result.applications;
    applications.push(applicationData);
    chrome.storage.local.set({ applications });
    console.log("Application saved:", applicationData);
  });
});

