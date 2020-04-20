const AWS = require("aws-sdk");
const NotFoundException = require("../exceptions").NotFoundException;
const User = require("../models/user.js");
const fs = require("fs");
const path = require("path");

/**
 * User object repository for read/write
 *
 * @export
 * @class UserRepository
 */
module.exports = class UserRepository {

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

    get tableName() {
        return process.env.CONFIG_USERSTABLENAME || "users";
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
            "TableName": this.tableName,
            "Key": {
                "userId": userId,
                "doctype": "user"
            }
        };
        const item = await this.documentClient.get(params).promise();
        if (item.Item) {
            const itemKeys = Object.keys(item.Item);
            const user = new User();
            for (let index = 0; index < itemKeys.length; index++) {
                const element = itemKeys[index];
                user[element] = item.Item[element];
            }
            return user;
        }
        throw new NotFoundException("not found");
    }
    async upsert(document) {
        const params = {
            "TableName": this.tableName,
            "Item": document
        };
        await this.documentClient.put(params).promise();
        const update = await this.getByUserId(document.userId);
        return update;
    }
};