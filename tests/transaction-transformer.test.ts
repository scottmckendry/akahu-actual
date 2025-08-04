import { describe, it, expect } from "@jest/globals";
import { transformTransaction } from "../src/utils/transaction-transformer";

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
        expect(actual.imported_id).toBe("tx1");
        expect(actual.date).toEqual(new Date("2025-08-01"));
        expect(actual.amount).toBe(1234);
        expect(actual.payee_name).toBe("Coffee Shop");
        expect(actual.notes).toMatch(/debit/);
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
        expect(actual.payee_name).toBe("Groceries");
    });
});
