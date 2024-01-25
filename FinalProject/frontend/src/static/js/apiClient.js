const API_BASE = '/api/v1';

const handleError = (res) => {
  if(!res.ok) {
    if(res.status == 401) {
      throw new Error("Authentication error");
    }
    else {
      throw new Error("Error")
    }
  }
  return res;
};


const HTTPClient = {
  get: (url) => {
    console.log("url", url);
    return fetch(API_BASE + url, {
      headers: {
      }
    }).then(handleError).then(res => {
      return res.json();
    });
  },

  post: (url, data) => {
    console.log("url", url);
    console.log("data", data);
    return fetch(`${API_BASE}${url}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(handleError).then(res => {
      return res.json();
    });
  },

  put: (url, data) => {
    return fetch(API_BASE + url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(handleError).then(res => {
      return res.json();
    });

  },

  delete: (url) => {
    return fetch(API_BASE + url, {
      method: 'DELETE',
      headers: {
      }
    }).then(handleError).then(res => {
      return res.json();
    });
  },
  };

export default {
    getAccount: (userId) => {
        return HTTPClient.get('/users/' + userId);
    },

    createAccount: (username, password, name) => {
      let data = {
        username: username,
        password: password,
        name: name
      }
      return HTTPClient.post('/users', data);
    },

    logIn: (username, password) => {
      let data = {
        username: username,
        password: password
      }
      return HTTPClient.post('/users/login', data);
    },
  
    logOut: () => {
      return HTTPClient.post('/users/logout', {});
    },

    getCurrentUser: () => {
      return HTTPClient.get('/users/current/user');
    },

    updateUserInformation: (userId, image, name, bio) => {
      let data = {
        img: image,
        name: name,
        bio: bio
      }
      return HTTPClient.put('/users/' + userId, data);
    },

    getUserFolders: (userId) => {
      return HTTPClient.get('/' + userId + '/folders');
    },

    getFolder: (userId, folderId) => {
      return HTTPClient.get('/' + userId + '/folders/' + folderId);
    },

    getRecipesFromFolder: (userId, folderId) => {
      return HTTPClient.get('/' + userId + '/recipes/' + folderId);
    },

    getSavedRecipesFromUser: (userId) => {
      return HTTPClient.get('/' + userId + '/savedRecipes');
    },

    getRecipesByUserByTag: (userId, tagId) => {
      return HTTPClient.get('/users/' + userId + '/tags/' + tagId + '/recipes');
    },

    getTags: () => {
      return HTTPClient.get('/tags');
    },

    getTagById: (tagId) => {
      return HTTPClient.get('/tags/' + tagId);
    },
    
    //who the user is following
    getFollowingOfUserById: (userId) => {
      return HTTPClient.get('/users/' + userId + '/targets');
    },

    //who is followers of user
    getFollowersOfUserById: (userId) => {
      return HTTPClient.get('/users/' + userId + '/follows');
    },

    createUserFollowRelation: (userId, targetId) => {
      return HTTPClient.post('/users/' + userId + '/targets/' + targetId)
    }, 
    
    getRecipeById: (recipeID) => {
      return HTTPClient.get('/recipes/' + recipeID);
    },

    createRecipe: (recipe) => {
      // let data = {
      //   recipe_name: name,
      //   recipe_description: description,
      //   instruction: instruction,
      //   image: image,
      //   public: isPublic,
      //   recipe_time: time,
      //   ingredient_measurement: ingredient_measurement,
      //   ingredient_amount: ingredient_amount,
      //   ingredient_name: ingredient_name,
      //   tags: tags,
      // }
      
      return HTTPClient.post('/recipes', recipe);
    }
}