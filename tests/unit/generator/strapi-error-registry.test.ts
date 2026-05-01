import { describe, it, expect } from 'vitest'
import { STRAPI_ERROR_REGISTRY } from '../../../src/generator/strapi-error-registry.js'

describe('STRAPI_ERROR_REGISTRY', () => {
    it('exports a non-empty array', () => {
        expect(Array.isArray(STRAPI_ERROR_REGISTRY)).toBe(true)
        expect(STRAPI_ERROR_REGISTRY.length).toBeGreaterThan(0)
    })

    it('has unique errorName values (no duplicates)', () => {
        const names = STRAPI_ERROR_REGISTRY.map(c => c.errorName)
        expect(new Set(names).size).toBe(names.length)
    })

    it('every entry has a non-empty errorName, status, and detailsType', () => {
        for (const c of STRAPI_ERROR_REGISTRY) {
            expect(c.errorName).toMatch(/\w/)
            expect(typeof c.status).toBe('number')
            expect(c.detailsType.length).toBeGreaterThan(0)
        }
    })

    describe('ValidationError', () => {
        const entry = STRAPI_ERROR_REGISTRY.find(
            c => c.errorName === 'ValidationError',
        )

        it('exists with status 400', () => {
            expect(entry).toBeDefined()
            expect(entry?.status).toBe(400)
        })

        it('details type references StrapiValidationIssue[]', () => {
            expect(entry?.detailsType).toBe(
                '{ errors: StrapiValidationIssue[] }',
            )
        })
    })

    describe('PolicyError', () => {
        const entry = STRAPI_ERROR_REGISTRY.find(
            c => c.errorName === 'PolicyError',
        )

        it('exists with status 403', () => {
            expect(entry).toBeDefined()
            expect(entry?.status).toBe(403)
        })

        it('details has policy and message fields', () => {
            expect(entry?.detailsType).toContain('policy?')
            expect(entry?.detailsType).toContain('message?')
        })
    })

    describe('stateless errors', () => {
        const stateless = [
            'UnauthorizedError',
            'ForbiddenError',
            'NotFoundError',
            'PayloadTooLargeError',
        ]

        it.each(stateless)(
            "%s has detailsType 'undefined' for cleaner DX",
            name => {
                const entry = STRAPI_ERROR_REGISTRY.find(
                    c => c.errorName === name,
                )
                expect(entry?.detailsType).toBe('undefined')
            },
        )
    })

    it('covers the documented Strapi v5 error names', () => {
        const expected = [
            'ValidationError',
            'BadRequestError',
            'UnauthorizedError',
            'ForbiddenError',
            'PolicyError',
            'NotFoundError',
            'ApplicationError',
        ]
        const names = STRAPI_ERROR_REGISTRY.map(c => c.errorName)
        for (const name of expected) {
            expect(names).toContain(name)
        }
    })
})
