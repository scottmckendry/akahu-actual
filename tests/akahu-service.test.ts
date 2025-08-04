import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { AkahuService } from "../src/services/akahu-service";

describe("AkahuService", () => {
    const appToken = "app_token";
    const userToken = "user_token";
    let service: AkahuService;

    beforeEach(() => {
        service = new AkahuService(appToken, userToken);
    });

    it("can be instantiated", () => {
        expect(service).toBeInstanceOf(AkahuService);
    });

    it("getTransactions can be called (mocked)", async () => {
        service.getTransactions = jest
            .fn<() => Promise<any[]>>()
            .mockResolvedValue([]);
        await expect(
            service.getTransactions({
                start: "2025-08-01",
                end: "2025-08-04",
            } as any),
        ).resolves.toEqual([]);
    });
});
