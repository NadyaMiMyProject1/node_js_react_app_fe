export const setFirstnameError = (mokinisId, value) => {
    if (value)
      document.getElementById(`firstName_${mokinisId}`).classList.add('is-danger');
    else
      document.getElementById(`firstName_${mokinisId}`).classList.remove('is-danger');
  };
  
  export const setLastnameError = (mokinisId, value) => {
    if (value)
      document.getElementById(`lastName_${mokinisId}`).classList.add('is-danger');
    else
      document.getElementById(`lastName_${mokinisId}`).classList.remove('is-danger');
  };
  
  export const setEmailError = (mokinisId, value) => {
    if (value)
      document.getElementById(`email_${mokinisId}`).classList.add('is-danger');
    else
      document.getElementById(`email_${mokinisId}`).classList.remove('is-danger');
  };
  
  export const setBirth_dateError = (mokinisId, value) => {
    if (value)
      document.getElementById(`birth_date_${mokinisId}`).classList.add('is-danger');
    else
      document.getElementById(`birth_date_${mokinisId}`).classList.remove('is-danger');
  };