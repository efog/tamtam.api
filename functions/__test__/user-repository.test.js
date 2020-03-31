import User from "../services/models/user.js";
import UserRepository from "../services/repositories/user-repository.js";
import sinon from "sinon";
import test from "ava";

test("can instantiate user repository", (expect) => {
    const target = new UserRepository({});
    expect.truthy(target);
});

test("can load iac from config", (expect) => {
    const target = new UserRepository();
    const config = target.IacCatalog;
    expect.truthy(config);
});

test("queries dynamodb for document by userid, existing document", async (expect) => {
    const id = "someone@example.com";
    const user = {
        "Item": {
            "userId": {
                "S": id
            }
        }
    };
    const promise = () => {
        return new Promise((resolve, reject) => {
            return resolve(user);
        });
    };
    const dynamodb = {};
    const getItem = sinon.fake.returns({ "promise": promise });
    dynamodb.getItem = getItem;

    const target = new UserRepository(dynamodb);
    expect.truthy(target);

    const result = await target.getByUserId(id);

    expect.truthy(getItem.calledOnce);
    expect.is(result.userId, id);
});


test("queries dynamodb for document by userid, throws error", async (expect) => {
    const id = "someone@example.com";
    const promise = () => {
        return new Promise((resolve, reject) => {
            return reject({});
        });
    };
    const get = sinon.fake.returns({ "promise": promise });
    const documentClient = {
        "get": get
    };

    documentClient.get();

    const target = new UserRepository(documentClient);
    expect.truthy(target);
    expect.truthy(target._documentClient);
    expect.truthy(target._documentClient.get);

    try {
        const result = await target.getByUserId(id);
    }
    catch (err) {
        expect.truthy(err);
        expect.pass();
    }
});