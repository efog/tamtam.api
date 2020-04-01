const Services = require("../../services/index.js");

const handlers = {
    async getByUserId(event, context, callback) {
        const service = new Services.UserService();
        console.log(`EVENT: ${JSON.stringify(event, null, 2)}`);
        const userId = "someone.else@example.com";
        const user = await service.getUser(userId);
        callback(null, {
            "isBase64Encoded": false,
            "statusCode": 200,
            "body": JSON.stringify(user),
            "headers": {
                "x-response-ok": true
            }
        });
    }
};
module.exports.getByUserId = handlers.getByUserId;
// functions/startConfigurationRulesEvaluation/index.handler
// lambda/users/getuserbyid/index.handler