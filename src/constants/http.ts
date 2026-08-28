/** Numeric HTTP status values shared by route adapters and tests. */
export const HttpStatusCodes = Object.freeze({
  Ok: 200,
  Created: 201,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  Conflict: 409,
  Gone: 410,
  InternalServerError: 500,
  ServiceUnavailable: 503,
} as const);

/** HTTP methods used by SDK and portal request builders. */
export const HttpRequestMethods = Object.freeze({
  Get: 'GET',
  Post: 'POST',
  Put: 'PUT',
  Patch: 'PATCH',
  Delete: 'DELETE',
} as const);

/** Canonical HTTP header names. */
export const HttpHeaderNames = Object.freeze({
  Authorization: 'authorization',
  ContentType: 'content-type',
} as const);

/** Media types shared by JSON route adapters. */
export const HttpMediaTypes = Object.freeze({
  Json: 'application/json',
} as const);
