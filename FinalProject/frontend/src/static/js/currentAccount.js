import api from './apiClient.js';

const name = document.querySelector('.name');
const username = document.querySelector('.username');
const bio = document.querySelector('.bio');
const image = document.querySelector('#profile-photo');
const editProfileButton = document.querySelector('#edit-button');
const followButton = document.querySelector('#follow-button');
const recipesList = document.querySelector('.recipes-list');
const filterRecipes = document.querySelector('#filter');

//who is following the user
const followers = document.querySelector('.followers');
//who the user follows
const following = document.querySelector('.following');

const savedRecipesFolderId = 1;

let usr = document.location.pathname.split('/')[2];
console.log("userid", usr);
let realUser;
let currentUser;
let isCurrentUser;
let isStart = true;

console.log("usr", usr);

api.getCurrentUser().then(current => {    
    //if the current user, the follow button should not be displayed, the edit button should
    if (current.id == usr) {
        isCurrentUser = true;
        currentUser = current;
        followButton.style.display = "none";
        editProfileButton.classList.remove("hidden");

        if (isStart || filterRecipes.value == "No filter") {
            console.log("id", current.id);
            api.getSavedRecipesFromUser(current.id).then(recipes => {
                console.log("Recipes", recipes);
                recipes.forEach(recipe => {
                    console.log("Recipe", recipe);
                    recipesList.append(createRecipeHTML(recipe));
                });
            });        
        }

    }
    else {
        editProfileButton.style.display = "none";
    }

    api.getAccount(usr).then(user => {
        realUser = user;
        console.log("Real user", realUser)
        createUserInfo(user); //create html for user page

        updateFollowerCount(realUser.id);

        //make current user follow other real user
        followButton.addEventListener('click', e => {
            api.createUserFollowRelation(current.id, user.id).then(e => {
                updateFollowerCount(user.id);
                document.location = "/users/" + user.id; 
                followButton.style.display = "none";
            })
        });
            
        //populate tags in dropdown list
        api.getTags().then(tags => {
            tags.forEach(tag => {
                filterRecipes.append(createTagHTML(tag));
            })       
        }); 

        console.log("current id", current.id);

        //if the current user is following user, return true, hide follow btn
        if (isCurrentFollowingUser(current.id, user.id)) {
            followButton.style.display = "none";
        }
        else {
            console.log("display button pls");
            followButton.classList.remove("hidden");
        }

        // if (filterRecipes.value == "No filter") {
        //     clearRecipeHTML();
            
        //     api.getSavedRecipesFromUser(user.id).then(recipes => {
        //         recipes.forEach(recipe => {
        //             recipesList.append(createRecipeHTML(recipe));
        //         });
            
        // }); 

        //filter by the recipe tag
        filterRecipes.addEventListener('change', e => {
            isStart = false;

            if (filterRecipes.value == "No filter") {
                clearRecipeHTML();
                
                api.getSavedRecipesFromUser(user.id).then(recipes => {
                    recipes.forEach(recipe => {
                        recipesList.append(createRecipeHTML(recipe));
                    });
                
                });        
            }
            api.getTags().then(tags => {
                tags.forEach(tag => {
                    console.log("realuser", user.id);
                    if (tag[0].name == filterRecipes.value) {
                        clearRecipeHTML();
    
                        api.getRecipesByUserByTag(user.id, tag[0].id).then(recipes => {
                            recipes.forEach(recipe => {
                                console.log("Recipe", recipe);
                                console.log("tag", tag[0]);
                                recipesList.append(createRecipeHTML(recipe));
                            })      
                        }); 
                    }
                    
                })       
            });           
        });
    }).catch((err) => {
        //document.location = "/offline";
    });

}).catch(err => {
    // api.logOut().then(user => {
    //     console.log("user is logged out");
    //     document.location = "/login";
    //   });
    // document.location = "/";
});

function isCurrentFollowingUser(currentId, userId) {
    if (currentId != userId) {
        api.getFollowingOfUserById(currentId).then(follows => {
            follows.forEach(follow => {
                console.log("currentId", currentId);
                console.log("current follows", follow);
                console.log("userId", userId);
                if (follow == userId) {     
                    followButton.style.display = "none";
                    return true;
                }
            });
        }); 
    }
    else {
      followButton.style.display = "none";
    }

    return false;
}

//update the follower count for a user's page
function updateFollowerCount(realUserId) {
    //who the user is following
    api.getFollowingOfUserById(realUserId).then(follows => {
        console.log("following", following.hasAttribute('follow'));
        following.append(createFollowHTML(realUserId, follows));   
            
    });  

    //who the user is following
    api.getFollowersOfUserById(realUserId).then(follows => {
        console.log("followers", follows.length);
        followers.append(createFollowHTML(realUserId, follows));      
    });            
}

function createFollowHTML(userId, follows) {
    const item = document.createElement('a');
    item.classList.add('follow');
    item.href = "/users/" + userId + "/followsList";
    console.log("href", item.href);
    const amt = document.createElement('div');
    amt.innerHTML = follows.length;

    item.appendChild(amt);

    return item; 
}

function createTagHTML(tag) {
    const tagName = document.createElement('option');
    tagName.innerHTML= tag[0].name;
    //console.log("Tag name", tag[0].name);

    return tagName; 
}

function createRecipeHTML(recipe) {
    const item = document.createElement('a');
    item.classList.add('recipe');
    item.href = '/recipe/?id=' + recipe.id;

    const recipeImage = document.createElement('img');
    
    if (!recipe.image) {
        recipeImage.src = "/img/recipe-placeholder-1.png";
    }
    else {
        recipeImage.src = recipe.image;
    }

    const recipeName = document.createElement('div');
    recipeName.innerHTML= recipe.name;

    item.appendChild(recipeImage);
    item.appendChild(recipeName);

    return item;
}



//reset the page of recipes
function clearRecipeHTML() {
  recipesList.innerHTML = '';
}

editProfileButton.addEventListener('click', e => {
    if (isCurrentUser) {
        document.location = '/users/' + currentUser.id + '/editProfile';
        editProfileButton.classList.remove("hidden");
    }
});

function createUserInfo(user) {
    name.innerHTML = user.name;
    username.innerHTML = '@' + user.username;
    bio.innerHTML = user.bio;
    image.innerHTML = user.image;
}