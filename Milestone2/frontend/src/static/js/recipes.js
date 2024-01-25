import api from './apiClient.js';

const recipeBox = document.querySelector('#recipebox');
let folderID = document.location.pathname.split('/')[1];
console.log(folderID);

api.getCurrentUser().then(user => {

    api.getFolder(user.id, folderID).then(folder => {
        console.log(folder);
        const folderName = document.querySelector('#folder-name');
        folderName.innerHTML = folder.name;
        api.getRecipesFromFolder(user.id, folder.id).then(recipes => {
            recipes.forEach(recipe => createRecipeHTML(recipe));
        });
    });
    
    function createRecipeHTML(recipe) {
        console.log(recipe);
        const recipeDiv = document.createElement('div');
        recipeDiv.id = "recipe-holder";

        const recipeTag = document.createElement('a');
        recipeTag.id = "recipe";
        recipeTag.href = "/recipe" + "/?id=" + recipe.id;
        recipeDiv.appendChild(recipeTag);
    
        const recipeIMG = document.createElement('img');
        recipeIMG.src = recipe.img;
        recipeIMG.id = "recipe-image";
        recipeTag.appendChild(recipeIMG);
    
        const recipeName = document.createElement('p');
        recipeName.innerHTML = recipe.name;
        recipeTag.appendChild(recipeName);
    
        recipeBox.appendChild(recipeDiv);
    }
}).catch(err => {
    document.location = "/";
});