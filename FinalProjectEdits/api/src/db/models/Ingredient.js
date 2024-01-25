module.exports = class {
  
    constructor(data) {
      this.id = data.ing_id;
      this.name = data.ing_name;
      this.amount = data.ing_amount;
      this.measurement = data.ing_measurement;
    }
  };