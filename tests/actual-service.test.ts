import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ActualService } from '../src/services/actual-service';

describe('ActualService', () => {
    const serverURL = 'http://localhost';
    const password = 'password';
    const e2eEncryptionPassword = 'e2e';
    const syncId = 'sync_id';
    let service: ActualService;

    beforeEach(() => {
        service = new ActualService(serverURL, password, e2eEncryptionPassword, syncId);
    });

    it('can be instantiated', () => {
        expect(service).toBeInstanceOf(ActualService);
    });

    it('initialize, importTransactions, and shutdown can be called (mocked)', async () => {
        service.initialize = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
        service.importTransactions = jest.fn<(accountId: string, transactions: any[]) => Promise<void>>().mockResolvedValue(undefined);
        service.shutdown = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
        await expect(service.initialize()).resolves.toBeUndefined();
        await expect(service.importTransactions('acc', [])).resolves.toBeUndefined();
        await expect(service.shutdown()).resolves.toBeUndefined();
    });
});
