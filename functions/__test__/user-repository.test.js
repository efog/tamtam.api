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

test("queries dynamodb for document by userid", async (expect) => {
    const target = new UserRepository();
    const id = "someone@example.com";
    const user = {
        "userId": id
    };
    const dynamodb = {};
    const query = sinon.fake.returns(user);
    dynamodb.query = query;
    expect.truthy(target);
});