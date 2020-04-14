module.exports.NotFoundException = class extends Error {
    constructor(message) {
        super(message);
        this.code = 404;
    }
};
module.exports.BadRequestException = class extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
};