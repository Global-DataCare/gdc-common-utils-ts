// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.
// File: crypto-ts/models/jwt.ts

import { JwsDetachedSignParts } from "./jws.js";

export interface JwtCompactParts extends JwsDetachedSignParts {
  payload: string,
}

export interface DataCompactJWT {
  protected: object, // header protected by the signature (compact does not have unprotected header but JSON JWT does)
  payload: object,
  signature?: Uint8Array,
}

