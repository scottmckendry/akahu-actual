import { config } from "dotenv";
import type { TransactionQueryParams, EnrichedTransaction } from "akahu";
import { AkahuService } from "./src/services/akahu-service.js";
import { ActualService } from "./src/services/actual-service.js";
import { transformTransaction } from "./src/utils/transaction-transformer.js";

async function main() {
    try {
        config();
        const accountMappings: Record<string, string> = process.env
            .ACCOUNT_MAPPINGS
            ? JSON.parse(process.env.ACCOUNT_MAPPINGS)
            : {};

        const daysToFetch = Number(process.env.DAYS_TO_FETCH || "7");
        const query: TransactionQueryParams = {
            start: new Date(
                Date.now() - daysToFetch * 86400 * 1000,
            ).toISOString(),
            end: new Date(Date.now()).toISOString(),
        };

        // Initialize services
        const akahuService = new AkahuService(
            process.env.AKAHU_APP_TOKEN!,
            process.env.AKAHU_USER_TOKEN!,
        );

        const actualService = new ActualService(
            process.env.ACTUAL_SERVER_URL!,
            process.env.ACTUAL_PASSWORD!,
            process.env.ACTUAL_SYNC_ID!,
        );

        // Fetch transactions
        const transactions = await akahuService.getTransactions(query);

        // Import transactions to Actual
        await actualService.initialize();

        for (const [akahuId, actualId] of Object.entries(accountMappings)) {
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
