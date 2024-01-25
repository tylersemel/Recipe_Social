import api from './apiClient.js';

const createAccountBtn = document.querySelector('.create-account-submit');
const username = document.querySelector('.username');
const password = document.querySelector('.password');
const name = document.querySelector('.name');
const errorBox = document.querySelector('#errorbox');
const imageBrowse = document.querySelector('.avatar');
const senderImage = document.querySelector('.sender-image');

imageBrowse.addEventListener('onchange', e => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      senderImage = document.querySelector(".sender-image");
      senderImage.src = reader.result;
    };
});

createAccountBtn.addEventListener('click', e => {
   errorBox.classList.add("hidden");

    api.createAccount(username.value, password.value, name.value).then(userData => {
        
        document.location = "/login";
      }).catch((err) => {
        errorBox.classList.remove("hidden");
        errorBox.innerHTML = err;
        //document.location = "/createAccount";
      });
});