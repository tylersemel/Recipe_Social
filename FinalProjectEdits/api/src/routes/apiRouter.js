const express = require('express');
const multer = require('multer');
const upload = multer({dest: 'static/uploads/'});
const apiRouter = express.Router();

const cookieParser = require('cookie-parser');
apiRouter.use(cookieParser());

apiRouter.use(express.json());

const userDAO = require('../db/UserDAO');
const recipeDAO = require('../db/RecipeDAO');

const {TokenMiddleware, generateToken, removeToken} = require('../middleware/TokenMiddleware');

//get a specific user from the database
apiRouter.get('/users/:userId', TokenMiddleware, (req,  res) => {
    let userId = req.params.userId;
    userDAO.getUserById(userId).then(user => {
        if (user) {
          res.json(user);
        }
        else {
          res.status(404).json({error: 'Account not found'});
        }
      });

  });

//update the specific user's information
apiRouter.put('/users/:userId', TokenMiddleware, (req,  res) => {
    let userId = req.params.userId;
    let bio = req.body.bio;
    let image = req.body.img;
    let name = req.body.name;

    console.log(userId);
    
    userDAO.getUserById(userId).then(usr => {
      if (usr) {
        userDAO.updateUserBio(userId, bio);
        userDAO.updateUserImage(userId, image);
        userDAO.updateUserName(userId, name);
        res.json(usr);
      }
    });
  });

apiRouter.post('/users/login', (req,  res) => {
  if(req.body.username  && req.body.password) {
    userDAO.getUserByCredentials(req.body.username, req.body.password).then(user => {
      let result = {
        user: user
      }

      generateToken(req, res, user);

      res.json(result);
    }).catch(err => {
      console.log("in users/login err");
      res.status(400).json({error: 'Incorrect username or password'});
    });
  }
  else {
    console.log("in users/login not auth");
    res.status(401).json({error: 'Not authenticated'});
  }
});

  //logout current user
apiRouter.post('/users/logout', (req,  res) => {
    removeToken(req, res);
  
    res.json({success: true});
  });

  //get current user
apiRouter.get('/users/current/user', TokenMiddleware, (req,  res) => {
  console.log(req.user);  
  res.json(req.user);
});

//add users to the users table in the database
apiRouter.post('/users', (req, res) => {
  console.log("in users post");  
  
  let username = req.body.username;
  let password = req.body.password;
  let name = req.body.name;

  console.log(req.body);

  if (username && password && name) {
      userDAO.createUser(username, password, name).then(user => {
          console.log(user);
          res.json({results: user});
      }).catch(err => {
          res.status(400).json({error: err});
      });
      
  }
  else {
      res.status(400).json({error: 'Input invalid'});
  }

    // if (account) {
    //     res.status(404).json({error: 'Choose different username'});
    // }
    // else {
    //     db.createAccount();
    //     res.status(200).send("Account created successfully");
    // }
  });

  //get a specific user's recipes 
apiRouter.get('/:userId/recipes', TokenMiddleware, (req, res) => {
    let userId = req.params.userId;
    recipeDAO.getRecipesByUser(userId).then(recipes => {
        console.log(recipes);
        res.json(recipes);
    });
  });

  //get a specific user's folders that contain recipes
apiRouter.get('/:userId/folders', TokenMiddleware, (req, res) => {
  let userId = req.params.userId;
  recipeDAO.getAllUserFolders(userId).then(folders => {
    console.log(folders);
    res.json(folders);
  });
});

//get a specific user's recipes from a folder
apiRouter.get('/:userId/recipes/:folder', TokenMiddleware, (req,  res) => {
    let userId = req.params.userId;
    let folder = req.params.folder;
    console.log("in get recipes from folder");
    recipeDAO.getRecipesInFolder(userId, folder).then(recipes => {
      console.log("returned recipes", recipes);
      res.json(recipes);
    });
  });

  //get a specific user's specific folder
apiRouter.get("/:userId/folders/:folderId", TokenMiddleware, (req, res) => {
    let userId = req.params.userId;
    let folder = req.params.folderId;

    if (userId) {
      recipeDAO.getFolderById(folder).then(folder => {
        res.json(folder);
      });
    }
    else {
      res.status(404).json({error: "Access denied"});
    }
});

apiRouter.get("/:userId/savedRecipes",  (req, res) => {
  let userId = req.params.userId;

  if (userId) {
    recipeDAO.getSavedRecipesFolder(userId).then(recipes => {
      res.json(recipes);
    });
  }
  else {
    res.status(404).json({error: "Access denied"});
  }
});

//create a specific user's folder from a list of recipes
  apiRouter.post('/:userId/recipes/:folder', TokenMiddleware, (req, res) => {
    let userId = req.params.userId;
    let folder = {
      name: req.body.name,
      img: req.body.img,
      numRecipes: req.body.num_recipes,
    }

    recipeDAO.createFolder(userId, folder).then(folder => {
      res.json(folder);
    })
  });

// apiRouter.get('/:userId/recipes/:folder/:id', (req,  res) => {
//     let userId = req.params.userId;
//     let folder = req.params.folder;
//     let id = req.params.id;
//     let user = userRecipes.users.find(account => account.username == userId);
//     let recipes = user.recipefolders.find(folderName => folderName.foldername == folder);
//     let recipe = recipes.recipes.find(rec => rec.recipename == id);

//     if (recipe) {
//         res.json(recipe);
//     }
//     else {
//         res.status(404).json({error: 'No recipe found'});
//     }
//   });

//get all the recipes in the database
apiRouter.get('/recipes', TokenMiddleware, (req,  res) => {
    recipeDAO.getRecipes().then(recipes => {
        res.json(recipes);
    });
  });

  //add a recipe to the list of recipes in the database
apiRouter.post('/recipes', TokenMiddleware, upload.single('recipe_image'), (req,  res) => {
    console.log(req.body);
    let name = req.body.recipe_name;
    let description = req.body.recipe_description;
    let instruction = req.body.recipe_instruction;
    let image = req.body.recipe_image;
    let public = 0;
    let time = req.body.recipe_time;
    let date = new Date();
    date = date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    let ingredients = [];
    let tags = [];

    if (req.body.recipe_public) {
      public = 1;
    }

    let ingrName = req.body.ingredient_name;
    let ingrAmount = req.body.ingredient_amount;
    let ingrMeasurement = req.body.ingredient_measurement;

    if (ingrName || ingrAmount || ingrMeasurement) {
      if (ingrName.length == ingrAmount.length && ingrName.length == ingrMeasurement.length) {
        for (let i = 1; i < ingrName.length; i++) {
          ingredients.push({name: ingrName[i], amount: ingrAmount[i], measurement: ingrMeasurement[i]});
        }
      }
      else {
        res.status(400).json({error: 'Not all ingredient fields completed'});
      }
    }
    
    if (req.body.recipe_tags) {
      tags = req.body.recipe_tags;
    }

    if (name && description && instruction) {
        console.log("ingredients before db", ingredients);
        recipeDAO.createRecipe(req.user.id, name, description, instruction, image, public, time, date, ingredients, tags).then(recipe => {
          console.log(recipe);
          res.json(recipe);
        });
    }
  });

  apiRouter.get('/recipes/:id', TokenMiddleware, (req, res) => {
    let id = req.params.id;
    recipeDAO.checkAccess(req.user.id, id).then(access => {
      if (access) {
        recipeDAO.getRecipeById(id).then(recipe => {
          res.json(recipe);
        })
      }
      else {
        recipeDAO.getRecipeById(id).then(recipe => {
          if (recipe.public) {
            res.json(recipe);
          }
          else {
            console.log('You do not have access');
            res.status(403).json({error: "You do not have access"});
          }
        })
        
      }
    })
    
  });


apiRouter.get('/users/:userId/tags/:tagId/recipes', TokenMiddleware, (req, res) => {
  let userId = req.params.userId;
  let tagId = req.params.tagId;

  console.log("in get recipes by tag");

  recipeDAO.getRecipesByUserByTag(userId, tagId).then(recipes => {
    console.log("returned recipes", recipes);
    res.json(recipes);
  });
});

apiRouter.get('/tags/:tagId', (req, res) => {
  let tagId = req.params.tagId;
  console.log("heel");
  recipeDAO.getTagsById(tagId).then(tags => {
    res.json(tags);
});
});


  //update a specific recipe in the database
apiRouter.put('/recipes/:recipeId', TokenMiddleware, (req,  res) => {
    let id = req.params.recipeId;
    let recipe = {
        id: id,
        name: req.body.recipe_name,
        description: req.body.recipe_description,
        instruction: req.body.recipe_instruction,
        img: req.body.recipe_img,
        public: req.body.recipe_public,
        time: req.body.recipe_time,
        date: req.body.recipe_date,
        ingredients: req.body.recipe_ingredient,
        tags: req.body.recipe_tags
    }

    recipeDAO.updateRecipe(recipe).then(recipe => {
        res.json(recipe);
    });
  });

  //delete a specific recipe from the database
apiRouter.delete('/recipes/:recipeId', TokenMiddleware, (req,  res) => {
    let id = req.params.recipeId;
    recipeDAO.deleteRecipe(id).then(results => {
        res.status(200);
    });
    
  });

apiRouter.get('/tags', TokenMiddleware, (req, res) => {
  recipeDAO.getTags().then(tags => {
    res.json(tags);
  });
});

//targetID is the user you want to follow
apiRouter.post('/users/:userId/targets/:targetId', TokenMiddleware, (req, res) => {
  let userId = req.params.userId;
  let targetId = req.params.targetId;
  
  userDAO.createUserFollowRelation(userId, targetId).then(follow => {
    res.json(follow);
  })
});

//get who the user is following
apiRouter.get('/users/:userId/targets', TokenMiddleware, (req, res) => {
  let userId = req.params.userId;
  
  userDAO.getFollowingOfUserById(userId).then(follow => {
    res.json(follow);
  })
});

//get who is following the user
apiRouter.get('/users/:userId/follows', TokenMiddleware, (req, res) => {
  let userId = req.params.userId;
  
  userDAO.getFollowersOfUserById(userId).then(follow => {
    res.json(follow);
  })
});

//make the user follow someone
apiRouter.post('/users/:userId/targets/:targetId', (req, res) => {
  let userId = req.params.userId;
  let targetId = req.params.targetId;
  
  userDAO.createUserFollowRelation(userId, targetId).then(follow => {
    res.json(follow);
  })
});

  module.exports = apiRouter;