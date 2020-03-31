import Services from "../services/index.js";

export default {
    async GetByUserId(event, context) {
        const service = new Services.UserService();
        console.log(`EVENT: ${JSON.stringify(event, null, 2)}`);
        const userId = event.pathParameters.param1;
        const user = await service.getUser(userId);
        return user;
    }
};