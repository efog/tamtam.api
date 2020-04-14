const Services = require("../services/index.js");
const sinon = require("sinon");
const test = require("ava");

test("can fetch token fron access code", async (expect) => {
    const fakeRequest = sinon.fake.returns(Promise.resolve(
        {
            "statusCode": "200",
            "body": {
                "id_token": "abcd",
                "access_token": "efgh",
                "refresh_token": "ijkl"
            }
        }));
    const target = new Services.TokenService(fakeRequest);
    expect.truthy(target);
    const result = await target.getAccessTokenFromCode("a", "b", "c", "d", "e");
    expect.is(result.access_token, "efgh");
});

test("can raise errors", async (expect) => {
    const fakeRequest = sinon.fake.returns(Promise.reject(new Error("shall fail")));
    const target = new Services.TokenService(fakeRequest);
    expect.truthy(target);
    try {
        const result = await target.getAccessTokenFromCode("a", "b", "c", "d", "e");
    }
    catch (err) {
        expect.pass();
    }
});

test("can raise error from expired code", async (expect) => {
    const fakeRequest = sinon.fake.returns(Promise.resolve(
        {
            "statusCode": "400",
            "body": { "error": "invalid_grant" }
        }));
    const target = new Services.TokenService(fakeRequest);
    expect.truthy(target);
    try {
        const result = await target.getAccessTokenFromCode("a", "b", "c", "d", "e");
    }
    catch (err) {
        expect.pass();
    }
});