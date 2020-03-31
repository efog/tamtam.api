const UserRepository = require("./repositories/user-repository");

/**
 * User service implementation
 *
 * @class UserService
 */
module.exports = class UserService {
    constructor(userRepository) {
        this._userRepository = userRepository || new UserRepository();
    }
    
    /**
     * Gets user by id
     * @param {string} userId user identifier
     * @returns {User} user document
     */
    async getUser(userId) {
        const returnValue = await this._userRepository.getByUserId(userId);
        return returnValue;
    }
};