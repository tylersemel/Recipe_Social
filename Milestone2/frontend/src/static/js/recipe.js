import api from './apiClient.js';

let rcpHolder = document.querySelector('.recipeDetails');

const query = window.location.search;
let parameters = new URLSearchParams(query);
let id = parameters.get('id');

api.getCurrentUser().then(user => {
    api.getRecipeById(id).then(recipe => {
        console.log(recipe);
        createRecipeHTML(recipe);
    })
}).
catch(err => {
    document.location = '/';
});

function createRecipeHTML(recipe) {
    const ingHolder = document.querySelector('#ing-list');
    let ingredients = recipe.ingredients;

    ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        const p = document.createElement('p');
        p.innerHTML = ingredient.name + ": " + ingredient.amount + " " + ingredient.measurement;
        li.appendChild(p);
        ingHolder.appendChild(li);
    });

    const recipeName = document.querySelector('.recipename');
    recipeName.innerHTML = recipe.name;

    const instHolder = document.querySelector('#inst-list');
    const instruction = document.createElement('li');
    const p = document.createElement('p');
    p.innerHTML = recipe.instruction;
    instruction.appendChild(p);
    instHolder.appendChild(instruction);


}




