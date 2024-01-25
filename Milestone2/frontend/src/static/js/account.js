import api from './apiClient.js';

//const accountInfo = document.querySelector('#account-info');
//let account = document.location.pathname.split('/')[2];
let currentUser;
const username = document.querySelector('.username');
const bio = document.querySelector('.bio');
const image = document.querySelector('#profile-photo');
const editBioButton = document.querySelector('.edit-bio');

// console.log(account);
// api.getAccount(account).then(acc => {
//     console.log(acc);
// })

api.getCurrentUser().then(user => {
    console.log("currentuser", user);
    createUserInfo(user);
});

editBioButton.addEventListener('click', e => {
    api.updateUserInformation(user.username, bio.value);
});

function createUserInfo(user) {
    username.innerHTML = user.username;
    bio.innerHTML = user.bio;
    image.innerHTML = user.image;
  }