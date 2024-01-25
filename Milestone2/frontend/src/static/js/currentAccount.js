import api from './apiClient.js';

const name = document.querySelector('.name');
const username = document.querySelector('.username');
const bio = document.querySelector('.bio');
const image = document.querySelector('#profile-photo');
const editProfileButton = document.querySelector('.edit-button');
let currentUser;

api.getCurrentUser().then(user => {
    createUserInfo(user);
    currentUser = user;
    console.log("currentuser", currentUser);
});

editProfileButton.addEventListener('click', e => {
    //api.updateUserInformation(user.username, bio.value);
    document.location = "/current/" + currentUser.username + "/editProfile";
});

function createUserInfo(user) {
    name.innerHTML = user.name;
    username.innerHTML = '@' + user.username;
    bio.innerHTML = user.bio;
    image.innerHTML = user.image;
  }