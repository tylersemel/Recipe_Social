const express = require('express');
const apiRouter = express.Router();

const cookieParser = require('cookie-parser');
apiRouter.use(cookieParser());

apiRouter.use(express.json());

const userDAO = require('../db/UserDAO');
const recipeDAO = require('../db/RecipeDAO');

const {TokenMiddleware, generateToken, removeToken} = require('../middleware/TokenMiddleware');

//get a specific user from the database
apiRouter.get('/users/:userId', (req,  res) => {
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
apiRouter.put('/users/:userId', (req,  res) => {
    let userId = req.params.userId;
    let bio = req.body.bio;
    let image = req.body.img;
    
    userDAO.getUserById(userId).then(usr => {
      if (usr) {
        userDAO.updateUserBio(userId, bio);
        userDAO.updateUserImage(userId, image);
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
apiRouter.get('/:userId/folders', (req, res) => {
  let userId = req.params.userId;
  recipeDAO.getAllUserFolders(userId).then(folders => {
    console.log(folders);
    res.json(folders);
  });
});

//get a specific user's recipes from a folder
apiRouter.get('/:userId/recipes/:folder', (req,  res) => {
    let userId = req.params.userId;
    let folder = req.params.folder;
    
    recipeDAO.getRecipesInFolder(userId, folder).then(recipes => {
      console.log("returned recipes", recipes);
      res.json(recipes);
    });
    
    
  });

  //get a specific user's specific folder
apiRouter.get("/:userId/folders/:folderId",  (req, res) => {
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

//create a specific user's recipes from a folder
  apiRouter.post('/:userId/recipes/:folder', (req, res) => {
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
apiRouter.get('/recipes', (req,  res) => {
    recipeDAO.getRecipes().then(recipes => {
        res.json(recipes);
    });
  });

  //add a recipe to the list of recipes in the database
apiRouter.post('/recipes', TokenMiddleware, (req,  res) => {
    let name = req.body.recipe_name;
    let description = req.body.recipe_description;
    let instruction = req.body.recipe_instruction;
    let image = req.body.recipe_image;
    let public = req.body.recipe_public;
    let time = req.body.recipe_time;
    let date = req.body.recipe_date;
    let ingredients = req.body.recipe_ingredient;
    let tags = req.body.recipe_tags;

    if (name && description && instruction) {
        recipeDAO.createRecipe(2, name, description, instruction, image, public, time, date, ingredients, tags).then(recipe => {
          console.log(recipe);
          res.json(recipe);
        });
    }
  });

  apiRouter.get('/recipes/:id', (req, res) => {
    let id = req.params.id;
    recipeDAO.getRecipeById(id).then(recipe => {
      res.json(recipe);
    })
  });


  //update a specific recipe in the database
apiRouter.put('/recipes/:recipeId', (req,  res) => {
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
apiRouter.delete('/recipes/:recipeId', (req,  res) => {
    let id = req.params.recipeId;
    recipeDAO.deleteRecipe(id).then(results => {
        res.status(200);
    });
    
  });

  module.exports = apiRouter;