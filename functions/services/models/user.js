module.exports = class User {
    constructor() {
        this.userId = null;
        this.doctype = "user";
        this.timestamp = new Date().getTime();
    }
};