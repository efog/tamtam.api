/**
 * User service implementation
 *
 * @export
 * @class UserService
 */
export class UserService {
    constructor(userRepository) {
        this._userRepository = userRepository;
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
}