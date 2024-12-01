chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.action === 'getPopupData') {
      const formData = request.data;
      const [pageForm, formElements] = getFormElements();
      let fullname = null
    //   console.log('surname' in pageForm)
      if (!('surname' in pageForm || 'lastname' in pageForm)) {
           fullname = formData.name + ' ' + formData.surname;
      }
      console.log(fullname)
      
      Object.keys(pageForm).forEach((field) => {
        const fieldName = field;
        const fieldValue = formData[fieldName];
  
        if (fieldValue) {
          console.log(`${fieldName} : ${fieldValue}`);
          if (fullname && fieldName === 'name') {
            formElements[field].value = fullname;
          } else {
              formElements[field].value = fieldValue;
          }
        } else {
          console.log(`${fieldName} ---------------`);
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
        if (element.name) {
        pageFormData[element.name] = element.value;
        }
    });

    return [pageFormData, formElements];
  }


  
