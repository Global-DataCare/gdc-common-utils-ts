# LocationClaims

Documento de trabajo para proponer la clase `LocationClaims` en `gdc-sdk-core-ts`.

## Recurso

- FHIR resource: `Location`
- Caso de uso principal: sedes, consultas, oficinas, laboratorios, salas

## Regla de naming

- Escalares: `get/set[SingleParamAttributeName]`
- Colecciones: `get/set/add/remove[PluralAttributeName]List`
- No usar `X`

## Ejemplo de uso propuesto

```ts
LocationClaims.create()
  .setIdentifier('room-201')
  .setStatus('active')
  .setName('Consultation Room 201')
  .setDescription('Second floor consultation room')
  .setType('http://terminology.hl7.org/CodeSystem/v3-RoleCode|OF')
  .setMode('instance')
  .addTelecomsList(['tel:+16045550102'])
  .setAddress('123 Main St, Vancouver')
  .setPhysicalType('http://terminology.hl7.org/CodeSystem/location-physical-type|ro')
  .setManagingOrganization('Organization/dept-cardiology-001')
  .setPartOf('Location/building-a')
  .toClaims();
```

## Metodos escalares propuestos

| Metodo | Tipo | Claim base | Nota |
| --- | --- | --- | --- |
| `getIdentifier()` | `string` | `Location.identifier` | Identificador de negocio. |
| `setIdentifier(value)` | `string` | `Location.identifier` |  |
| `getStatus()` | `string` | `Location.status` | Codigo principal. |
| `setStatus(value)` | `string` | `Location.status` |  |
| `getName()` | `string` | `Location.name` | Nombre visible. |
| `setName(value)` | `string` | `Location.name` |  |
| `getDescription()` | `string` | `Location.description` | Descripcion narrativa. |
| `setDescription(value)` | `string` | `Location.description` |  |
| `getType()` | `string` | `Location.type` | Codigo principal. |
| `setType(value)` | `string` | `Location.type` |  |
| `getMode()` | `string` | `Location.mode` | `instance` o `kind`. |
| `setMode(value)` | `string` | `Location.mode` |  |
| `getAddress()` | `string` | `Location.address` | Direccion visible. |
| `setAddress(value)` | `string` | `Location.address` |  |
| `getPhysicalType()` | `string` | `Location.physical-type` | Codigo principal del tipo fisico. |
| `setPhysicalType(value)` | `string` | `Location.physical-type` |  |
| `getManagingOrganization()` | `string` | `Location.managing-organization` | Organizacion gestora. |
| `setManagingOrganization(value)` | `string` | `Location.managing-organization` |  |
| `getPartOf()` | `string` | `Location.part-of` | Localizacion padre. |
| `setPartOf(value)` | `string` | `Location.part-of` |  |

## Metodos de coleccion propuestos

| Metodo | Tipo | Claim base | Nota |
| --- | --- | --- | --- |
| `getTelecomsList()` | `string[]` | `Location.telecom` | Contactos repetibles. |
| `setTelecomsList(values)` | `string[]` | `Location.telecom` | Reemplaza toda la coleccion. |
| `addTelecomsList(values)` | `string[]` | `Location.telecom` | Agrega sin duplicados. |
| `removeTelecomsList(values)` | `string[]` | `Location.telecom` | Elimina valores concretos. |

## Superficie minima propuesta

```ts
getIdentifier()
setIdentifier(value)
getStatus()
setStatus(value)
getName()
setName(value)
getDescription()
setDescription(value)
getType()
setType(value)
getMode()
setMode(value)
getAddress()
setAddress(value)
getPhysicalType()
setPhysicalType(value)
getManagingOrganization()
setManagingOrganization(value)
getPartOf()
setPartOf(value)
getTelecomsList()
setTelecomsList(values)
addTelecomsList(values)
removeTelecomsList(values)
toClaims()
```

## Decision semantica

- `LocationClaims` debe permanecer alineada al nombre del recurso FHIR.
- `ManagingOrganization` conecta bien este recurso con `OrganizationClaims` para el caso `Department`.
