import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { AkahuService } from "../src/services/akahu-service.js";

describe("AkahuService", () => {
    const appToken = "app_token";
    const userToken = "user_token";
    let service: AkahuService;

    beforeEach(() => {
        service = new AkahuService(appToken, userToken);
    });

    it("can be instantiated", () => {
        assert.ok(service instanceof AkahuService);
    });

    it("getTransactions can be called (mocked)", async () => {
        service.getTransactions = async () => [];
        await assert.doesNotReject(
            service.getTransactions({
                start: "2025-08-01",
                end: "2025-08-04",
            } as any),
        );
    });
});
