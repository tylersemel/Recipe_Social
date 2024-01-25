const express = require('express');
const frontendRoutes = express.Router();

const path = require('path');

const html_dir = path.join(__dirname, '../templates/');

//getting a profile for another user
frontendRoutes.get('/users/:userId', (req, res) => {
  res.sendFile(`${html_dir}account.html`);
});

//getting the profile for the current user that is logged in
frontendRoutes.get('/current/:userId', (req, res) => {
  res.sendFile(`${html_dir}currentAccount.html`);
});

//editing the profile for the current user that is logged in
frontendRoutes.get('/current/:userId/editProfile', (req, res) => {
  res.sendFile(`${html_dir}editProfile.html`);
});

frontendRoutes.get('/savedrecipes', (req, res) => {
  res.sendFile(`${html_dir}recipefolders.html`);
});

frontendRoutes.get('/:folderId/recipes', (req, res) => {
  res.sendFile(`${html_dir}recipes.html`);
});

frontendRoutes.get('/recipe', (req, res) => {
  res.sendFile(`${html_dir}recipe.html`);
});

frontendRoutes.get('/createRecipe', (req, res) => {
  res.sendFile(`${html_dir}createRecipe.html`);
});

frontendRoutes.get('/login', (req, res) => {
  res.sendFile(`${html_dir}login.html`);
});

frontendRoutes.get('/settings', (req, res) => {
  res.sendFile(`${html_dir}settings.html`);
});

frontendRoutes.get('/home', (req, res) => {
  res.sendFile(`${html_dir}home.html`);
});

frontendRoutes.get('/createAccount', (req, res) => {
  res.sendFile(`${html_dir}createAccount.html`);
});

frontendRoutes.get('/', (req, res) => {
  res.sendFile(`${html_dir}login.html`);
});

module.exports = frontendRoutes;
