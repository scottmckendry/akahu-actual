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

    async shutdown(): Promise<void> {
        await api.shutdown();
    }
}
