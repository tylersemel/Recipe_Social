module.exports = class {
  
    constructor(data) {
      this.id = data.tag_id;
      this.name = data.tag_name;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name
        }
    }
  };