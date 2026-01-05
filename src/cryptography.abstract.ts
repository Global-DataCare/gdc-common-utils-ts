// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.
// File: crypto-ts/cryptography.abstract.ts

export abstract class CryptographyManagerAbstract {
    protected publicJWK = {};
    protected privateKeyBytes!: Uint8Array;

    constructor() {
    }

    /** Initializes public and private keys. */
    protected abstract newKeys(seedBytes?: Uint8Array): Promise<void>;

    /** Sets the public and private keys to be used. */
    protected setKeys(publicJWK: any, privateKeyBytes: Uint8Array): void {
        this.publicJWK = publicJWK;
        this.privateKeyBytes = privateKeyBytes;
    }

    /** Returns the public JWK */
    public getPublicJWK(): any {
        return this.publicJWK;
    }

    /** Returns the public Key ID ('kid') or empty string */
    public getKeyID(): string {
        return this.getPublicJWK().kid ? this.getPublicJWK().kid : '';
    }
}
