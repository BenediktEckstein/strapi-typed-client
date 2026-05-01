/**
 * Declarative registry of Strapi v5 error types and the shape of their
 * `details` payloads.
 *
 * Used by the client generator to emit:
 *   - the `StrapiErrorName` literal union
 *   - the `StrapiErrorDetailsMap` mapped type (keyed by errorName)
 *   - JSDoc on the generated `StrapiError` class
 *
 * Adding a new known error type means appending one entry here. Unknown
 * names still pass through at runtime via the `string` fallback in
 * `StrapiErrorName` and the `UnknownStrapiErrorDetails` type.
 *
 * Pattern parallels `plugin-registry.ts` so that a future OpenAPI-driven
 * pipeline can substitute either registry as a fallback when the
 * `@strapi/plugin-documentation` schema is unavailable.
 */

export interface StrapiErrorContract {
    /** Strapi-side error name, used as the discriminator value. */
    errorName: string
    /** Default HTTP status. Informational — runtime status comes from response. */
    status: number
    /**
     * TypeScript type expression for `details`.
     *
     * Use `'undefined'` for stateless errors so `err.details` is typed as
     * optional/undefined (cleaner DX than `Record<string, never>`).
     */
    detailsType: string
    /** Optional one-line description used as JSDoc on the union arm. */
    description?: string
}

export const STRAPI_ERROR_REGISTRY: StrapiErrorContract[] = [
    {
        errorName: 'ValidationError',
        status: 400,
        detailsType: '{ errors: StrapiValidationIssue[] }',
        description: 'Schema validation failed on the request body.',
    },
    {
        errorName: 'BadRequestError',
        status: 400,
        detailsType: 'Record<string, unknown>',
    },
    {
        errorName: 'PaginationError',
        status: 400,
        detailsType: 'Record<string, unknown>',
    },
    {
        errorName: 'UnauthorizedError',
        status: 401,
        detailsType: 'undefined',
        description: 'Missing or invalid auth token.',
    },
    {
        errorName: 'ForbiddenError',
        status: 403,
        detailsType: 'undefined',
        description: 'Token lacks permission for this endpoint.',
    },
    {
        errorName: 'PolicyError',
        status: 403,
        detailsType: '{ policy?: string; message?: string }',
        description: 'A Strapi policy rejected the request.',
    },
    {
        errorName: 'NotFoundError',
        status: 404,
        detailsType: 'undefined',
    },
    {
        errorName: 'ConflictError',
        status: 409,
        detailsType: 'Record<string, unknown>',
    },
    {
        errorName: 'PayloadTooLargeError',
        status: 413,
        detailsType: 'undefined',
    },
    {
        errorName: 'RateLimitError',
        status: 429,
        detailsType: 'Record<string, unknown>',
    },
    {
        errorName: 'ApplicationError',
        status: 500,
        detailsType: 'Record<string, unknown>',
    },
]
