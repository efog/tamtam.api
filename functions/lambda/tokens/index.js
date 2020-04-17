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
            const code = event.body ? JSON.parse(event.body).code : event.code;
            console.log(`Calling get access token service with ${code}, ${host}, ${clientId}, ${clientSecret}. ${redirectUri}`);
            const tokens = await service.getAccessTokenFromCode(code, host, clientId, clientSecret, redirectUri);
            console.log("got access token response");
            return callback(null, {
                "isBase64Encoded": false,
                "statusCode": tokens.statusCode,
                "body": tokens.body,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
                    "Access-Control-Allow-Headers": "Accept,Content-Type,Pragma,Cache-Control"
                }
            });
        }
        catch (err) {
            console.log(`got exception: ${JSON.stringify(err)}`);
            return callback(null, {
                "isBase64Encoded": false,
                "statusCode": err.code,
                "body": err,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
                    "Access-Control-Allow-Headers": "Accept,Content-Type,Pragma,Cache-Control"
                }
            });
        }
    },
    async options(event, context, callback) {
        console.log(`EVENT: ${JSON.stringify(event, null, 2)}`);
        return callback(null, {
            "isBase64Encoded": false,
            "statusCode": 200,
            "body": "OK",
            "headers": {
                "Content-Type": "text/plain",
                "Access-Control-Allow-Origin": "http://localhost:9090",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
                "Access-Control-Allow-Headers": "Accept,Content-Type,Pragma,Cache-Control"
            }
        });
    }
};
module.exports.getAccessToken = handlers.getAccessToken;
module.exports.options = handlers.options;