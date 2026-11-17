const form = document.getElementById('task-form');
const formWrapper = document.getElementById('form-wrapper');

const inputName = document.getElementById('fullname');
const inputEmail = document.getElementById('email');
const inputPhone = document.getElementById('phone');
const inputDob = document.getElementById('dob');
const selectCourse = document.getElementById('course');
const inputNote = document.getElementById('note');

const previewName = document.getElementById('preview-name');
const previewEmail = document.getElementById('preview-email');
const previewCourse = document.getElementById('preview-course');
const previewLevel = document.getElementById('preview-level');
const previewNote = document.getElementById('preview-note');

function updateLevel() {
    const checkedLevel = document.querySelector('input[name="level"]:checked');
    if (checkedLevel) {
        previewLevel.textContent = checkedLevel.value;
    }
}

inputName.addEventListener('input', () => previewName.textContent = inputName.value);
inputEmail.addEventListener('input', () => previewEmail.textContent = inputEmail.value);
selectCourse.addEventListener('change', () => previewCourse.textContent = selectCourse.value);
inputNote.addEventListener('input', () => previewNote.textContent = inputNote.value);

document.querySelectorAll('input[name="level"]').forEach(radio => {
    radio.addEventListener('change', updateLevel);
});

form.addEventListener('submit', function(event) {
    event.preventDefault(); 

    const formData = {
        name: inputName.value,
        email: inputEmail.value,
        phone: inputPhone.value,
        dob: inputDob.value,
        course: selectCourse.value,
        level: document.querySelector('input[name="level"]:checked').value,
        note: inputNote.value
    };

    
    let savedList = JSON.parse(localStorage.getItem('formSubmissions')) || [];
    
    
    savedList.push(formData);
    
    
    localStorage.setItem('formSubmissions', JSON.stringify(savedList));

    
    formWrapper.style.display = 'none';
    alert("The form has been successfully submitted.");
});