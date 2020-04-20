const BadRequestException = require("./exceptions").BadRequestException;
const User = require("./models/user");
const UserRepository = require("./repositories/user-repository");
const atob = require("atob");
const util = require("util");

module.exports = class TokenService {
    constructor(request, userRepository) {
        this.request = request || util.promisify(require("request"));
        this.userRepository = userRepository || new UserRepository();
    }
    async parseToken(tokenStr) {
        const payload = atob(tokenStr.split(".")[1]);
        const token = JSON.parse(payload);
        return token;
    }
    async updateUserDataFromIdToken(tokens) {
        const idToken = await this.parseToken(tokens.id_token);
        const accessToken = await this.parseToken(tokens.access_token);
        // eslint-disable-next-line camelcase
        const { client_id, username } = accessToken;
        // eslint-disable-next-line camelcase
        const { email, email_verified } = idToken;
        const doc = new User();
        doc.userId = username;
        // eslint-disable-next-line camelcase
        doc.clientId = client_id;
        doc.email = email;
        // eslint-disable-next-line camelcase
        doc.emailVerified = email_verified;
        doc.idToken = tokens.id_token;
        return await this.userRepository.upsert(doc) || doc;
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
        try {
            const resp = await this.request(options);
            console.log("got response");
            return resp;
        }
        catch (err) {
            throw new BadRequestException(JSON.stringify(err), 500);
        }
    }
};