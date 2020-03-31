const requireEsm = require("esm")(module);
const Services = requireEsm("../../services/index.js");

const handlers = {
    async getByUserId(event, context, callback) {
        const service = new Services.UserService();
        console.log(`EVENT: ${JSON.stringify(event, null, 2)}`);
        const userId = "someone@example.com";
        const user = await service.getUser(userId);
        callback(null, {
            "statusCode": 200,
            "user": user
        });
    }
};
module.exports.getByUserId = handlers.getByUserId;
// functions/startConfigurationRulesEvaluation/index.handler
// lambda/users/getuserbyid/index.handler