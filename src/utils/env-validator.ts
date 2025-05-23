interface EnvConfig {
    AKAHU_APP_TOKEN: string;
    AKAHU_USER_TOKEN: string;
    ACTUAL_SERVER_URL: string;
    ACTUAL_PASSWORD: string;
    ACTUAL_E2E_ENCRYPTION_PASSWORD: string;
    ACTUAL_SYNC_ID: string;
    ACCOUNT_MAPPINGS: string;
    DAYS_TO_FETCH?: string;
}

export interface ValidatedConfig {
    akahuAppToken: string;
    akahuUserToken: string;
    actualServerUrl: string;
    actualPassword: string;
    actualE2eEncryptionPassword: string | undefined;
    actualSyncId: string;
    accountMappings: Record<string, string>;
    daysToFetch: number;
}

export function validateEnv(): ValidatedConfig {
    const requiredEnvVars: (keyof EnvConfig)[] = [
        "AKAHU_APP_TOKEN",
        "AKAHU_USER_TOKEN",
        "ACTUAL_SERVER_URL",
        "ACTUAL_PASSWORD",
        "ACTUAL_SYNC_ID",
        "ACCOUNT_MAPPINGS",
    ];

    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`${envVar} is not set`);
        }
    }

    const accountMappings = JSON.parse(process.env.ACCOUNT_MAPPINGS!);
    if (Object.keys(accountMappings).length === 0) {
        throw new Error("ACCOUNT_MAPPINGS is empty");
    }

    const daysToFetch = Number(process.env.DAYS_TO_FETCH || "7");
    if (isNaN(daysToFetch) || daysToFetch <= 0) {
        throw new Error("DAYS_TO_FETCH must be a positive number");
    }

    return {
        akahuAppToken: process.env.AKAHU_APP_TOKEN!,
        akahuUserToken: process.env.AKAHU_USER_TOKEN!,
        actualServerUrl: process.env.ACTUAL_SERVER_URL!,
        actualPassword: process.env.ACTUAL_PASSWORD!,
        actualE2eEncryptionPassword: process.env.ACTUAL_E2E_ENCRYPTION_PASSWORD,
        actualSyncId: process.env.ACTUAL_SYNC_ID!,
        accountMappings,
        daysToFetch,
    };
}
