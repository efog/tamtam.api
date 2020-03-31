const Services = require("../services/index.js");
const UserRepository = require("../services/repositories/user-repository.js");
const sinon = require("sinon");
const test = require("ava");

test("can instantiate user service", (expect) => {
    const target = new Services.UserService();
    expect.truthy(target);
});

test("gets a user by its id", async (expect) => {
    const id = "someone@example.com";
    const fakeUser = {
        "userId": id
    };
    const fakeUserRepo = {};
    const fakeGetByUserId = sinon.fake.returns(fakeUser);
    fakeUserRepo.getByUserId = fakeGetByUserId;
    
    const target = new Services.UserService(fakeUserRepo);
    const value = await target.getUser(id);
    expect.is(value.userId, id, "should call the backend and return a user object");
    expect.truthy(fakeGetByUserId.calledOnce);
});