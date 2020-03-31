module.exports.NotFoundException = class extends Error {
    constructor(message) {
        super(message);
        this.code = 404;
    }
};