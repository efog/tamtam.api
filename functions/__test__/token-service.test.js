const Services = require("../services/index.js");
const sinon = require("sinon");
const test = require("ava");

test("can fetch token fron access code", async (expect) => {
    const fakeRequest = sinon.fake.returns(Promise.resolve(
        {
            "statusCode": 200,
            "body": {
                "id_token": "abcd",
                "access_token": "efgh",
                "refresh_token": "ijkl"
            }
        }));
    const target = new Services.TokenService(fakeRequest);
    expect.truthy(target);
    const result = await target.getAccessTokenFromCode("a", "b", "c", "d", "e");
    expect.is(result.body.access_token, "efgh");
});

test("can raise errors", async (expect) => {
    const fakeRequest = sinon.fake.returns(Promise.reject(new Error("shall fail")));
    const target = new Services.TokenService(fakeRequest);
    expect.truthy(target);
    try {
        const result = await target.getAccessTokenFromCode("a", "b", "c", "d", "e");
    }
    catch (err) {
        expect.is(err.code, 500);
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

test("can parse id token", async (expect) => {
    const token = "eyJraWQiOiIxYXlLMGxHRGdGa1dzUGxacWx2aGMrVmQ5aSs2MU1WZVN1R2daekJMYlRBPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiWXBEUTBtZkh5ek5BZ1BWY08yRnRsdyIsInN1YiI6ImY5OTU1NjgzLThmYWEtNGNmNC04NDU1LWE3ODBjZjNhNDYxYiIsImF1ZCI6IjRrZ2pvODA5a3RvbThsMTU0NTZob3F1N3NiIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTU4NzEzODkxMSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfWHBYVHN2Q2pRIiwiY29nbml0bzp1c2VybmFtZSI6ImY5OTU1NjgzLThmYWEtNGNmNC04NDU1LWE3ODBjZjNhNDYxYiIsImV4cCI6MTU4NzE0MjUxMSwiaWF0IjoxNTg3MTM4OTExLCJlbWFpbCI6ImV0aWVubmUuYnJvdWlsbGFyZEBvdXRsb29rLmNvbSJ9.Og7SvLJvpyw-b4vEvdg9TLnzWS4vStAssCLjqDkqmYcvycWMxEKB0Okaw0CREKnbALaVqrmJGzVk6WXHoZbaj_anzWYybXTPItZz1v9fl55CbgKsCjfXC0g2uhw0GPC1wcOiwNPSLTr8RgcRXxMSg63gDpLtCUVTtkSK4RnGbHMKQ0_yi-z1FvgI8gh29qbMqrGvqPyf1hcPmAM1DHX-pSeJUkrtFlo09SVr2sNnobgkL7uqYT6tN4kca09WBn9x-afPBwN7q8YS_6VzYtKVueb52GgWO1QC54YzbM32LFy1hvzK6vgtlQhDfQYyy9-PVEJBNY_2zFYKva2f4uX7Ig";
    const target = new Services.TokenService();
    expect.truthy(target);
    const parsedToken = await target.parseToken(token);
    expect.truthy(parsedToken);
    expect.is(parsedToken.email, "etienne.brouillard@outlook.com");
});

test("can parse access token", async (expect) => {
    const token = "eyJraWQiOiI2SzhRb29FRHd0M3UwS1wvZTI0RmJKd1VuVVRFN2tQeWIyYnBCQVZ1bUhUND0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmOTk1NTY4My04ZmFhLTRjZjQtODQ1NS1hNzgwY2YzYTQ2MWIiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6InBob25lIG9wZW5pZCBwcm9maWxlIGh0dHBzOlwvXC9kZXYuYXBpLnRhbXRhbS5lZm9nLmNhXC9hcGkuYWNjZXNzIGh0dHBzOlwvXC9kZXYuYXBpLnRhbXRhbS5lZm9nLmNhXC91c2VyLnJlYWQgZW1haWwgaHR0cHM6XC9cL2Rldi5hcGkudGFtdGFtLmVmb2cuY2FcL3VzZXIud3JpdGUiLCJhdXRoX3RpbWUiOjE1ODcxMzg5MTEsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1hwWFRzdkNqUSIsImV4cCI6MTU4NzE0MjUxMSwiaWF0IjoxNTg3MTM4OTExLCJ2ZXJzaW9uIjoyLCJqdGkiOiJiNjk2NjBmZC05YjMzLTRlZGItYTg0MS1jZGY3MTM2ZjgzMmUiLCJjbGllbnRfaWQiOiI0a2dqbzgwOWt0b204bDE1NDU2aG9xdTdzYiIsInVzZXJuYW1lIjoiZjk5NTU2ODMtOGZhYS00Y2Y0LTg0NTUtYTc4MGNmM2E0NjFiIn0.pNjXLbrWZhmK086Pl0XBXkudw1abKxA14QkTGf8eGlD3GwJ4JQOA83Vy3XBqszWZ7ymoalPNOVUxXNwrgJJjLrj2QgG3gU7zIKMCsCVvtO_MWBtAs971KT-9dqI24x9dV1nBuLvFFTtQAZbb3mm2qwI3_3rFk6mP6iPEXmsYYj5lOGDLXMfMSB2YMiH8_56gdSRJ171cVBlJQMKFt-goNk8C-wZrtBlj2JvXrP9BwCMTMLPL0XZfUgJlyCFKUfc2HUImSL8SYBGwEyecpFoOWPZQpSyusPXMnZtf_MXQ3Rrnmdua9MSfH3TPJqEljhziQebmg35KnJXIP8z3oUaoUQ";
    const target = new Services.TokenService();
    expect.truthy(target);
    const parsedToken = await target.parseToken(token);
    expect.truthy(parsedToken);
    expect.is(parsedToken.username, "f9955683-8faa-4cf4-8455-a780cf3a461b");
});

test("can save updated userdata from tokens", async (expect) => {
    const tokenData = {
        "id_token": "eyJraWQiOiIxYXlLMGxHRGdGa1dzUGxacWx2aGMrVmQ5aSs2MU1WZVN1R2daekJMYlRBPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiWXBEUTBtZkh5ek5BZ1BWY08yRnRsdyIsInN1YiI6ImY5OTU1NjgzLThmYWEtNGNmNC04NDU1LWE3ODBjZjNhNDYxYiIsImF1ZCI6IjRrZ2pvODA5a3RvbThsMTU0NTZob3F1N3NiIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTU4NzEzODkxMSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfWHBYVHN2Q2pRIiwiY29nbml0bzp1c2VybmFtZSI6ImY5OTU1NjgzLThmYWEtNGNmNC04NDU1LWE3ODBjZjNhNDYxYiIsImV4cCI6MTU4NzE0MjUxMSwiaWF0IjoxNTg3MTM4OTExLCJlbWFpbCI6ImV0aWVubmUuYnJvdWlsbGFyZEBvdXRsb29rLmNvbSJ9.Og7SvLJvpyw-b4vEvdg9TLnzWS4vStAssCLjqDkqmYcvycWMxEKB0Okaw0CREKnbALaVqrmJGzVk6WXHoZbaj_anzWYybXTPItZz1v9fl55CbgKsCjfXC0g2uhw0GPC1wcOiwNPSLTr8RgcRXxMSg63gDpLtCUVTtkSK4RnGbHMKQ0_yi-z1FvgI8gh29qbMqrGvqPyf1hcPmAM1DHX-pSeJUkrtFlo09SVr2sNnobgkL7uqYT6tN4kca09WBn9x-afPBwN7q8YS_6VzYtKVueb52GgWO1QC54YzbM32LFy1hvzK6vgtlQhDfQYyy9-PVEJBNY_2zFYKva2f4uX7Ig",
        "access_token": "eyJraWQiOiI2SzhRb29FRHd0M3UwS1wvZTI0RmJKd1VuVVRFN2tQeWIyYnBCQVZ1bUhUND0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmOTk1NTY4My04ZmFhLTRjZjQtODQ1NS1hNzgwY2YzYTQ2MWIiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6InBob25lIG9wZW5pZCBwcm9maWxlIGh0dHBzOlwvXC9kZXYuYXBpLnRhbXRhbS5lZm9nLmNhXC9hcGkuYWNjZXNzIGh0dHBzOlwvXC9kZXYuYXBpLnRhbXRhbS5lZm9nLmNhXC91c2VyLnJlYWQgZW1haWwgaHR0cHM6XC9cL2Rldi5hcGkudGFtdGFtLmVmb2cuY2FcL3VzZXIud3JpdGUiLCJhdXRoX3RpbWUiOjE1ODcxMzg5MTEsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1hwWFRzdkNqUSIsImV4cCI6MTU4NzE0MjUxMSwiaWF0IjoxNTg3MTM4OTExLCJ2ZXJzaW9uIjoyLCJqdGkiOiJiNjk2NjBmZC05YjMzLTRlZGItYTg0MS1jZGY3MTM2ZjgzMmUiLCJjbGllbnRfaWQiOiI0a2dqbzgwOWt0b204bDE1NDU2aG9xdTdzYiIsInVzZXJuYW1lIjoiZjk5NTU2ODMtOGZhYS00Y2Y0LTg0NTUtYTc4MGNmM2E0NjFiIn0.pNjXLbrWZhmK086Pl0XBXkudw1abKxA14QkTGf8eGlD3GwJ4JQOA83Vy3XBqszWZ7ymoalPNOVUxXNwrgJJjLrj2QgG3gU7zIKMCsCVvtO_MWBtAs971KT-9dqI24x9dV1nBuLvFFTtQAZbb3mm2qwI3_3rFk6mP6iPEXmsYYj5lOGDLXMfMSB2YMiH8_56gdSRJ171cVBlJQMKFt-goNk8C-wZrtBlj2JvXrP9BwCMTMLPL0XZfUgJlyCFKUfc2HUImSL8SYBGwEyecpFoOWPZQpSyusPXMnZtf_MXQ3Rrnmdua9MSfH3TPJqEljhziQebmg35KnJXIP8z3oUaoUQ",
        "refresh_token": "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.r2KHsTYQXELJNoIqxecGQZYmZky8jCTryLRQDxGm0lwT_YwUYK5j4pmO1xFNBDLikWxccaXpdEKDZnIT21GtG7WDmYh8Mt8OVYrHan_neNbMdWCO4xmVmrf_imp-6qC-GpN2MKWiwBjlcqG-k9vv4R3Lnu7bHiukesKCNedIWlUHWijzGWf16sKe56KKTwYESzz6ZQypF027hQ3rouoTWdR_E1dctqlZrEzqD53Zm420rn1HkR33YSU6ikt8n2k6YRr3NgyWJVPBp-bahD7wE9e-o-5blU8s2WuqH-tD9eySv7yVuRSyjT-sn1kT8MvEiY1AiAK5t0Cwepl3K7xSQA.qRjk_FrnYFtS1W1b.o-yn0xUgPs3bvxs60UUInCEJ_0vQ06visYaz9-_tFFH9xbzVeMNZvjs4wVOWXqQdBWt6DoENdvRkKrhK0WXbdyfGEW00VNUKbAVMD15UYaz8MOvZY5jay0Sk-LlHGLT6uXgR23Yh16bVBLAEhnj48Hlu4ZsgesqgbongfSZQ5woLpCPQTmgjcPd3ZGnuotOBn_hDQeYrSEfYZDGHvsdaCd_UScSnMIFn-5S6Rk34DCRQ3YjdnfX2jDESM3sLNwWhkwcQRWQRdJ1uJ7pfRCqrdHrjTuKpIEVtl8ROtNR7FzpjMPOmMIv5Vrj3zNZBHnER5Zp0JoOMogrZLX2oSTz93-X5zki0b6cigpe2QlVTlmPfTzio2pxoSYK-sJY_TMC5EekwODzLzGiqeAGOpt42YVEAGDZhQK9fm_6dqAaZ4tyF2YXumxlTjEdQ_PAz5D79qcyfNvBgsZi6A04PD71TmmvCugasHteMgFkgxWlLWGxi5oGUrBwQDJeEEA-gxOMW9ZBNMXC7CCZRl9Wl4_NWlHNHC2idyKuZsdUejHWpdY2F7QcsbOrLq7M3KtmIvPt7-5mWyFgkPtgfL6VgLb5PU_iThzd4Lrp9Cq6vSGWf7orRPtkr_qaPL8ZYEBN9Wm4ZTfggHbGubGs-VM6AR5-U2m7FXSvNeoHVS_KSN0YcH1f4km-zOWfggr_yoru4KPUXDalOfZDW13RfXFWCrO2x_1JrqKS9GqGVkSRixoosf0ZSMtT5H0dM3Jr849Yi--bEGwOfIS-wR0ODh2FauTgz1qRlAd5ueQQakKM0lRpJIBce33adomGQjQ5A9DGWzBbEX_lD7qY23uOgvFV27SGKFVn5IdDfF7qhvtTcZOcJCFO2WTw8oE-_mpykpwrJXIC_iW7ZFp5iZX3yWzK1r6VAW9WLQNNl8qkX00xGJ899zbWDZAd4aGd_exyVvOGHnVdTuTlulaAY4oAG9U2gFejAgIwrBf1O_Pqm2MYn2GnUyox2w6wEWmOicpL81-LxOfvKFIoCizvS9iZEGC3gW7Wc3NrQsHYHi9R5Cad06XTOGpeTRZXkyG1iZkAhs6-SDnrPrPtgpH4gus38NQWs4uZp6eaafkHeVYe_TM0N5iXDHzbhWR-BV7Cx_dSaeT6zqkNy2orW55XJwXC1JKmvOZt3BfPBNwZ7k05VPvITMVFt73Bx3ojiZFuUfUofzW8sJpRUSXkzcL00H7D6CfNamn_LDXD4bwlpBfxTJ8mjXLmTxpYJxfBhY2jgb-yaSyaJOQR3MVs6vk4CyHU1UItia2xfvZOe0ADzaFC11D3uiRQZ_ChcyLS-74KwwNsaCATNwLZuCB-RFCjnl9pe6aXGfg8Ch-gWJnDvvxYH0SMgUxSKyG0YDZRq03ne4HMlPpNmU1LkxzIZecsZJTz5FENSy8UKRdJoLMpdW39cBhXnAB6nt3SSQI-rtUlOYLeUGwCxjhHceH6wL74FXJRaXVmrMMjDrJTvoC61FC1Vpug.SaeaDDEnL_xkWmRYaV516w",
        "expires_in": 3600,
        "token_type": "Bearer"
    };
    const fakeUpsert = sinon.fake.returns(Promise.resolve());
    const userRepository = {
        "upsert": fakeUpsert
    };
    const target = new Services.TokenService(null, userRepository);
    const retVal = await target.updateUserDataFromIdToken(tokenData);
    expect.is(retVal.email, "etienne.brouillard@outlook.com");
    expect.is(retVal.userId, "f9955683-8faa-4cf4-8455-a780cf3a461b");
});