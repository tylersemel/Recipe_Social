import api from './apiClient.js';

const accountButton = document.querySelector('.account-button');
// const createRecButton = document.querySelector('.create-button');
// const searchRecButton = document.querySelector('.search-button');
// const savedRecsButton = document.querySelector('.saved-button');

//need to get current user for this
// accountButton.addEventListener('click', e => {
//     api.getCurrentUser().then(user => {
//         console.log("currentuser", user);
//         //document.location = "/current/" + user.username;
//         document.location = "/current/" + user.username;
//     });
// });

// createRecButton.addEventListener('click', e => {
//     document.location = "/createRecipe";
// });

// //need to set this to be the search for recipes home-ish page
// searchRecButton.addEventListener('click', e => {
//     document.location = "/home";
// });

// //should go to current user's saved folders containing all recipes
// savedRecsButton.addEventListener('click', e => {
//     document.location = "/recipes";
// });
