import AWS from "aws-sdk";
import User from "../models/user.js";
import fs from "fs";
import path from "path";

/**
 * User object repository for read/write
 *
 * @export
 * @class UserRepository
 */
export default class UserRepository {

    /**
     * Default constructor
     * @param {*} documentClient dynamo DB document client dependency
     * 
     * @memberof UserRepository
     */
    constructor(documentClient) {
        this._documentClient = documentClient || new AWS.DynamoDB.DocumentClient({ "apiVersion": "2012-08-10" });
    }

    get documentClient() {
        return this._documentClient;
    }

    get IacCatalog() {
        if (!this._iacCatalog) {
            this._iacCatalog = JSON.parse(fs.readFileSync(`${path.join(process.env.LAMBDA_TASK_ROOT || process.cwd(), "iac.json")}`, "utf8"));
        }
        return this._iacCatalog;
    }

    /**
     * Gets user document by user id
     *
     * @param {*} userId user identifier value
     * @returns {User} user document
     * @memberof UserRepository
     */
    async getByUserId(userId) {
        const params = {
            "TableName": this.IacCatalog.userdata_table.value.name,
            "Key": {
                "userId": userId
            }
        };
        const item = await this.documentClient.get(params).promise();
        const user = new User();
        const itemKeys = Object.keys(item.Item);
        for (let index = 0; index < itemKeys.length; index++) {
            const element = itemKeys[index];
            user[element] = item.Item[element].S || item.item.N;
        }
        return user;
    }
}