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
    async getUserDocument(userId) {
        const returnValue = await this._userRepository.getByUserId(userId);
        return returnValue;
    }
}