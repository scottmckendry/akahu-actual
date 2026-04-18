import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { transformTransaction } from "../src/utils/transaction-transformer.js";

describe("transformTransaction", () => {
    it("transforms an enriched transaction to actual transaction", () => {
        const enriched = {
            _id: "tx1",
            date: "2025-08-01",
            amount: 12.34,
            merchant: { name: "Coffee Shop" },
            description: "Latte",
            type: "debit",
            category: { name: "Food" },
        };
        const actual = transformTransaction(enriched as any);
        assert.equal(actual.imported_id, "tx1");
        assert.deepEqual(actual.date, new Date("2025-08-01"));
        assert.equal(actual.amount, 1234);
        assert.equal(actual.payee_name, "Coffee Shop");
        assert.match(actual.notes, /debit/);
    });

    it("falls back to description if merchant missing", () => {
        const enriched = {
            _id: "tx2",
            date: "2025-08-01",
            amount: 10,
            description: "Groceries",
            type: "debit",
            category: { name: "Food" },
        };
        const actual = transformTransaction(enriched as any);
        assert.equal(actual.payee_name, "Groceries");
    });
});
