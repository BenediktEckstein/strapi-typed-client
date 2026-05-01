// Stub file — compiled to dist/index.js by `tsc`.
// When the user runs `npx strapi-types generate`, the generator overwrites
// dist/index.js (and .d.ts) with real, schema-aware code.
// Until then this stub provides importable symbols that throw at runtime
// with a helpful message explaining what to do.
//
// IMPORTANT: keep this file in lockstep with what the generator emits in
// `src/generator/client-generator.ts`. Pre-generation imports must compile.

const NOT_GENERATED_MESSAGE =
    '[strapi-typed-client] Types have not been generated yet.\n' +
    'Run: npx strapi-types generate --url <your-strapi-url>\n' +
    'Docs: https://github.com/BoxLab-Ltd/strapi-typed-client#quick-start'

/**
 * A single validation issue inside a `ValidationError`.
 * Mirrors the Yup-style errors Strapi propagates from schema validation.
 */
export interface StrapiValidationIssue {
    path: string[]
    message: string
    name: string
}

/**
 * Known Strapi v5 error names. Other strings still pass through at
 * runtime (for plugin or future-version errors) via the `(string & {})`
 * fallback.
 */
export type StrapiErrorName =
    | 'ValidationError'
    | 'BadRequestError'
    | 'PaginationError'
    | 'UnauthorizedError'
    | 'ForbiddenError'
    | 'PolicyError'
    | 'NotFoundError'
    | 'ConflictError'
    | 'PayloadTooLargeError'
    | 'RateLimitError'
    | 'ApplicationError'
    | (string & {})

/**
 * Maps each known `StrapiErrorName` to its `details` payload shape.
 * Used by `isStrapiErrorOf` to narrow `details` after the discriminator
 * check. Wrapped in `Partial` because Strapi may omit `details` even
 * when the error name is known.
 */
export type StrapiErrorDetailsMap = Partial<{
    ValidationError: { errors: StrapiValidationIssue[] }
    BadRequestError: Record<string, unknown>
    PaginationError: Record<string, unknown>
    UnauthorizedError: undefined
    ForbiddenError: undefined
    PolicyError: { policy?: string; message?: string }
    NotFoundError: undefined
    ConflictError: Record<string, unknown>
    PayloadTooLargeError: undefined
    RateLimitError: Record<string, unknown>
    ApplicationError: Record<string, unknown>
}>

/**
 * Fallback shape when `errorName` is not in `StrapiErrorDetailsMap`
 * (e.g. 3rd-party plugin errors or Strapi versions newer than this client).
 */
export interface UnknownStrapiErrorDetails {
    errorName: string
    details?: Record<string, unknown>
}

/**
 * Error thrown for non-2xx responses from Strapi. Use `isStrapiErrorOf`
 * to narrow `details` to its typed shape.
 *
 * @example
 * try { await strapi.articles.create({ title: '' }) }
 * catch (e) {
 *   if (isStrapiErrorOf(e, 'ValidationError')) {
 *     for (const issue of e.details?.errors ?? []) {
 *       console.log(issue.path.join('.'), issue.message)
 *     }
 *   }
 * }
 */
export class StrapiError extends Error {
    userMessage: string
    status: number
    statusText: string
    /**
     * Strapi-side error name (e.g. "ValidationError"). `Error.name`
     * itself remains "StrapiError" so Sentry/sourcemap contracts are
     * unchanged.
     */
    errorName: StrapiErrorName
    /** Narrow via `isStrapiErrorOf` for typed access. */
    details?: unknown

    constructor(
        message: string,
        userMessage: string,
        status: number,
        statusText: string,
        details?: unknown,
        errorName: StrapiErrorName = 'UnknownError',
    ) {
        super(message)
        this.name = 'StrapiError'
        this.userMessage = userMessage
        this.status = status
        this.statusText = statusText
        this.errorName = errorName
        this.details = details
    }
}

export class StrapiConnectionError extends Error {
    url: string
    cause?: Error

    constructor(message: string, url: string, cause?: Error) {
        super(message)
        this.name = 'StrapiConnectionError'
        this.url = url
        this.cause = cause
    }
}

/** Type guard: is the value a StrapiError instance? */
export function isStrapiError(err: unknown): err is StrapiError {
    return err instanceof StrapiError
}

/**
 * Type guard that narrows both `errorName` and `details` for a specific
 * Strapi error type.
 *
 * @example
 * if (isStrapiErrorOf(err, 'ValidationError')) {
 *   err.details?.errors?.[0]?.path // string[] | undefined
 * }
 */
export function isStrapiErrorOf<N extends keyof StrapiErrorDetailsMap>(
    err: unknown,
    name: N,
): err is StrapiError & {
    errorName: N
    details: StrapiErrorDetailsMap[N]
} {
    return isStrapiError(err) && err.errorName === name
}

export class StrapiClient {
    constructor(_config: { baseURL: string; token?: string }) {
        throw new Error(NOT_GENERATED_MESSAGE)
    }
}
