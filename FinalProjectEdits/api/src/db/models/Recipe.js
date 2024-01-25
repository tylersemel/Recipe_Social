module.exports = class {
  
    constructor(data) {
      this.id = data.rcp_id;
      this.name = data.rcp_name;
      this.description = this.convertToString(data.rcp_description);
      this.instruction = this.convertToString(data.rcp_instruction);
      this.img = data.rcp_img;
      this.public = data.rcp_public;
      this.time = data.rcp_time;
      this.date = data.rcp_date;
      this.tags = [];
      this.ingredients = [];
    }

    convertToString(byteArray) {
        let result = "";
        for (let i = 0; i < byteArray.length; i++) {
            result += String.fromCharCode(byteArray[i]);
        }
        return result;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            instruction: this.instruction,
            img: this.img,
            public: this.public,
            time: this.time,
            date: this.date,
            tags: this.tags,
            ingredients: this.ingredients
        }
    }
  };