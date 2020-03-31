const AWS = require("aws-sdk");
AWS.config.update({ "region": "ca-central-1" });

const User = require("../services/models/user.js");
const UserRepository = require("../services/repositories/user-repository.js");
const debug = require("debug")("debug:tests:user-repository");
const sinon = require("sinon");
const test = require("ava");

test("can instantiate user repository", (expect) => {
    const target = new UserRepository({});
    expect.truthy(target);
});

test("queries dynamodb for document by userid, existing document", async (expect) => {
    const id = "someone@example.com";
    const user = {
        "Item": {
            "userId": id
        }
    };
    const promise = () => {
        return new Promise((resolve, reject) => {
            return resolve(user);
        });
    };
    const documentClient = {};
    const get = sinon.fake.returns({ "promise": promise });
    documentClient.get = get;

    const target = new UserRepository(documentClient);
    expect.truthy(target);

    const result = await target.getByUserId(id);

    expect.truthy(get.calledOnce);
    expect.is(result.userId, id);
});


test("queries dynamodb for document by userid, throws error", async (expect) => {
    const id = "someone@example.com";
    const promise = () => {
        return new Promise((resolve, reject) => {
            resolve({ "Item": null });
        });
    };
    const get = sinon.fake.returns({ "promise": promise });
    const documentClient = {
        "get": get
    };

    const target = new UserRepository(documentClient);
    expect.truthy(target);
    expect.truthy(target._documentClient);
    expect.truthy(target._documentClient.get);
    try {
        const result = await target.getByUserId(id);
    }
    catch (err) {
        expect.truthy(err);
        expect.is(err.code, 404);
        expect.pass();
    }
});

test("can read from dynamodb non existing record", async (expect) => {
    const id = "someone@example.com";
    const target = new UserRepository();
    expect.truthy(target);
    expect.truthy(target._documentClient);
    expect.truthy(target._documentClient.get);
    try {
        const item = await target.getByUserId(id);
    }
    catch (err) {
        expect.is(err.code, 404);
        expect.pass();
    }
});

test("can write and read to/from dynamodb", async (expect) => {
    const id = "someone.else@example.com";
    const target = new UserRepository();
    expect.truthy(target);
    expect.truthy(target._documentClient);
    expect.truthy(target._documentClient.get);
    const user = new User();
    user.userId = id;
    user.region = "test";
    const result = await target.upsert(user);
    
    expect.truthy(result.userId, id);
    expect.truthy(result);
});