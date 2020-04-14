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
            console.log(`Calling get access token service with ${event.code}, ${host}, ${clientId}`);
            const tokens = await service.getAccessTokenFromCode(event.code, host, clientId, clientSecret, redirectUri);
            console.log("got access token response");
            return callback(null, {
                "isBase64Encoded": false,
                "statusCode": 200,
                "body": JSON.stringify(tokens)
            });
        }
        catch (err) {
            console.log(`got exception: ${JSON.stringify(err)}`);
            return callback(null, {
                "isBase64Encoded": false,
                "statusCode": err.code,
                "body": JSON.stringify({})
            });
        }
    }
};
module.exports.getAccessToken = handlers.getAccessToken;