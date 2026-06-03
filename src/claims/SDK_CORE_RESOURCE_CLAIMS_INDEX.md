# SDK Core Resource Claims Index

Indice de documentos de trabajo para revisar, recurso por recurso, la fachada fluida que `gdc-sdk-core-ts` debería exponer encima de `gdc-common-utils-ts/src/claims`.

## Regla acordada

- Si FHIR permite repetición y queremos exponerla, el método termina en `List`.
- Los códigos se enseñan como escalares por defecto, salvo necesidad clara de negocio para manejarlos como colección.
- La nomenclatura es explícita; no se usa `X`.
- Escalares: `get/set[SingleParamAttributeName]`
- Colecciones: `get/set/add/remove[PluralAttributeName]List`

## Documentos por recurso

- [OrganizationClaims.md](./OrganizationClaims.md)
- [LocationClaims.md](./LocationClaims.md)

## Prioridad inicial

- `OrganizationClaims`
- `LocationClaims`

## Nota

- `common-utils` sigue siendo la fuente de verdad de la lógica.
- `sdk-core` solo debería añadir wrappers finos y descubribles.
