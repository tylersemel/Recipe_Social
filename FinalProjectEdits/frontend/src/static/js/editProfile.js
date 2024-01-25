import api from './apiClient.js';

const imageBrowse = document.querySelector('.avatar');
const profilePhoto = document.querySelector('.sender-image');
const name = document.querySelector('.name');
const bio = document.querySelector('.bio');
const editButton = document.querySelector('.edit-button');
const successBox = document.querySelector('#successbox');
let currentUser;

imageBrowse.addEventListener('onchange', e => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
        const senderImage = document.querySelector(".sender-image");
        senderImage.src = reader.result;
    };
});

api.getCurrentUser().then(user => {

    currentUser = user;
    console.log("currentuser", currentUser);

    api.getAccount(currentUser.id).then(user => {
        createUserInfo(user);
    });
});

function createUserInfo(user) {
    name.value = user.name;
    bio.value = user.bio;
    profilePhoto.value = user.image;
    //image.innerHTML = user.image;
    }

editButton.addEventListener('click', e => {
    successBox.classList.add("hidden");

    console.log(name.value);
    api.updateUserInformation(currentUser.id, profilePhoto.value, name.value, bio.value).then(userData => {
        //document.location = ""
        successBox.classList.remove("hidden");
        successBox.innerHTML = "Success! You have updated your profile.";
        console.log("userdata", userData);
    }).catch((err) => {
        console.log(err.message);
    });
});

