const db = require('./dbConnection');
const crypto = require('crypto');
const User = require('./models/User');

function getUserByCredentials(username, password) {
  console.log("in getuserbycredentials");
  return db.query('SELECT * FROM user WHERE usr_username=?', [username]).then(({results}) => {
    console.log("results 0:", results[0]);
    const user = new User(results[0]);
    if (user) { // we found our user
      return user.validatePassword(password);
    }
    else { // if no user with provided username
      console.log("there was error");
      throw new Error("No such user");
    }
  });
}

function getUserById(id) {
    return db.query('SELECT * FROM user WHERE usr_id=?', [id]).then(({results}) => {
        console.log("user query", results[0]);
        console.log("id", id);
        let user = new User(results[0]);
        console.log("users toJSON", user.toJSON());
        return user;
    });
}

function updateUserName(id, name) {
  // 
}

function updateUserBio(id, bio) {
  let user = getUserById(id);
  
  if (user) {
    //console.log(id);
    return db.query('UPDATE user SET usr_bio=? WHERE usr_id=?', [bio, id]).then(({results}) => {
      user = getUserById(id); 
      console.log("users toJSON", user);
      return user;
    });
  }
}

function updateUserImage(id, image) {
  let user = getUserById(id);
  
  if (user) {
    //console.log(id);
    return db.query('UPDATE user SET usr_img=? WHERE usr_id=?', [image, id]).then(({results}) => {
      user = getUserById(id); 
      console.log("users toJSON", user);
      return user;
    });
  }
}

function createUser(username, password, name ) {
    return db.query('SELECT * FROM user WHERE usr_username=?', [username]).then(({results}) => {
        //console.log(results);
        if (results[0]) { // A user with the username already exists
          throw new Error("User already exists");
        }
        else { // Create a user with the data provided
          return createPasswordHash(password).then((saltPassword) => {
            return db.query('INSERT INTO user (usr_username, usr_name, usr_salt, usr_password) VALUES (?, ?, ?, ?)',
            [username, name, saltPassword[0], saltPassword[1]]).then(({results}) => {
                console.log("insert query", results);
                createSavedFolder(results.insertId);
                return getUserById(results.insertId);
            });
            //console.log(user.toJSON());
            //return user;
          }).catch(err => {
            throw new Error({error: err});
          });
          
        }
      });
}

function createPasswordHash(password) {
    let salt = crypto.randomBytes(16).toString('hex');
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
          if (err) { //problem computing digest, like hash function not available
           reject("Error: " +err);
          }
          const digest = derivedKey.toString('hex');
          resolve([salt, digest]);
        });
      });
}

function createSavedFolder(userId) {
  db.query("INSERT INTO folder (fdr_name, fdr_owner) VALUES(?, ?)", ["Saved Recipes", userId]);
}


module.exports = {
  getUserByCredentials: getUserByCredentials,
  createUser: createUser,
  getUserById: getUserById,
  updateUserBio: updateUserBio,
  updateUserImage: updateUserImage
};