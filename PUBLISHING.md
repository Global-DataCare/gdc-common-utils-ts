# Publishing

This package is published as a public, unscoped package (`gdc-common-utils-ts`).

## NPM token

When creating a token in npmjs.com:
- `Packages and scopes` must be **Read and write**.
- `Organizations` permissions are **not required** for unscoped packages. Enable only if publishing under an org scope (`@org/`).

## Configure the token

```bash
npm config set //registry.npmjs.org/:_authToken=YOUR_TOKEN
```

Verify:

```bash
npm whoami
```

## Publish

```bash
npm publish --access public
```

If 2FA for publish is enabled, add an OTP:

```bash
NPM_CONFIG_OTP=123456 npm publish --access public
```
