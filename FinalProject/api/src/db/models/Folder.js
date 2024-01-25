module.exports = class {
  
    constructor(data) {
      this.id = data.fdr_id;
      this.name = data.fdr_name;
      this.img = data.fdr_img;
      this.owner = data.fdr_owner;
      this.numRecipes = data.fdr_num_rcp;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            img: this.img,
            owner: this.owner,
            numRecipes: this.numRecipes
        }
    }
  };