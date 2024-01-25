import api from './apiClient.js';


const accountButton = document.querySelector('.account-button');
const createRecButton = document.querySelector('.create-button');
const searchRecButton = document.querySelector('.search-button');
const savedRecsButton = document.querySelector('.saved-button');
const logoutButton = document.querySelector('.logout-button');
let currentUser;
// api.getCurrentUser().then(user => {
//     let link = document.createElement('a');
//     link.href = '#';
//     link.innerHTML = "Log Out";
//     link.addEventListener("click", e => {
//       e.preventDefault();
//       api.logOut().then(() => {
//         document.location = "/login";
//       });
//     });

//     document.getElementById('user').innerHTML = `${user.first_name} ${user.last_name} (${user.username}) `;
//     document.getElementById('user').appendChild(document.createElement('br'));
//     document.getElementById('user').appendChild(link);
//   })
//   .catch(error => {
//     console.log("We are not logged in");
//     document.location = '/login';
//   });

  //checks if the screen is on a mobile device or not
  function checkIfMobile() {
    if ((window.innerWidth <= 800) && (window.innerHeight <= 600)) {
        return true;
    }

    return false;
}



logoutButton.addEventListener('click', e => {
  api.logOut().then(user => {
    console.log("user is logged out");
    document.location = "/login";
  });
});

//need to get current user for this
accountButton.addEventListener('click', e => {
  api.getCurrentUser().then(user => {
      console.log("currentuser", user);
      currentUser = user;
      document.location = "/current/" + user.username;
  });
});


createRecButton.addEventListener('click', e => {
  document.location = "/createRecipe";
});

//need to set this to be the search for recipes home-ish page
searchRecButton.addEventListener('click', e => {
  document.location = "/home";
});

//should go to current user's saved folders containing all recipes
savedRecsButton.addEventListener('click', e => {
  document.location = "/recipes";
});
  