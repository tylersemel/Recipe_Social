import api from './apiClient.js';

const loginButton = document.querySelector('.login-submit');
const username = document.querySelector('.login-username');
const password = document.querySelector('.login-password');
const errorBox = document.querySelector('#errorbox');

loginButton.addEventListener('click', e => {
 // e.preventDefault();

  errorBox.classList.add("hidden");

    api.logIn(username.value, password.value).then(userData => {
        document.location = "/home";
        console.log("user", username.value);
        console.log("userdata", userData);
      }).catch((err) => {
        errorBox.classList.remove("hidden");
        errorBox.innerHTML = err;
      });
});