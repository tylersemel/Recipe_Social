import api from './apiClient.js';

const createAccountForm = document.querySelector('.create-user-form');
const username = document.querySelector('.username');
const password = document.querySelector('.password');
const name = document.querySelector('.name');

const previewImage = e => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
    const senderImage = document.querySelector(".sender-image");
    senderImage.src = reader.result;
    };
};


createAccountForm.addEventListener('submit', e => {
    e.preventDefault();
   // document.location = "/home";
    api.createAccount(username.value, password.value, name.value).then(userData => {
        
        document.location = "/login";
      }).catch((err) => {
        document.location = "/createAccount";
      });
});