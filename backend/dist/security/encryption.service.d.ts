export declare class EncryptedVaultData {
    cipherText: string;
    iv: string;
    authTag: string;
}
export declare class EncryptionService {
    private readonly logger;
    private readonly algorithm;
    private getMasterKey;
    encrypt(text: string): EncryptedVaultData;
    decrypt(data: EncryptedVaultData): string;
}
