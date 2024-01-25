const db = require('./dbConnection');
const Recipe = require('./models/Recipe');
const Ingredient = require('./models/Ingredient');
const Folder = require('./models/Folder');
const Tag = require('./models/Tag');

function getRecipes() {
    return db.query("SELECT rcp_id FROM recipe").then(async ({results}) => {
        let ids = results.map(id => id.rcp_id);
        let recipes = [];
        for (const id of ids) {
            recipes.push( await getRecipeById(id));
        }
        return recipes;
    });
}
function getRecipesByUser(userId) {
    return db.query("SELECT rcp_id FROM recipe JOIN user_recipe ON usp_rcp_id=rcp_id WHERE usp_usr_id=?", userId).then(async ({results}) => {
        let ids = results.map(id => id.rcp_id);
        let recipes = [];
        for (const id of ids) {
            recipes.push( await getRecipeById(id));
        }
        return recipes;
    });
}

//This has been depricted but may need to be used later
async function getIngredients(recipes) {
    for (let i = 0; i < recipes.length; i++) {
        await db.query("SELECT * FROM recipe JOIN ingredient ON ing_rcp_id=rcp_id WHERE rcp_id=?", 
            [recipes[i].id]).then(({results}) => {
                let ingredients = results.map(ingredient => new Ingredient(ingredient));
                recipes[i].ingredients = ingredients;
                console.log(recipes[i]);
        });
    }
    return recipes;
}

function createRecipe(userId, name, description, instruction, image, public, time, date, ingredients, tags) {
    return db.query("INSERT INTO recipe (rcp_name, rcp_description, rcp_instruction, rcp_img, rcp_public, rcp_time, rcp_date) VALUES (?, ?, ?, ?, ?, ?, convert(?, datetime))",
        [name, description, instruction, image, public, time, date]).then(({results}) => {
            //console.log(results);
            let recipeResults = results;
            return new Promise(async (resolve, reject) => {
                for (let i = 0; i < ingredients.length; i++) {
                    await db.query("INSERT INTO ingredient (ing_name, ing_amount, ing_measurement, ing_rcp_id) VALUES (?, ?, ?, ?)", 
                        [ingredients[i].name, ingredients[i].amount, ingredients[i].measurement, recipeResults.insertId]);
                }
                for (let i = 0; i < tags.length; i++) {
                    await db.query("INSERT INTO recipe_tag (rct_rcp_id, rct_tag_id) VALUES (?, ?)", [recipeResults.insertId, tags[i]]);
                }
                
                createSavedRecipeFolderRelation(userId, recipeResults.insertId);
                resolve();
            }).then(() => {
                return db.query("INSERT INTO user_recipe (usp_usr_id, usp_rcp_id) VALUES (?, ?)",
                    [userId, recipeResults.insertId]).then(({results}) => {
                        return getRecipeById(recipeResults.insertId);
                    });
            });      
        });
}

function createSavedRecipeFolderRelation(userId, recipeId) {
    return db.query("SELECT fdr_id FROM folder WHERE fdr_owner = ? AND fdr_name = ?", [userId, "Saved Recipes"]).then(({results}) => {
        console.log(results[0].fdr_id);
        let folderId = results[0].fdr_id;
        db.query("UPDATE folder SET fdr_num_rcp = fdr_num_rcp + 1 WHERE fdr_id = ?", [folderId]);
        return db.query("INSERT INTO folder_recipe (frp_rcp_id, frp_fdr_id) VALUES (?, ?)", [recipeId, folderId]).then(({results}) => {
            return results.insertId;
        })
    });
}

function getFolderById(id) {
    return db.query("SELECT * FROM folder WHERE fdr_id=?", [id]).then(({results}) => {
        return results.map(folder => new Folder(folder))[0];
    });
}

//Gets all os a users folders
function getAllUserFolders(userId) {
    return db.query("SELECT * FROM folder WHERE fdr_owner=?", [userId]).then(({results}) => {
        let folders = results.map(folder => new Folder(folder));
        console.log(folders);
        return folders;
    });
}

function createFolder(userId, folder) {
    return db.query("INSERT INTO folder (fdr_name, fdr_img, fdr_num_rcp, fdr_owner), VALUES (?, ?, ?, ?)",
        [folder.name, folder.img, folder.numRecipes, userId]).then(({results}) => {
            return getFolderById(results.insertId);
        });
}

//Gets all the recipes in a folder
async function getRecipesInFolder(userId, folderId) {
    return db.query("SELECT * FROM folder_recipe WHERE frp_fdr_id=?", [folderId]).then(async ({results}) => {
        let recipes = [];
        
        for (const result of results) {
            await getRecipeById(result.frp_rcp_id).then(recipe => {
                recipes.push(recipe);
            });
            
        }
        //console.log(recipes);
        return await Promise.all(recipes);
    });
}

function getRecipeById(recipeId) {
    return db.query("SELECT * FROM recipe WHERE rcp_id=?", 
            [recipeId]).then(({results}) => {
                let recipe = results.map(recipe => new Recipe(recipe));
                console.log(recipe[0]);
                return db.query("SELECT * FROM ingredient WHERE ing_rcp_id=?", [recipeId]).then(({results}) => {
                    let ingredients = results.map(ingredient => new Ingredient(ingredient));
                    recipe[0].ingredients = ingredients;
                    return db.query("SELECT tag_id, tag_name FROM recipe JOIN recipe_tag ON rct_rcp_id=rcp_id JOIN tags ON rct_tag_id=tag_id WHERE rcp_id=?",
                    [recipeId]).then(({results}) => {
                        let tags = results.map(tag => new Tag(tag));
                        recipe[0].tags = tags;
                        return recipe[0];
                    });
                });
                
            });
}

function updateRecipe(recipe) {
    return db.query("UPDATE recipe SET rcp_name=?, rcp_description=?, rcp_instruction=?, rcp_img=?, rcp_public=?, rcp_time=?, rcp_date=? WHERE rcp_id=?",
        [recipe.name, recipe.description, recipe.instruction, recipe.img, recipe.public, recipe.time, recipe.date, recipe.id]).then(async ({results}) => {
            await updateIngredients(recipe.id, recipe.ingredients);
            await updateTags(recipe.id, recipe.tags);
            return getRecipeById(recipe.id);
        });
}

async function updateIngredients(recipeID, ingredients) {
    await db.query("SELECT ing_id FROM ingredient WHERE ing_rcp_id=?", [recipeID]).then(async ({results}) => {
        let ingID = results.map(ids => ids.ing_id);
        console.log(ingredients);
        for (let i = 0; i < ingID.length; i++) {
            let found = false;
            for (let j = 0; j < ingredients.length; j++) {
                if (ingID[i] == ingredients[j].id) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                await db.query("DELETE FROM ingredient WHERE ing_id=?", [ingID[i]]);
            }
        }
        for (let i = 0; i < ingredients.length; i++) {
            if (ingredients[i].id) {
                await db.query("UPDATE ingredient SET ing_name=?, ing_amount=?, ing_measurement=? WHERE ing_id=?",
                    [ingredients[i].name, ingredients[i].amount, ingredients[i].measurement, ingredients[i].id]);
            }
            else {
                await db.query("INSERT INTO ingredient (ing_name, ing_amount, ing_measurement, ing_rcp_id) VALUES (?, ?, ?, ?)", 
                [ingredients[i].name, ingredients[i].amount, ingredients[i].measurement, recipeID]);
            }
            
        }
    });
    
}

async function updateTags(recipeID, tags) {
    console.log("tag length", tags.length);
    db.query("DELETE FROM recipe_tag WHERE rct_rcp_id=?", [recipeID]).then(async () => {
        for (const tag of tags) {
            await db.query("INSERT INTO recipe_tag (rct_rcp_id, rct_tag_id) VALUES (?, ?)", [recipeID, tag]);
        }
    });
    // db.query("SELECT tag_id, tag_name FROM recipe JOIN recipe_tag ON rct_rcp_id=rcp_id JOIN tags ON rct_tag_id=tag_id WHERE rcp_id=?",
    // [recipeID]).then(async ({results}) => {
    //     let tagId = results.map(ids => ids.tag_id);
    //     for (let i = 0; i < tagId.length; i++) {
    //         let found = false;
    //         for (let j = 0; j < tags.length; j++) {
    //             if (tagId[i] == tags[j].id) {
    //                 found = true;
    //                 break;
    //             }
    //         }
    //         if (!found) {
    //             await db.query("DELETE FROM recipe_tag WHERE rct_tag_id=?", [tagId[i]]);
    //         }
    //     }
    //     for (let i = 0; i < tags.length; i++) {
    //         if (!tags.id) {
    //             await db.query("INSERT INTO recipe_tag (rct_rcp_id, rct_tag_id), VALUES (?, ?)",
    //                 [recipeID, tags[i]]);
    //         }
    //     }
    // });
}

function deleteRecipe(id) {
    return db.query("DELETE FROM recipe WHERE rcp_id=?", [id]).then(({results}) => {
        console.log(results);
        return results;
    });
}

function getTags() {
    return db.query("SELECT * FROM tags").then(({results}) => {
        return results.map(tag => new Tag(tag));
    });
}

module.exports = {
    getRecipesByUser: getRecipesByUser,
    createRecipe: createRecipe,
    getRecipeById: getRecipeById,
    getRecipes: getRecipes,
    updateRecipe: updateRecipe,
    deleteRecipe: deleteRecipe,
    getAllUserFolders: getAllUserFolders,
    getRecipesInFolder: getRecipesInFolder,
    createFolder: createFolder,
    getFolderById: getFolderById,
    getTags: getTags,
}