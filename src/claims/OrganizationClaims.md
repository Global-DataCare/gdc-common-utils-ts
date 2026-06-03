# OrganizationClaims

Documento de trabajo para proponer la clase `OrganizationClaims` en `gdc-sdk-core-ts`, con foco inicial en el caso `DeptOrg` / `Department`.

## Recurso

- FHIR resource: `Organization`
- Caso de uso principal: departamentos, servicios, clinics, legal entities
- Caso de uso inicial prioritario: `Department`

## Regla de naming

- Escalares: `get/set[SingleParamAttributeName]`
- Colecciones: `get/set/add/remove[PluralAttributeName]List`
- No usar `X`

## Ejemplo de uso propuesto

```ts
OrganizationClaims.create()
  .setIdentifier('dept-cardiology-001')
  .setActive(true)
  .setType('http://terminology.hl7.org/CodeSystem/organization-type|dept')
  .setName('Cardiology Department')
  .addAliasesList(['Cardiology', 'Heart Clinic'])
  .setPartOf('Organization/hospital-1')
  .addTelecomsList(['tel:+16045550101'])
  .setAddress('123 Main St, Vancouver')
  .toClaims();
```

## Metodos escalares propuestos

| Metodo | Tipo | Claim base | Nota |
| --- | --- | --- | --- |
| `getIdentifier()` | `string` | `Organization.identifier` | Identificador de negocio. |
| `setIdentifier(value)` | `string` | `Organization.identifier` |  |
| `getActive()` | `boolean` | `Organization.active` | Flag unico. |
| `setActive(value)` | `boolean` | `Organization.active` |  |
| `getType()` | `string` | `Organization.type` | Codigo principal. |
| `setType(value)` | `string` | `Organization.type` |  |
| `getName()` | `string` | `Organization.name` | Nombre visible. |
| `setName(value)` | `string` | `Organization.name` |  |
| `getPartOf()` | `string` | `Organization.part-of` | Organizacion padre. |
| `setPartOf(value)` | `string` | `Organization.part-of` |  |
| `getAddress()` | `string` | `Organization.address` | Direccion visible. |
| `setAddress(value)` | `string` | `Organization.address` |  |

## Metodos de coleccion propuestos

| Metodo | Tipo | Claim base | Nota |
| --- | --- | --- | --- |
| `getAliasesList()` | `string[]` | `Organization.alias` | Alias repetibles. |
| `setAliasesList(values)` | `string[]` | `Organization.alias` | Reemplaza toda la coleccion. |
| `addAliasesList(values)` | `string[]` | `Organization.alias` | Agrega sin duplicados. |
| `removeAliasesList(values)` | `string[]` | `Organization.alias` | Elimina valores concretos. |
| `getTelecomsList()` | `string[]` | `Organization.telecom` | Contactos repetibles. |
| `setTelecomsList(values)` | `string[]` | `Organization.telecom` | Reemplaza toda la coleccion. |
| `addTelecomsList(values)` | `string[]` | `Organization.telecom` | Agrega sin duplicados. |
| `removeTelecomsList(values)` | `string[]` | `Organization.telecom` | Elimina valores concretos. |

## Superficie minima propuesta

```ts
getIdentifier()
setIdentifier(value)
getActive()
setActive(value)
getType()
setType(value)
getName()
setName(value)
getPartOf()
setPartOf(value)
getAddress()
setAddress(value)
getAliasesList()
setAliasesList(values)
addAliasesList(values)
removeAliasesList(values)
getTelecomsList()
setTelecomsList(values)
addTelecomsList(values)
removeTelecomsList(values)
toClaims()
```

## Decision semantica

- La clase base debería llamarse `OrganizationClaims`.
- `Department` o `DeptOrg` se documenta como caso de uso, no como nombre de la clase.
- Si algun dia hace falta una fachada mas semantica, eso seria otra capa aparte.
