import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { checkServerVersion } from "../src/services/actual-service.js";

describe("checkServerVersion", () => {
    it("does not throw when major.minor match", () => {
        assert.doesNotThrow(() => checkServerVersion("26.3.0", "26.3.0"));
    });

    it("does not throw when patch differs", () => {
        assert.doesNotThrow(() => checkServerVersion("26.3.1", "26.3.0"));
        assert.doesNotThrow(() => checkServerVersion("26.3.0", "26.3.5"));
    });

    it("throws when minor differs", () => {
        assert.throws(
            () => checkServerVersion("26.1.0", "26.3.0"),
            /server is 26\.1 but akahu-actual requires 26\.3/,
        );
    });

    it("throws when major differs", () => {
        assert.throws(
            () => checkServerVersion("25.3.0", "26.3.0"),
            /server is 25\.3 but akahu-actual requires 26\.3/,
        );
    });

    it("error message includes required minor version range", () => {
        assert.throws(
            () => checkServerVersion("26.1.0", "26.3.0"),
            /Please pin your Actual server to 26\.3\.x/,
        );
    });
});
