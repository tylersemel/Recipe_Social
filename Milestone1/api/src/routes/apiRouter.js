const express = require('express');
const apiRouter = express.Router();

let accounts = require('../mock_data/account.json');
let userRecipes = require('../mock_data/usersRecipes.json');
let allRecipes = require('../mock_data/recipes.json');

apiRouter.use(express.json());
apiRouter.get('/account/:userId', (req,  res) => {
    let userId = req.params.userId;
    let account = accounts.find(account => account.username == userId);
    if (account) {
        res.json(account);
    }
    else {
        res.status(404).json({error: 'Account not found'});
    }
  });

apiRouter.put('/account/:userId', (req,  res) => {
    let userId = req.params.userId;
    let account = accounts.find(account => account.username == userId);
    if (account) {
        //To DO
        res.json(account);
    }
    else {
        res.status(404).json({error: 'Account not found'});
    }
  });

apiRouter.post('/login', (req, res) => {
    let username = req.body.username;
    let account = accounts.find(account => account.username == username);

    if (account) {
        res.json(account);
    }
    else {
        res.status(404).json({error: 'Account not found'});
    }
  })

apiRouter.post('/createAccount', (req, res) => {
    let username = req.body.username;
    let account = accounts.find(account => account.username == username);

    if (account) {
        res.status(404).json({error: 'Choose different username'});
    }
    else {
        //To Do\\
        res.status(200).send("Account created successfully");
    }
  })

apiRouter.get('/:userId/recipes', (req,  res) => {
    let userId = req.params.userId;
    let user = userRecipes.users.find(account => account.username == userId);
    if (user) {
        res.json(user.recipefolders);
    }
    else {
        res.status(404).json({error: 'User not found'});
    }
  });

apiRouter.get('/:userId/recipes/:folder', (req,  res) => {
    let userId = req.params.userId;
    let folder = req.params.folder;
    let user = userRecipes.users.find(account => account.username == userId);
    let recipes = user.recipefolders.find(folderName => folderName.foldername == folder);

    if (recipes) {
        res.json(recipes.recipes);
    }
    else {
        res.status(404).json({error: 'No folders found'});
    }
  });

apiRouter.get('/:userId/recipes/:folder/:id', (req,  res) => {
    let userId = req.params.userId;
    let folder = req.params.folder;
    let id = req.params.id;
    let user = userRecipes.users.find(account => account.username == userId);
    let recipes = user.recipefolders.find(folderName => folderName.foldername == folder);
    let recipe = recipes.recipes.find(rec => rec.recipename == id);

    if (recipe) {
        res.json(recipe);
    }
    else {
        res.status(404).json({error: 'No recipe found'});
    }
  });

apiRouter.get('/recipes', (req,  res) => {
    if (allRecipes) {
        res.json(allRecipes);
    }
    else {
        res.status(404).json({error: 'No recipes found'});
    }
  });

apiRouter.post('/recipes/:recipeId', (req,  res) => {
    let id = req.params.recipeId;
    let recipe = allRecipes.recipes.find( rec => rec.recipename == id);
    console.log(recipe);
    if (!recipe) {
        res.status(200).send("Recipe created");
    }
    else {
        res.status(404).json({error: 'Recipe already found'});
    }
  });


apiRouter.put('/recipes/:recipeId', (req,  res) => {
    let id = req.params.recipeId;
    let recipe = allRecipes.recipes.find( rec => rec.recipename == id);
    if (recipe) {
        res.status(200).send("Recipe updated successfully");
    }
    else {
        res.status(404).json({error: 'No recipe found to update'});
    }
  });

apiRouter.delete('/recipes/:recipeId', (req,  res) => {
    let id = req.params.recipeId;
    let recipe = allRecipes.recipes.find( rec => rec.recipename == id);

    if (recipe) {
        res.send(200).send("Recipe deleted successfully");
    }
    else {
        res.status(404).json({error: 'No recipe found'});
    }
  });

  module.exports = apiRouter;