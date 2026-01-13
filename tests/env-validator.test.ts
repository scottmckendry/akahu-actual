import { describe, it, expect, beforeEach } from "@jest/globals";
import { validateEnv } from "../src/utils/env-validator";

describe("validateEnv", () => {
    beforeEach(() => {
        process.env.AKAHU_APP_TOKEN = "app_token";
        process.env.AKAHU_USER_TOKEN = "user_token";
        process.env.ACTUAL_SERVER_URL = "http://localhost";
        process.env.ACTUAL_PASSWORD = "password";
        process.env.ACTUAL_SYNC_ID = "sync_id";
        process.env.ACCOUNT_MAPPINGS = JSON.stringify({ acc_foo: "dddc8768-8a70-4d92-8e92-896bf07cc735" });
        process.env.DAYS_TO_FETCH = "7";
        delete process.env.RECONCILE_ACCOUNT_IDS;
    });

    it("returns validated config when env is valid", () => {
        const config = validateEnv();
        expect(config.akahuAppToken).toBe("app_token");
        expect(config.accountMappings).toEqual({ acc_foo: "dddc8768-8a70-4d92-8e92-896bf07cc735" });
        expect(config.daysToFetch).toBe(7);
    });

    it("throws if required env var is missing", () => {
        delete process.env.AKAHU_APP_TOKEN;
        expect(() => validateEnv()).toThrow(/AKAHU_APP_TOKEN is not set/);
    });

    it("throws if ACCOUNT_MAPPINGS is empty", () => {
        process.env.ACCOUNT_MAPPINGS = JSON.stringify({});
        expect(() => validateEnv()).toThrow(/ACCOUNT_MAPPINGS is empty/);
    });

    it("throws if DAYS_TO_FETCH is invalid", () => {
        process.env.DAYS_TO_FETCH = "not_a_number";
        expect(() => validateEnv()).toThrow(
            /DAYS_TO_FETCH must be a positive number/,
        );
    });

    it("throws if account mapping uuids are invalid", () => {
        process.env.ACCOUNT_MAPPINGS = JSON.stringify({akahu_account: "actual_account_id"});
        expect(() => validateEnv()).toThrow(
            /ACCOUNT_MAPPINGS values must be a valid UUID \(actual_account_id\)/
        )
    })

    it("throws if reconcile account ids are invalid", () => {
        process.env.RECONCILE_ACCOUNT_IDS = JSON.stringify(["actual_account_id"]);
        expect(() => validateEnv()).toThrow(
            /RECONCILE_ACCOUNT_IDS values must be a valid UUID \(actual_account_id\)/
        )
    })
});
