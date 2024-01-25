const crypto = require('crypto');

module.exports = class {
  #passwordHash;
  #salt;

  constructor(data) {
    this.id = data.usr_id;
    this.name = data.usr_name;
    this.username = data.usr_username;
    this.bio = data.usr_bio;
    this.img = data.usr_img;
    this.#salt = data.usr_salt;
    this.#passwordHash = data.usr_password;
  }

  validatePassword(password) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, this.#salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) { //problem computing digest, like hash function not available
         reject("Error: " +err);
        }

        const digest = derivedKey.toString('hex');
        if (this.#passwordHash == digest) {
          resolve(this);
        }
        else {
          reject("Invalid username or password");
        }
      });
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      username: this.username,
      img: this.img,
      bio: this.bio
    }
  }
};