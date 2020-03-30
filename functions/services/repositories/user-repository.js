import AWS from "aws-sdk";
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
     * @param {*} dynamoDB dynamo DB dependency
     * 
     * @memberof UserRepository
     */
    constructor(dynamoDB) {
        this._dynamoDB = dynamoDB || new AWS.DynamoDB({ "apiVersion": "2012-08-10" });
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
     * @returns {*} user document
     * @memberof UserRepository
     */
    async getByUserId(userId) {
        const params = {
            "ExpressionAttributeValues": {
                ":v1": {
                    "S": userId
                }
            }, 
            "KeyConditionExpression": "userId = :v1", 
            "ProjectionExpression": "userID", 
            "TableName": this.IacCatalog.userdata_table.value.name
        };
        return null;
    }
}