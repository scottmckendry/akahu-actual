import type {
    TransactionQueryParams,
    EnrichedTransaction,
    Account,
} from "akahu";
import { config } from "dotenv";
import { AkahuService } from "./services/akahu-service.js";
import { ActualService } from "./services/actual-service.js";
import { transformTransaction } from "./utils/transaction-transformer.js";
import { validateEnv, ValidatedConfig } from "./utils/env-validator.js";

async function main() {
    try {
        config();
        const conf: ValidatedConfig = validateEnv();
        const query: TransactionQueryParams = {
            start: new Date(
                Date.now() - conf.daysToFetch * 86400 * 1000,
            ).toISOString(),
            end: new Date(Date.now()).toISOString(),
        };

        // Initialize services
        const akahuService = new AkahuService(
            conf.akahuAppToken,
            conf.akahuUserToken,
        );

        const actualService = new ActualService(
            conf.actualServerUrl,
            conf.actualPassword,
            conf.actualE2eEncryptionPassword,
            conf.actualSyncId,
        );

        // Fetch transactions
        const transactions = await akahuService.getTransactions(query);

        // Import transactions to Actual
        await actualService.initialize();

        for (const [akahuId, actualId] of Object.entries(
            conf.accountMappings,
        )) {
            const accountTransactions = transactions
                .filter((t: EnrichedTransaction) => t._account === akahuId)
                .map(transformTransaction);

            await actualService.importTransactions(
                actualId,
                accountTransactions,
            );
        }

        // Reconcile balances for specified Akahu accounts
        if (conf.reconcileAccountIds.length > 0) {
            const akahuAccounts: Account[] = await akahuService.getAccounts();
            const balanceByAkahuId = new Map<string, number>();
            for (const acct of akahuAccounts) {
                if (acct.balance == undefined) {
                    continue;
                }
                const balance = acct.balance.current;
                balanceByAkahuId.set(acct._id, balance);
            }
            for (const akahuId of conf.reconcileAccountIds) {
                const actualId = conf.accountMappings[akahuId];
                if (!actualId) {
                    console.warn(
                        `No Actual account mapping for Akahu account ID: ${akahuId}`,
                    );
                    continue;
                }
                const targetBalance = balanceByAkahuId.get(akahuId);
                if (typeof targetBalance !== "number") {
                    console.warn(
                        `No balance found for Akahu account ID: ${akahuId}`,
                    );
                    continue;
                }
                await actualService.reconcileAccountBalance(
                    actualId,
                    targetBalance,
                );
            }
        }

        await actualService.shutdown();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

main();
