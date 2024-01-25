import api from './apiClient.js';
const form = document.querySelector('form');
const addIngredient = document.querySelector('#addIngredient');
const ingredientList = document.querySelector('.ingredients');
const tagList = document.querySelector('.tagList');

const submitBtn = document.querySelector('.create-recipe-submit');

submitBtn.addEventListener('submit', e => {
    document.location = '/home';
})

form.addEventListener('submit', e => {
    document.location = '/home';
})

api.getTags().then(tags => {
    console.log(tags);

    for (const tag of tags) {
        const checkDiv = document.createElement('div');
        checkDiv.classList.add('form-check');
        checkDiv.classList.add('checkDiv');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('form-check-input');
        checkbox.classList.add('tag-check');
        checkbox.name = 'recipe_tags';
        checkbox.value = tag[0].id;
        checkbox.id = tag[0].id;
        
        const label = document.createElement('label');
        label.classList.add('form-check-label');
        label.innerHTML = tag[0].name;
        label.for = tag[0].id;

        checkDiv.appendChild(checkbox);
        checkDiv.appendChild(label);
        tagList.appendChild(checkDiv);


    }
});


addIngredient.addEventListener('click', (e) => {
    const ingredientDiv = document.createElement('div');
    ingredientDiv.classList.add('row');
    createIngredient(ingredientDiv)
    ingredientList.appendChild(ingredientDiv);
});

function createIngredient(ingDiv) {

    const nCol = document.createElement('div');
    nCol.classList.add('col');
    nCol.classList.add('ing');

    const nameInput = document.createElement('input');
    nameInput.classList.add('ing-name');
    nameInput.type = 'text';
    nameInput.name = 'ingredient_name';
    nameInput.placeholder = "Ingredient Name";

    nCol.appendChild(nameInput);
    ingDiv.appendChild(nCol);

    const aCol = document.createElement('div');
    aCol.classList.add('col');
    aCol.classList.add('ing');

    const amountInput = document.createElement('input');
    amountInput.classList.add('ing-amount');
    amountInput.type = 'number';
    amountInput.name = 'ingredient_amount';
    amountInput.placeholder = 'Amount';

    aCol.appendChild(amountInput);
    ingDiv.appendChild(aCol);


    const mCol = document.createElement('div');
    mCol.classList.add('col');
    mCol.classList.add('ing');

    const measureInput = document.createElement('input');
    measureInput.classList.add('ing-measurement');
    measureInput.type = 'text';
    measureInput.name = 'ingredient_measurement';
    measureInput.placeholder = 'Measurement';

    mCol.appendChild(measureInput);
    ingDiv.appendChild(mCol);

    const deleteB = document.createElement('div');
    deleteB.classList.add('col');
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('deleteIng');
    deleteButton.classList.add('btn-close');
    deleteB.appendChild(deleteButton);
    ingDiv.appendChild(deleteB);
    //deleteBtns.push(deleteButton);
    deleteButton.addEventListener('click', (e) => {
        console.log('delete');
        const div = deleteButton.parentElement.parentElement;
        div.innerHTML = '';
        div.remove();

    })
    /*
    const nameDiv = document.createElement('div');
    nameDiv.classList.add('col-sm-5');

    const name = document.createElement('label');
    name.innerHTML = 'Name';
    name.for = 'ingredient_name';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.name = 'ingredient_name';

    nameDiv.appendChild(name);
    nameDiv.appendChild(nameInput);
    ingDiv.appendChild(nameDiv);

    const amountDiv = document.createElement('div');
    amountDiv.classList.add('col-sm-3');

    const amount = document.createElement('label');
    amount.innerHTML = 'Amount';
    name.for = 'ingredient_amount';

    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.name = 'ingredient_amount';

    amountDiv.appendChild(amount);
    amountDiv.appendChild(amountInput);
    ingDiv.appendChild(amountDiv);

    const measureDiv = document.createElement('div');
    measureDiv.classList.add('col-sm-3');

    const measure = document.createElement('label');
    measure.innerHTML = 'Measure';
    measure.for = 'ingredient_measurement';

    const measureInput = document.createElement('input');
    measureInput.type = 'text';
    measureInput.name = 'ingredient_measurement';

    measureDiv.appendChild(measure);
    measureDiv.appendChild(measureInput);
    ingDiv.appendChild(measureDiv);

    const deleteButton = document.createElement('div');
    deleteButton.classList.add('col-sm-1');
    deleteButton.classList.add('deleteIng');
    deleteButton.classList.add('btn-close');
    ingDiv.appendChild(deleteButton);
    //deleteBtns.push(deleteButton);
    deleteButton.addEventListener('click', (e) => {
        console.log('delete');
        const div = deleteButton.parentElement;
        div.innerHTML = '';
        div.remove();

    })
    */

}
