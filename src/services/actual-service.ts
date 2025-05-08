import * as api from "@actual-app/api";
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
        private readonly syncId: string,
    ) {}

    async initialize(): Promise<void> {
        await api.init({
            dataDir: os.tmpdir(),
            serverURL: this.serverURL,
            password: this.password,
        });
        await api.downloadBudget(this.syncId);
    }

    async importTransactions(
        accountId: string,
        transactions: ActualTransaction[],
    ): Promise<void> {
        await api.importTransactions(accountId, transactions);
    }

    async shutdown(): Promise<void> {
        await api.shutdown();
    }
}
