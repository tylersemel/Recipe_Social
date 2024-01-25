module.exports = class {
    constructor(data) {
        this.id = data.fol_id;
        this.userId = data.fol_usr_id;
        this.followId = data.fol_target_id;
      }
  
      toJSON() {
          return {
              id: this.id,
              userId: this.userId,
              followId: this.followId
          }
      }
};