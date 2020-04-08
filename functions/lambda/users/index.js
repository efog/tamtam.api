const Services = require("../../services/index.js");

const handlers = {
    async getByUserId(event, context, callback) {
        const service = new Services.UserService();
        console.log(`EVENT: ${JSON.stringify(event, null, 2)}`);
        const userId = "someone.else@example.com";
        try {
            const user = await service.getUser(userId);
            return callback(null, {
                "isBase64Encoded": false,
                "statusCode": 200,
                "body": JSON.stringify(user)
            });
        }
        catch (err) {
            if (err.errorMessage === "not found") {
                return callback(null, {
                    "isBase64Encoded": false,
                    "statusCode": 404,
                    "body": JSON.stringify({})
                });
            }
            return callback(err, null);
        }
    }
};
module.exports.getByUserId = handlers.getByUserId;
// functions/startConfigurationRulesEvaluation/index.handler
// lambda/users/getuserbyid/index.handler