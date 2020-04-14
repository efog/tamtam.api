const Services = require("../../services/index.js");

const handlers = {
    async getAccessToken(event, context, callback) {
        const service = new Services.TokenService();
        console.log(`EVENT: ${JSON.stringify(event, null, 2)}`);
        const host = process.env.CONFIG_AUTH_HOST;
        const clientId = process.env.CONFIG_AUTH_CLIENTID;
        const clientSecret = process.env.CONFIG_AUTH_CLIENTSECRET;
        const redirectUri = process.env.CONFIG_AUTH_REDIRECT_URI;
        try {
            const tokens = await service.getAccessTokenFromCode(event.code, host, clientId, clientSecret, redirectUri);
            return callback(null, {
                "isBase64Encoded": false,
                "statusCode": 200,
                "body": JSON.stringify(tokens)
            });
        }
        catch (err) {
            console.log(`get user exception: ${JSON.stringify(err)}`);
            return callback(null, {
                "isBase64Encoded": false,
                "statusCode": err.code,
                "body": JSON.stringify(err)
            });
        }
    }
};
module.exports.getAccessToken = handlers.getAccessToken;