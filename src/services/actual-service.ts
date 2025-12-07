import * as api from "@actual-app/api";
import { ImportTransactionEntity } from "@actual-app/api/@types/loot-core/src/types/models";
import * as os from "os";

export interface ActualTransaction {
    imported_id: string;
    date: Date;
    amount: number;
    payee_name: string;
    notes: string;
}

export class ActualService {
    constructor(
        private readonly serverURL: string,
        private readonly password: string,
        private readonly e2eEncryptionPassword: string | undefined,
        private readonly syncId: string,
    ) {}

    async initialize(): Promise<void> {
        await api.init({
            dataDir: os.tmpdir(),
            serverURL: this.serverURL,
            password: this.password,
        });
        const downloadParams = this.e2eEncryptionPassword
            ? { password: this.e2eEncryptionPassword }
            : undefined;
        await api.downloadBudget(this.syncId, downloadParams);
    }

    async importTransactions(
        accountId: string,
        transactions: ActualTransaction[],
    ): Promise<void> {
        const formattedTransactions: ImportTransactionEntity[] =
            transactions.map((t) => {
                const dateStr = t.date.toISOString().slice(0, 10);
                return {
                    account: accountId,
                    date: dateStr,
                    amount: t.amount,
                    payee_name: t.payee_name,
                    notes: t.notes,
                    imported_id: t.imported_id,
                };
            });
        await api.importTransactions(accountId, formattedTransactions);
    }

    async reconcileAccountBalance(
        accountId: string,
        targetBalanceDecimal: number,
    ): Promise<void> {
        const targetBalance = Math.round(targetBalanceDecimal * 100);
        const currentBalance = await api.getAccountBalance(accountId);
        const delta = targetBalance - currentBalance;
        if (delta === 0) {
            return;
        }
        const adjustment: ActualTransaction = {
            imported_id: `balance_adjustment_${accountId}_${new Date()
                .toISOString()
                .slice(0, 10)}`,
            date: new Date(),
            amount: delta,
            payee_name: "Balance Adjustment",
            notes: "Auto-reconcile from Akahu balance",
        };
        await this.importTransactions(accountId, [adjustment]);
    }

    async shutdown(): Promise<void> {
        await api.shutdown();
    }
}
