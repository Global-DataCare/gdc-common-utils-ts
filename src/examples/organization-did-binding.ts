// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { buildOrganizationDidBindingBundle } from '../utils/organization-did-binding';
import {
  EXAMPLE_CONTROLLER_BINDING,
  EXAMPLE_TENANT_SERVICE_DID,
} from './shared';

export const EXAMPLE_ORGANIZATION_DID_BINDING_BUNDLE =
  buildOrganizationDidBindingBundle({
    organization: {
      url: [
        'https://provider.example.org',
        EXAMPLE_TENANT_SERVICE_DID,
      ],
    },
    controller: {
      sameAs: EXAMPLE_CONTROLLER_BINDING.sameAs,
    },
  });
