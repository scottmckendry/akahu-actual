import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { ActualService } from "../src/services/actual-service.js";

describe("ActualService", () => {
    const serverURL = "http://localhost";
    const password = "password";
    const e2eEncryptionPassword = "e2e";
    const syncId = "sync_id";
    let service: ActualService;

    beforeEach(() => {
        service = new ActualService(serverURL, password, e2eEncryptionPassword, syncId);
    });

    it("can be instantiated", () => {
        assert.ok(service instanceof ActualService);
    });

    it("initialize, importTransactions, and shutdown can be called (mocked)", async () => {
        service.initialize = async () => undefined;
        service.importTransactions = async () => undefined;
        service.shutdown = async () => undefined;
        await assert.doesNotReject(service.initialize());
        await assert.doesNotReject(service.importTransactions("acc", []));
        await assert.doesNotReject(service.shutdown());
    });
});
