import api from './apiClient.js';

//who is following the user
const followers = document.querySelector('.followers');

//who the user follows
const following = document.querySelector('.following');
let userId = document.location.pathname.split('/')[2];
console.log("userid", userId);
let isCurrentUser = false;
let realUser;

api.getCurrentUser().then(current => {    
    if (current.id == userId) {
        isCurrentUser = true;
    }

    api.getAccount(userId).then(user => {
        realUser = user;
        console.log(realUser);

        //who the user is following
        api.getFollowingOfUserById(realUser.id).then(follows => {
            follows.forEach(follow => {
                following.append(createFollowHTML(follow));
            });      
        }); 

        //who the user is following
        api.getFollowersOfUserById(realUser.id).then(follows => {
            follows.forEach(follow => {
                followers.append(createFollowHTML(follow));
            });       
        }); 
    });
}).catch(err => {
    // api.logOut().then(user => {
    //     console.log("user is logged out");
    //     document.location = "/login";
    //   });
    // document.location = "/";
});

function createFollowHTML(follow) {
    const item = document.createElement('a');
    item.classList.add('follow');
    //item.href = '/users?=' + follow;
 
   const followName = document.createElement('div');
    
   api.getAccount(follow).then(user => {
        item.href = '/users/' + user.id;
        console.log(user.id);
        followName.innerHTML = '@' + user.username;     
    }); 

    item.appendChild(followName);

    return item; 
}