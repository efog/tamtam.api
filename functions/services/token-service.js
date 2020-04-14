const BadRequestException = require("./exceptions").BadRequestException;
const util = require("util");

module.exports = class TokenService {
    constructor(request) {
        this.request = request || util.promisify(require("request"));
    }
    async getAccessTokenFromCode(code, authHost, authClientId, authSecret, authRedirectUri) {
        const url = authHost;
        const clientId = authClientId;
        const clientSecret = authSecret;
        const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
        const options = {
            "method": "POST",
            "url": `https://${url}/oauth2/token/`,
            "headers": {
                "Authorization": `Basic ${basicAuth}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "form": {
                "client_id": clientId,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": authRedirectUri
            }
        };
        console.log("sending request");
        const resp = await this.request(options);
        if (resp.statusCode === "200") {
            console.log("got response");
            return resp.body;
        }
        throw new BadRequestException(`Request access_token failed with status ${resp.statusCode} : ${resp.body}`, resp.statusCode);
    }
};