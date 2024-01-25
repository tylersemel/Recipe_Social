import api from './apiClient.js';

const imageBrowse = document.querySelector('.avatar');
const profilePhoto = document.querySelector('.sender-image');
const name = document.querySelector('.name');
const bio = document.querySelector('.bio');
const editButton = document.querySelector('.edit-button');
const successBox = document.querySelector('#successbox');
let currentUser;

api.getCurrentUser().then(user => {
    populateUserInfo(user);
    currentUser = user;
    console.log("currentuser", currentUser);
});

function populateUserInfo(user) {
    name.value = user.name;
    bio.value = user.bio;
    profilePhoto.value = user.image;
    //image.innerHTML = user.image;
  }

imageBrowse.addEventListener('onchange', e => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
        const senderImage = document.querySelector(".sender-image");
        senderImage.src = reader.result;
    };
});

name.addEventListener('DOMContentLoaded', (e) => {
    e.value = currentUser.name;
});


editButton.addEventListener('click', e => {
    successBox.classList.add("hidden");

    //let name = firstName.value + lastName.value;
    console.log(name);
    // api.updateUserInformation(profilePhoto.value, name.value, username.value, bio.value).then(userData => {
    //     //document.location = ""
    //     console.log("userdata", userData);
    // });
    // catch((err) => {
    //     console.log(err.message);
    //     successBox.classList.remove("hidden");
    //     successBox.innerHTML = err;
    // });
});

