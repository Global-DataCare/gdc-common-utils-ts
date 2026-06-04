# 101 Consent Permission Templates

## Objetivo

Tiene que existir una capa común de `permission templates` que sirva a la vez para:

- UI del front
- solicitud de permisos al controller del individuo
- creación manual de permisos por el controller del individuo
- persistencia final en consent/access rules
- documentación y validación previa

Esa capa no sustituye el contrato actual de claims de consent. Lo alimenta. La transformación hacia claims/FHIR Consent la tiene que hacer `ConsentAccessEditor` o una capa adyacente en `common-utils`.

## Casos de uso que tiene que cubrir

### 1. UI del front

Sirve para:

- mostrar opciones disponibles
- ocultar o desactivar acciones no permitidas
- adaptar pantallas según:
  - actor
  - sector
  - rol profesional o relación personal

Ejemplo:

- un administrativo puede ver “buscar documentos”
- no puede ver “leer contenido clínico”
- un médico sí puede ver lectura clínica completa

### 2. Solicitud de permisos al controller del individuo

Sirve para:

- el profesional elige su rol
- el front carga la plantilla recomendada
- se genera una solicitud ya rellenada con:
  - recursos
  - secciones
  - tipo de acceso
  - scopes SMART sugeridos

No parte de cero. Parte de una plantilla sectorial razonable.

### 3. Creación manual por el controller del individuo

Sirve para:

- el controller del individuo elige:
  - sector
  - rol
- el sistema propone la plantilla predeterminada
- luego puede:
  - aceptarla tal cual
  - ajustarla
  - restringirla más

Valor real:

- una sola tabla base
- usada para UX, solicitud y concesión manual

## Flujo funcional

### 1. Catálogo base

Vive como configuración compartida. Contiene:

- `actorType`
- `sector`
- `roleId` o `relationshipCode`
- permisos recomendados
- recursos y secciones
- scopes SMART sugeridos
- flags como `metadataOnly`

### 2. Selección de rol

En el front:

- el usuario o el sistema identifica `sector + role`
- se resuelve la plantilla recomendada
- eso sirve ya para:
  - mostrar UI
  - ocultar acciones no válidas
  - preparar solicitudes

### 3. Preview de permisos

Antes de pedir o conceder:

- se muestra una vista clara:
  - puede listar
  - puede leer
  - puede crear
  - sobre qué recursos
  - sobre qué secciones
- si es `metadataOnly`, se dice explícitamente

### 4. Solicitud al controller

- el front genera una solicitud basada en la plantilla
- el controller del individuo recibe algo ya estructurado

### 5. Edición manual por el controller

- puede aceptar
- restringir
- ampliar si la política lo permite
- guardar como preset

### 6. Persistencia final

Lo que se guarda no es “la plantilla” sin más. Se guarda la decisión final:

- targets
- CRUD/scopes
- actors
- roles
- purposes
- metadatos vs contenido
- scopes SMART efectivos
- límites temporales o contextuales si aplican

## Dónde vive cada cosa

- `gdc-common-utils-ts`
  - tipos
  - catálogo base
  - helpers de resolución
  - `ConsentAccessEditor`
  - `BundleEditor` / `BundleReader`
  - `EmployeeEntryEditor`
  - futuros `ConsentEntryEditor`, `RelatedPersonEntryEditor`, `Ips...`
- `gdc-sdk-core-ts`
  - lógica neutral de resolución de plantilla efectiva
  - mapping a surface/capabilities por actor
- `gdc-sdk-front-ts`
  - UI
  - overrides
  - formularios de solicitud/concesión
- `gdc-sdk-node-ts`
  - enforcement runtime si aplica

## Orden de resolución

1. plantilla base del SDK
2. override por organización/app
3. ajuste por caso concreto
4. consentimiento/permiso final persistido

## Identidad de roles y relaciones

No usar labels libres como clave canónica.

Profesionales o personal:

- usar `sector + ISCO-08 code`

Relaciones personales:

- usar `sector + v3-RoleCode`

Ejemplos:

- `health-care_isco-08_221`
- `health-care_isco-08_222`
- `individual_v3-RoleCode_MTH`

## Formato interno simple de permisos

La configuración base puede venir como:

- clave: `<sector>_<codingSystem>_<code>`
- valor CSV: `<target>.<ops>`

Ejemplos:

- `health-care_isco-08_221=DocumentReference.sr,MedicationStatement.sr,Observation.sr,LOINC|60591-5.sr`
- `health-care_isco-08_222=DocumentReference.sr,MedicationStatement.sr,Observation.s,LOINC|60591-5.s`
- `individual_v3-RoleCode_MTH=DocumentReference.sr,Observation.s`

`ops`:

- `s` = search/list metadata
- `r` = read full content
- `c` = create
- `u` = update
- `d` = delete

## Modelo de consent que tiene que salir de ahí

El modelo mental principal no debe ser `Consent.action/category/resourceType`. Debe ser:

- `decision`
- `purposes[]`
- `targets[]`
- `actors[]`
- `roles[]`

Luego eso se exporta al contrato actual de claims.

## Contrato de lectura/clasificación del Consent editor

Ya encarrilado:

- `getDecision()`
- `getTargetsClassified()`
- `getActorsClassified()`

Pendiente ampliar:

- `getPurposesClassified()`
- `getRolesClassified()`

## Targets clasificados

La API pública buena es `target`, no `section`.

```ts
type ConsentTargetKind =
  | 'section'
  | 'resource-type';
```

Para LOINC, no separar `document-type` como kind distinto. Todo LOINC va como `section`, pero con familia:

```ts
type ConsentSectionFamily =
  | 'core-section'
  | 'kind-of-document'
  | 'type-of-service'
  | 'subject-matter-domain';
```

Shape:

```ts
type ClassifiedConsentTarget = {
  target: {
    kind: ConsentTargetKind;
    code: string;
    display?: string;
    sectionFamily?: ConsentSectionFamily;
  };
  scopes: Array<{
    code: 'c' | 'r' | 'u' | 'd' | 's';
    display?: string;
  }>;
};
```

## Taxonomía de secciones

- `core-section`
  - secciones clínicas/resumen IPS y summary clínico
- `kind-of-document`
  - LP de documento
- `type-of-service`
  - LP de tipo de servicio
- `subject-matter-domain`
  - LP de especialidad/dominio
- `resource-type`
  - `DocumentReference`, `Observation`, etc.

## Uso de LOINC

No intentar reflejar toda la ontología LOINC como jerarquía dura. En el SDK usarla como clasificación reutilizable.

Ejemplo práctico:

- `Type of Service` puede usarse como clasificación general
- no hace falta tratarlo como subsección obligatoria de otra cosa

## Front: helpers para pickers/collapsibles

Sí, hacen falta helpers de catálogo y selección dentro del `ConsentAccessEditor` o muy pegados a él.

Catálogos disponibles:

- `getCoreSectionOptions()`
- `getKindOfDocumentOptions()`
- `getTypeOfServiceOptions()`
- `getSubjectMatterDomainOptions()`
- `getResourceTypeOptions()`

Selección actual:

- `getSelectedCoreSections()`
- `getSelectedKindOfDocuments()`
- `getSelectedTypeOfServices()`
- `getSelectedSubjectMatterDomains()`
- `getSelectedResourceTypes()`

Set completo:

- `setSelectedCoreSections(...)`
- `setSelectedKindOfDocuments(...)`
- `setSelectedTypeOfServices(...)`
- `setSelectedSubjectMatterDomains(...)`
- `setSelectedResourceTypes(...)`

Add/remove incremental:

- `addCoreSections(...)`
- `removeCoreSections(...)`
- `addKindOfDocuments(...)`
- `removeKindOfDocuments(...)`
- `addTypeOfServices(...)`
- `removeTypeOfServices(...)`
- `addSubjectMatterDomains(...)`
- `removeSubjectMatterDomains(...)`
- `addResourceTypes(...)`
- `removeResourceTypes(...)`

La idea es que el front no toque directamente:

- `Consent.action`
- `Consent.category`
- `Consent.resourceType`

## Actors clasificados

La API buena:

```ts
getActorsClassified(): {
  jurisdictions: Array<{
    code: string;
    display?: string;
  }>;
  organizations: Array<{
    domain: string;
    display?: string;
    departments: Array<{
      code: string;
      display?: string;
    }>;
    locations: Array<{
      code: string;
      display?: string;
    }>;
  }>;
  users: Array<{
    email?: string;
    phone?: string;
    role?: {
      codingSystem: string;
      code: string;
      display?: string;
    };
  }>;
};
```

Esto tiene que soportar:

- uno o varios emails de profesional
- uno o varios teléfonos
- una o varias organizaciones `did:web`
- uno o varios departamentos
- una o varias locations
- una o varias jurisdicciones ISO 3166

## Purposes

No se puede olvidar. Tiene que haber listas de purposes por decisión, igual que hay listas de targets/actors/roles.

Pendiente:

- `getPurposesClassified()`
- `setSelectedPurposes(...)`
- `addPurposes(...)`
- `removePurposes(...)`

Y esa lista tiene que sobrevivir a:

- solicitud
- edición manual
- export a claims/FHIR Consent
- import de vuelta desde claims/FHIR Consent

## Roles

También pendiente como lista explícita:

- roles profesionales por sector
- relaciones personales HL7/FHIR

Helpers necesarios:

- `getAvailableProfessionalRolesBySector(...)`
- `getAvailableRelationshipRoles(...)`
- `getSelectedRoles()`
- `setSelectedRoles(...)`
- `addRoles(...)`
- `removeRoles(...)`

Esto tiene que alimentar tanto:

- la UI del front
- como la generación de permisos
- como la validación de qué herramientas mostrar/habilitar

## Habilitar herramientas por rol y sector

La misma capa de templates tiene que servir para:

- mostrar herramientas
- ocultar herramientas
- desactivar herramientas

Según:

- actor
- sector
- rol profesional/personal

Ejemplo:

- administrativo hospitalario:
  - puede listar documentos
  - no puede leer contenido clínico
- médico:
  - puede lectura clínica completa
- bombero, policía, azafata, veterinario, etc.:
  - plantillas específicas por sector y código

## Tipos TS que siguen pendientes

Base ya definida conceptualmente:

- `RolePermissionTemplate`
- `ResolvedPermissionProfile`
- `PermissionGrantRequestDraft`
- `PermissionGrantDecision`

Pero hay que evolucionarlos para cubrir:

- `purposes[]`
- `targets[]`
- `actors[]`
- `roles[]`
- `metadataOnly`
- `sectionFamily`
- overrides

## Transformación necesaria

Hace falta una capa de import/export entre:

- plantilla de permisos del front
- modelo canónico del editor
- claims persistidos
- entries FHIR Consent

Nombres razonables:

- `importPermissionTemplate(...)`
- `exportConsentClaims(...)`
- `exportConsentEntries(...)`
- `importConsentClaims(...)`
- `importConsentEntries(...)`

## Tests unitarios pendientes en common-utils

Hay que cubrir, como mínimo:

- una plantilla -> un consent entry
- una plantilla -> varios consent entries
- varios emails profesionales
- varias organizaciones `did:web`
- varios departamentos
- varias locations
- varias jurisdicciones ISO 3166
- `permit`
- `deny`
- múltiples `purposes`
- múltiples `roles`
- múltiples `targets`
- múltiples `resource-types`
- clasificación `core-section`
- clasificación `kind-of-document`
- clasificación `type-of-service`
- clasificación `subject-matter-domain`

## Estado actual ya resuelto

- `healthcare.ts`
  - familias canónicas ya metidas
- `ConsentAccessEditor`
  - `getDecision()`
  - `getTargetsClassified()`
  - `getActorsClassified()`
- `section + sectionFamily`
  - ya encarrilado
- tests focalizados
  - pasan

## Siguiente bloque real de implementación

1. catálogo de permission templates por `sector + role/relationship`
2. helpers de roles disponibles por sector
3. `ConsentAccessEditor` con catálogos y setters/add/remove por familias de target
4. purposes y roles como listas explícitas
5. import/export plantilla -> claims -> Consent entries
6. tests unitarios de todo eso en `gdc-common-utils-ts`
