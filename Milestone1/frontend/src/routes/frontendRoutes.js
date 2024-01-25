const express = require('express');
const frontendRoutes = express.Router();

const html_dir = __dirname + '/templates/';

frontendRoutes.get('/account/:userId', (req, res) => {
  res.sendFile(`${html_dir}account.html`);
});

frontendRoutes.get('/savedrecipes', (req, res) => {
  res.sendFile(`${html_dir}recipefolders.html`);
});

frontendRoutes.get('/recipes', (req, res) => {
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

module.exports = frontendRoutes;
