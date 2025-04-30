import { config } from "dotenv";
import type { TransactionQueryParams, EnrichedTransaction } from "akahu";
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

        await actualService.shutdown();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

main();
