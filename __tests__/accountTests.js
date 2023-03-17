

describe("Login test suite", () => { 
    it("logs in with user@abc", () => {
        username = "user@abc"
        password = "123"

        expect(`${username} ${password}`).toBe("user@abc 123");
    });

    // TODO: add useful automated tests

  });

