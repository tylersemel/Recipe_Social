import api from './apiClient.js';

const tagList = document.querySelector('.tagList');

const query = window.location.search;
let parameters = new URLSearchParams(query);
let id = parameters.get('id');
console.log("recipeid", id);

api.getCurrentUser().then(user => {
    api.getRecipeById(id).then(recipe => {
        console.log(recipe);
        createRecipeHTML(recipe);
    }).catch(error => {
        const holder = document.querySelector('.create-recipe-form');
        holder.innerHTML = '';
        //holder.classList.add('container');
        document.querySelector('.header').innerHTML = 'ERROR';
        const h2 = document.createElement('h2');
        h2.innerHTML = 'You do not have access to this recipe';
        holder.appendChild(h2);
    });
}).
catch(err => {
    document.location = '/login'
});

function createRecipeHTML(recipe) {
    const ingHolder = document.querySelector('.ingredients');
    let ingredients = recipe.ingredients;

    ingredients.forEach(ingredient => {
        const ingDiv = document.createElement('div');
        ingDiv.classList.add('row');

        const nCol = document.createElement('div');
        nCol.classList.add('col');
        nCol.classList.add('ing');

        const nameInput = document.createElement('input');
        nameInput.classList.add('ing-name');
        nameInput.type = 'text';
        nameInput.name = 'ingredient_name';
        nameInput.value = ingredient.name;
        nameInput.disabled = 'true';

        nCol.appendChild(nameInput);
        ingDiv.appendChild(nCol);

        const aCol = document.createElement('div');
        aCol.classList.add('col');
        aCol.classList.add('ing');

        const amountInput = document.createElement('input');
        amountInput.classList.add('ing-amount');
        amountInput.type = 'number';
        amountInput.name = 'ingredient_amount';
        amountInput.value = ingredient.amount;
        amountInput.disabled = 'true';

        aCol.appendChild(amountInput);
        ingDiv.appendChild(aCol);


        const mCol = document.createElement('div');
        mCol.classList.add('col');
        mCol.classList.add('ing');

        const measureInput = document.createElement('input');
        measureInput.classList.add('ing-measurement');
        measureInput.type = 'text';
        measureInput.name = 'ingredient_measurement';
        measureInput.value = ingredient.measurement;
        measureInput.disabled = 'true';

        mCol.appendChild(measureInput);
        ingDiv.appendChild(mCol);
        ingHolder.appendChild(ingDiv);
    });

    const recipeName = document.querySelector('.header');
    recipeName.innerHTML = recipe.name;

    const desHolder = document.querySelector('.description');
    desHolder.innerHTML = recipe.description;
    

    const timeHolder = document.querySelector('.time');
    timeHolder.value = recipe.time;


    const tagHolder = document.querySelector('#tag-list');
    let tags = recipe.tags;

    tags.forEach(tag => {
        const checkDiv = document.createElement('div');
        checkDiv.classList.add('form-check');
        checkDiv.classList.add('checkDiv');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('form-check-input');
        checkbox.classList.add('tag-check');
        checkbox.name = 'recipe_tags';
        checkbox.value = tag.id;
        checkbox.id = tag.id;
        checkbox.checked = 'true';
        checkbox.disabled = 'true';
        
        const label = document.createElement('label');
        label.classList.add('form-check-label');
        label.innerHTML = tag.name;
        label.for = tag.id;

        checkDiv.appendChild(checkbox);
        checkDiv.appendChild(label);
        tagList.appendChild(checkDiv);
    });

    const instructions = document.querySelector('.instructions');
    instructions.innerHTML = recipe.instruction;

    const pubCheck = document.createElement('input');
    pubCheck.type = 'checkbox';
    pubCheck.classList.add('\'form-check\'');
    pubCheck.checked = recipe.public;
    pubCheck.disabled = 'true';
    document.querySelector('.labels-public').appendChild(pubCheck);

    const img = document.querySelector('#preview');
    if (!recipe.img) {
        img.src = '/img/recipe-placeholder-1.png';
    }
    else {
        img.src = recipe.img;
    }
}




