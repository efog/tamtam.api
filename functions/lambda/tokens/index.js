const Services = require("../../services/index.js");
const UserRepository = require("../../services/repositories/user-repository");

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
            const tokens = await service.getAccessTokenFromCode(code, host, clientId, clientSecret, redirectUri);
            const body = JSON.parse(tokens.body);
            await service.updateUserDataFromTokens(body);
            const retVal = {
                "accessToken": tokens.statusCode === 200 ? body.access_token : null,
                "refreshToken": tokens.statusCode === 200 ? body.refresh_token : null
            };
            console.log(`returning ${JSON.stringify(retVal)} with ${tokens.statusCode}`);
            return callback(null, {
                "isBase64Encoded": false,
                "statusCode": tokens.statusCode,
                "body": tokens.statusCode === 200 ? JSON.stringify(retVal) : JSON.stringify(tokens.body),
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
                    "Access-Control-Allow-Headers": "Accept,Content-Type,Pragma,Cache-Control,User-Agent,Origin,Referer"
                }
            });
        }
        catch (err) {
            console.error(`EVENT: got exception: ${JSON.stringify(err)}`);
            return callback(null, {
                "isBase64Encoded": false,
                "statusCode": err.code,
                "body": err,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
                    "Access-Control-Allow-Headers": "Accept,Content-Type,Pragma,Cache-Control,User-Agent,Origin,Referer"
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
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
                "Access-Control-Allow-Headers": "Accept,Content-Type,Pragma,Cache-Control,User-Agent,Origin,Referer"
            }
        });
    }
};
module.exports.getAccessToken = handlers.getAccessToken;
module.exports.options = handlers.options;