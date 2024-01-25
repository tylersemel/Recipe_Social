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
    getAccount: (username) => {
        return HTTPClient.get('/users/' + username);
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

    updateUserInformation: (image, name, username, bio) => {
      let data = {
        img: image,
        name: name,
        username: username,
        bio: bio
      }
      return HTTPClient.put('/users/:userId', data);
    },

    getUserFolders: (userId) => {
      return HTTPClient.get(userId + '/folders');
    },

    getFolder: (userId, folderId) => {
      return HTTPClient.get(userId + '/folders/' + folderId);
    },

    getRecipesFromFolder: (userId, folderId) => {
      return HTTPClient.get(userId + '/recipes/' + folderId);
    },
    
    getFollowersOfUserById: (id) => {
      return HTTPClient.get(`/users/${id}/follows`);
    },
    
    getRecipeById: (recipeID) => {
      return HTTPClient.get('/recipes/' + recipeID);
    }
}