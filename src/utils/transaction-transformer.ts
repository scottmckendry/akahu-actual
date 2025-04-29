import type { EnrichedTransaction } from "akahu";
import type { ActualTransaction } from "../services/actual-service.ts";

export function transformTransaction(
    transaction: EnrichedTransaction,
): ActualTransaction {
    return {
        imported_id: transaction._id,
        date: new Date(transaction.date),
        amount: Math.round(transaction.amount * 100),
        payee_name: transaction.merchant?.name || transaction.description,
        notes: formatTransactionNotes(transaction),
    };
}

function formatTransactionNotes(transaction: EnrichedTransaction): string {
    return `${transaction.type} • ${transaction.category?.name || ""} • ${transaction.description || ""}`
        .replace(/\s+•\s+$/, "")
        .replace(/\s+•\s+•\s+/, " • ");
}
