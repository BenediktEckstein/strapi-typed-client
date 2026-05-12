# Extending Payload Types

`*GetPayload` mirrors your Strapi schema exactly. When a controller returns more than the schema describes — computed fields, narrower variants of an existing field — a direct `as Domain` cast won't compile:

```typescript
type Share = Omit<
    ProjectGetPayload<{ populate: { config: true } }>,
    'config'
> & {
    config: ProjectShareConfig[]
    watermark: boolean
    authorUsername: string
}

const data = (await strapi.projects.findOne(documentId, {
    populate: { config: true },
})) as Share
// TS2352: neither type sufficiently overlaps with the other.
```

`Omit` removes `config`, the intersection adds a different `config`, and the resulting `Share` is no longer a subtype of `ProjectGetPayload`. TypeScript correctly refuses the cross-cast. The recipes below cover the practical ways to bridge the gap.

## Spread With Per-Field Cast

For most cases this is the shortest path. Spread the payload, declare the additions and narrowings explicitly:

```typescript
const data = await strapi.projects.findOne(documentId, {
    populate: { item: { populate: ['category'] }, config: true },
})
if (!data) return null

const share: Share = {
    ...data,
    watermark: computeWatermark(data),
    authorUsername: getAuthorUsername(data),
    refCode: getRefCode(data),
    config: data.config as ProjectShareConfig[],
}
```

The cast is narrow and local to the one field that genuinely diverges from the schema. TypeScript still checks every other field against `Share`.

## Intersection When You Only Add Fields

If the domain type purely **adds** fields — no narrowing of existing ones — a plain intersection compiles without any cast:

```typescript
type ShareLite = ProjectPayload & {
    watermark: boolean
    authorUsername: string
}

const share = (await strapi.projects.findOne(...)) as ShareLite
```

`ShareLite` is a subtype of `ProjectPayload`, so `as` is valid.

## `as unknown as Domain` at the Boundary

When the gap is large enough that spread feels awkward, a double cast at the repository boundary is a fine pragmatic choice:

```typescript
async function findShare(documentId: string): Promise<Share | null> {
    const data = await strapi.projects.findOne(documentId, {
        populate: { item: { populate: ['category'] }, config: true },
    })
    return data as unknown as Share
}
```

Keep it at the boundary (one place per domain type, in the repository or data-access layer). The signature of `findShare` carries the `Share` contract from that point on, so the rest of the codebase stays cast-free.

## Mapper Function When You Want Explicitness

If you'd rather see every domain field assigned by hand — useful when the mapping is non-trivial or when reviewers benefit from the cross-reference — write a mapper:

```typescript
function toShare(
    payload: ProjectPayload,
    computed: { watermark: boolean; authorUsername: string; refCode?: string },
): Share {
    return {
        documentId: payload.documentId,
        item: payload.item,
        config: payload.config as ProjectShareConfig[],
        ...computed,
    }
}
```

This makes schema drift impossible to miss: rename a field in Strapi and the mapper fails to compile immediately.
