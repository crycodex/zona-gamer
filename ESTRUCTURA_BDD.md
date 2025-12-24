# Estructura de Base de Datos - Zona Gamer

## 📚 Colecciones y Estructura CORRECTA

### Estructura Principal

#### Juegos
```
games/
└── PS4 & PS5/
    └── juegos/
        └── a_way_out/ (nombre del juego como documento contenedor)
            └── correos/ (subcolección de correos)
                ├── theg.am.e.rsz.o.nec@gmail.com/
                │   ├── nombre: "A WAY OUT"
                │   ├── precios: {
                │   │   ps4Principal: 6,
                │   │   ps4Secundaria: 4,
                │   │   ps5Principal: 8,
                │   │   ps5Secundaria: 5,
                │   │   ps4PrincipalCOP: 25000,
                │   │   ps4SecundariaCOP: 16000,
                │   │   ps5PrincipalCOP: 33000,
                │   │   ps5SecundariaCOP: 20000
                │   │ }
                │   ├── version: "PS4"
                │   ├── codigoMaster: "BSR6BUDLUZJUVUORBS4CIF45IULQVFHR6CDM3DXYAPQIW5XKDEFOB7N5RQNYZIPMFZ4XHKVVPUNW76IK5VFJHA4EBWI7VIGHVFE37ZI"
                │   ├── codigosGenerados: [
                │   │   "5C65RBOWRYMDF7GRSVXVFGPMEGDWE7CMZNTM5WO7Q6TB7QHELJE5AN4BPUKTSXVYFWGKFV7G3Q2AJDQM43S46H2K4UGA2FRQL3ME7IA",
                │   │   "wGQHtn",
                │   │   "MyEj7B",
                │   │   "RMe3kn",
                │   │   "eub8ru",
                │   │   "v7zUML",
                │   │   "ea6R5c",
                │   │   "zhZPxe",
                │   │   "YtkdCZ"
                │   │ ]
                │   ├── fecha: Timestamp (11-06-1988)
                │   ├── codigo: "90006"
                │   ├── cuentas: [
                │   │   {
                │   │     tipo: "Principal PS4",
                │   │     nombre: "19998 Ps4",
                │   │     telefono: "+593 99 358 6097"
                │   │   },
                │   │   {
                │   │     tipo: "Secundaria PS4",
                │   │     nombre: "Frank Fc PS4 Ibarra",
                │   │     telefono: "+593 98 777 1379"
                │   │   },
                │   │   {
                │   │     tipo: "Principal PS5",
                │   │     nombre: "Ej8 Ps5",
                │   │     telefono: "+593 93 905 8256"
                │   │   },
                │   │   {
                │   │     tipo: "Secundaria PS5",
                │   │     nombre: "Usuario Ps5 Secundaria",
                │   │     telefono: "+593 98 123 4567"
                │   │   }
                │   │ ]
                │   ├── createdAt: Timestamp
                │   ├── updatedAt: Timestamp
                │   └── createdBy: "uid_del_admin"
                │
                └── z.o.n.a.ec.l.a.t.a.m@gmail.com/
                    ├── nombre: "A WAY OUT"
                    ├── precios: {
                    │   ps4Principal: 6,
                    │   ps4Secundaria: 4,
                    │   ps5Principal: 8,
                    │   ps5Secundaria: 5,
                    │   ps4PrincipalCOP: 25000,
                    │   ps4SecundariaCOP: 16000,
                    │   ps5PrincipalCOP: 33000,
                    │   ps5SecundariaCOP: 20000
                    │ }
                    ├── version: "PS4"
                    ├── codigoMaster: "..."
                    ├── codigosGenerados: [...]
                    ├── fecha: Timestamp
                    ├── codigo: "90006"
                    ├── cuentas: [...]
                    ├── createdAt: Timestamp
                    ├── updatedAt: Timestamp
                    └── createdBy: "uid_del_admin"
```

#### Combos
```
combos/
└── PS4 & PS5/
    └── combos/
        └── assassins_creed_combo/ (nombre del combo como documento contenedor)
            └── correos/ (subcolección de correos)
                ├── z.o.nae.c.l.a.t.am@gmail.com/
                │   ├── nombre: "Assassins Creed"
                │   ├── precios: {
                │   │   ps4Principal: 15,
                │   │   ps4Secundaria: 12,
                │   │   ps5Principal: 18,
                │   │   ps5Secundaria: 14,
                │   │   ps4PrincipalCOP: 62000,
                │   │   ps4SecundariaCOP: 49000,
                │   │   ps5PrincipalCOP: 74000,
                │   │   ps5SecundariaCOP: 58000
                │   │ }
                │   ├── version: "PS4"
                │   ├── codigoMaster: "MASTER USA"
                │   ├── codigosGenerados: []
                │   ├── fecha: Timestamp (12-05-1980)
                │   ├── codigo: "90002"
                │   ├── cuentas: [
                │   │   {
                │   │     tipo: "Principal PS4",
                │   │     nombre: "24830 Ps4",
                │   │     telefono: "+593 98 148 1407"
                │   │   },
                │   │   {
                │   │     tipo: "Secundaria PS4",
                │   │     nombre: "9461 Ps4 Revendedor",
                │   │     telefono: "+593 96 338 2229"
                │   │   },
                │   │   {
                │   │     tipo: "Principal PS5",
                │   │     nombre: "Luis David A0005",
                │   │     telefono: "+593 98 982 6032"
                │   │   }
                │   │ ]
                │   ├── createdAt: Timestamp
                │   ├── updatedAt: Timestamp
                │   └── createdBy: "uid_del_admin"
                │
                └── otro_correo@gmail.com/
                    └── ... (misma estructura)
```

**Nota importante sobre combos:**
- Los combos pueden tener nombres propios (ej: "Combo Premium", "Combo Especial")
- O pueden referenciar juegos existentes usando el campo `juegoReferenciado` (ID del juego)
- El formato de archivo .txt para combos es diferente al de juegos (ver sección de formato)

## 🔑 Explicación de la Estructura

### Nivel 1: `games/` y `combos/` (Colecciones Root)
Colecciones principales que contienen todas las plataformas.

### Nivel 2: `{plataforma}/` (Documento)
Documento de plataforma (ej: "PS4 & PS5", "PS4", "PS5", "Xbox", "Nintendo Switch").

### Nivel 3: `juegos/` o `combos/` (Subcolección)
- Para juegos: Subcolección que contiene todos los juegos de esa plataforma
- Para combos: Subcolección que contiene todos los combos de esa plataforma

### Nivel 4: `{nombre_juego}/` o `{nombre_combo}/` (Documento)
- Para juegos: Documento contenedor del juego (ej: "a_way_out")
- Para combos: Documento contenedor del combo (ej: "assassins_creed_combo")
Este documento puede estar vacío o contener metadata general.

### Nivel 5: `correos/` (Subcolección)
**IMPORTANTE**: Aquí es donde está toda la información real. Cada correo es un documento que contiene:
- Toda la información del juego/combo (nombre, costo, código, etc.)
- El código master
- Los códigos generados
- Las cuentas con sus dueños y teléfonos

## 📊 Tipos de Datos

### GameEmailAccount (Cada documento de correo)
```typescript
{
  correo: string (ID del documento)     // theg.am.e.rsz.o.nec@gmail.com
  nombre: string                        // "A WAY OUT"
  precios: {                            // Objeto con los 8 precios (USD y COP)
    ps4Principal: number                // Precio USD para cuenta Principal PS4
    ps4Secundaria: number               // Precio USD para cuenta Secundaria PS4
    ps5Principal: number                // Precio USD para cuenta Principal PS5
    ps5Secundaria: number               // Precio USD para cuenta Secundaria PS5
    ps4PrincipalCOP: number             // Precio COP para cuenta Principal PS4
    ps4SecundariaCOP: number            // Precio COP para cuenta Secundaria PS4
    ps5PrincipalCOP: number             // Precio COP para cuenta Principal PS5
    ps5SecundariaCOP: number            // Precio COP para cuenta Secundaria PS5
  }
  version: string                       // "PS4 & PS5"
  codigoMaster: string                  // Código maestro principal
  codigosGenerados: string[]            // Array de códigos generados
  fecha: Timestamp                      // Fecha de registro
  codigo: string                        // Código identificador (ej: "90006")
  cuentas: [                           // Array de cuentas con dueños
    {
      tipo: string                      // "Principal PS4" | "Secundaria PS4" | "Principal PS5"
      nombre: string                    // Nombre del dueño
      telefono: string                  // Teléfono de contacto
    }
  ]
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string                     // UID del admin que lo creó
}
```

## 📝 Ejemplo Real en Firestore

### Ruta Completa
```
games/PS4 & PS5/juegos/a_way_out/correos/theg.am.e.rsz.o.nec@gmail.com
```

### Documento JSON
```json
{
  "nombre": "A WAY OUT",
  "precios": {
    "ps4Principal": 6,
    "ps4Secundaria": 4,
    "ps5Principal": 8,
    "ps5Secundaria": 5,
    "ps4PrincipalCOP": 25000,
    "ps4SecundariaCOP": 16000,
    "ps5PrincipalCOP": 33000,
    "ps5SecundariaCOP": 20000
  },
  "version": "PS4",
  "codigoMaster": "BSR6BUDLUZJUVUORBS4CIF45IULQVFHR6CDM3DXYAPQIW5XKDEFOB7N5RQNYZIPMFZ4XHKVVPUNW76IK5VFJHA4EBWI7VIGHVFE37ZI",
  "codigosGenerados": [
    "5C65RBOWRYMDF7GRSVXVFGPMEGDWE7CMZNTM5WO7Q6TB7QHELJE5AN4BPUKTSXVYFWGKFV7G3Q2AJDQM43S46H2K4UGA2FRQL3ME7IA",
    "wGQHtn",
    "MyEj7B",
    "RMe3kn",
    "eub8ru",
    "v7zUML",
    "ea6R5c",
    "zhZPxe",
    "YtkdCZ"
  ],
  "fecha": "1988-06-11T00:00:00.000Z",
  "codigo": "90006",
  "cuentas": [
    {
      "tipo": "Principal PS4",
      "nombre": "19998 Ps4",
      "telefono": "+593 99 358 6097"
    },
    {
      "tipo": "Secundaria PS4",
      "nombre": "Frank Fc PS4 Ibarra",
      "telefono": "+593 98 777 1379"
    },
    {
      "tipo": "Principal PS5",
      "nombre": "Ej8 Ps5",
      "telefono": "+593 93 905 8256"
    },
    {
      "tipo": "Secundaria PS5",
      "nombre": "Usuario Ps5 Secundaria",
      "telefono": "+593 98 123 4567"
    }
  ],
  "createdAt": "2024-11-12T00:00:00.000Z",
  "updatedAt": "2024-11-12T00:00:00.000Z",
  "createdBy": "admin_uid_aqui"
}
```

## 🎮 Plataformas Soportadas

- `PS4 & PS5` - Juegos compatibles con ambas consolas
- `PS4` - Solo PlayStation 4
- `PS5` - Solo PlayStation 5
- `Xbox` - Xbox Series X/S y One
- `Nintendo Switch` - Nintendo Switch

## 👥 Tipos de Cuentas

Cada correo puede tener múltiples cuentas, cada una con un tipo:

- `Principal PS4` - Cuenta principal de PS4
- `Secundaria PS4` - Cuenta secundaria de PS4
- `Principal PS5` - Cuenta principal de PS5
- `Secundaria PS5` - Cuenta secundaria de PS5

Cada cuenta tiene:
- **tipo**: El tipo de cuenta
- **nombre**: Nombre del dueño de la cuenta
- **telefono**: Teléfono de contacto del dueño

## 🔒 Permisos de Acceso

### Admin
- ✅ Ver todos los juegos y combos con sus correos
- ✅ Agregar correos a juegos y combos
- ✅ Editar correos existentes
- ✅ Eliminar correos
- ✅ Eliminar juegos/combos completos (con todos sus correos)
- ✅ Ver todos los detalles (códigos, cuentas, dueños)
- ✅ Crear y editar combos (con nombres propios o referenciando juegos)

### Empleado
- ✅ Ver todos los juegos y combos con sus correos
- ✅ Ver todos los detalles (códigos, cuentas, dueños)
- ✅ Generar mensajes WhatsApp para combos
- ❌ Agregar correos
- ❌ Editar correos
- ❌ Eliminar correos o juegos/combos

### Cliente
- ❌ Sin acceso a la gestión de juegos

## 📊 Funcionalidades Implementadas

### 1. **Vista de Juegos**
   - Lista todos los juegos de la plataforma seleccionada
   - Muestra cuántos correos tiene cada juego
   - Búsqueda por nombre del juego
   - Botón para ver correos del juego
   - Botón para eliminar juego completo (solo admin)

### 2. **Vista de Correos**
   - Lista todos los correos de un juego específico
   - Muestra cantidad de códigos y cuentas
   - Breadcrumb de navegación
   - Botón para agregar nuevo correo (solo admin)
   - Acciones: Ver detalles, Editar, Eliminar

### 3. **Agregar Correo** (Solo Admin)
   - Formulario para ingresar correo
   - Precio y código del juego/combo
   - Código Master (obligatorio)
   - Códigos Generados (uno por línea)
   - Cuentas con formato especial: `tipo|nombre|teléfono`
   - Ejemplo: `Principal PS4|19998 Ps4|+593 99 358 6097`
   - **Para combos**: Parser especial que lee el formato de archivo .txt de combos

### 4. **Editar Correo** (Solo Admin)
   - Modificar todos los campos excepto el correo
   - Actualizar códigos generados
   - Actualizar cuentas y dueños

### 5. **Ver Detalles**
   - Modal completo con toda la información
   - Información general (correo, nombre, precio, código)
   - Código Master en formato legible
   - Todos los códigos generados en grid
   - Todas las cuentas con badges por tipo

### 6. **Eliminar**
   - Eliminar un correo específico
   - Eliminar un juego completo (elimina todos los correos)
   - Confirmación con advertencia

## 🚀 Cómo Usar

### Paso 1: Ver Juegos
1. Acceder a "Gestión de Juegos"
2. Seleccionar plataforma (PS4 & PS5, PS4, etc.)
3. Ver lista de juegos con cantidad de correos

### Paso 2: Ver Correos de un Juego
1. Click en "Ver Correos" de un juego
2. Se muestra la lista de todos los correos de ese juego

### Paso 3: Agregar un Correo (Solo Admin)
1. Estando en la vista de correos, click "+ Agregar Correo"
2. Llenar el formulario:
   - **Correo** (obligatorio): `theg.am.e.rsz.o.nec@gmail.com`
   - **Precios en USD** (obligatorios):
     - PS4 Principal: `6`
     - PS4 Secundaria: `4`
     - PS5 Principal: `8`
     - PS5 Secundaria: `5`
   - **Precios en COP** (obligatorios):
     - PS4 Principal COP: `25000`
     - PS4 Secundaria COP: `16000`
     - PS5 Principal COP: `33000`
     - PS5 Secundaria COP: `20000`
   - **Código**: `90006`
   - **Código Master** (obligatorio): El código largo
   - **Códigos Generados**: Uno por línea
     ```
     wGQHtn
     MyEj7B
     RMe3kn
     ```
   - **Cuentas**: Formato `tipo|nombre|teléfono`
     ```
     Principal PS4|19998 Ps4|+593 99 358 6097
     Secundaria PS4|Frank Fc PS4|+593 98 777 1379
     Principal PS5|Ej8 Ps5|+593 93 905 8256
     Secundaria PS5|Usuario Ps5 Secundaria|+593 98 123 4567
     ```
3. Click "Agregar Correo"

### Paso 4: Ver Detalles de un Correo
1. Click en el botón de información (ℹ️)
2. Se abre modal con:
   - Información general
   - Código Master completo
   - Todos los códigos generados
   - Todas las cuentas con dueños y teléfonos

### Paso 5: Editar un Correo (Solo Admin)
1. Click en botón "Editar" (lápiz)
2. Modificar los datos necesarios
3. Guardar cambios

### Paso 6: Eliminar
**Eliminar un correo:**
1. Click en botón "Eliminar" (papelera) en la vista de correos
2. Confirmar eliminación

**Eliminar un juego completo:**
1. Click en botón "Eliminar" en la vista de juegos
2. Confirmar eliminación (eliminará TODOS los correos del juego)

## 💰 Sistema de Precios Multi-Moneda

Cada juego ahora tiene **8 precios diferentes** según el tipo de cuenta y la moneda:

### Precios en USD (Ecuador)
- **PS4 Principal**: Precio para cuentas principales de PS4
- **PS4 Secundaria**: Precio para cuentas secundarias de PS4
- **PS5 Principal**: Precio para cuentas principales de PS5
- **PS5 Secundaria**: Precio para cuentas secundarias de PS5

### Precios en COP (Colombia)
- **PS4 Principal COP**: Precio en pesos colombianos para cuentas principales de PS4
- **PS4 Secundaria COP**: Precio en pesos colombianos para cuentas secundarias de PS4
- **PS5 Principal COP**: Precio en pesos colombianos para cuentas principales de PS5
- **PS5 Secundaria COP**: Precio en pesos colombianos para cuentas secundarias de PS5

Estos precios se configuran al crear o editar un juego. En el home y navbar, el usuario puede seleccionar el país/moneda (Ecuador USD o Colombia COP) para ver los precios correspondientes. Por defecto se muestra USD (Ecuador).

## 💡 Formato de Datos de Entrada

### Para Juegos

#### Códigos Generados
```
wGQHtn
MyEj7B
RMe3kn
eub8ru
v7zUML
ea6R5c
zhZPxe
YtkdCZ
```
**Un código por línea**

#### Cuentas
```
Principal PS4|19998 Ps4|+593 99 358 6097
Secundaria PS4|Frank Fc PS4 Ibarra|+593 98 777 1379
Principal PS5|Ej8 Ps5|+593 93 905 8256
Secundaria PS5|Usuario Ps5 Secundaria|+593 98 123 4567
```
**Formato:** `tipo|nombre|teléfono` (separado por pipes `|`)

**Tipos válidos:**
- `Principal PS4`
- `Secundaria PS4`
- `Principal PS5`
- `Secundaria PS5`

### Para Combos

El formato del archivo .txt para combos es diferente:

```
z.o.nae.c.l.a.t.am@gmail.com
papa1425 Principal PS4 la tiene 24830 Ps4 +593 98 148 1407
syndicate1425 Secundaria PS4 la tiene 9461 Ps4 Revendedor +593 96 338 2229
Principal PS5 la tiene Luis David A0005 +593 98 982 6032

ID.wispy-advice8
Nombre: Assassins Creed
Costo: $15
MASTER USA
12-05-1980
90002
```

**Estructura del archivo:**
- **Línea 1**: Correo electrónico
- **Líneas 2-4**: Cuentas con formato `usuario tipo cuenta nombre teléfono`
- **Línea 7**: ID (opcional, se ignora)
- **Línea 8**: Nombre del combo/juego (formato: `Nombre: Nombre del Combo`)
- **Línea 9**: Costo (formato: `Costo: $15`)
- **Línea 10**: Código Master (puede ser "MASTER USA" o el código completo)
- **Línea 11**: Fecha (formato: `DD-MM-YYYY`)
- **Línea 12**: Código (número de 5+ dígitos)

El parser automáticamente extrae toda esta información y llena el formulario.

## ⚠️ Notas Importantes

1. **Cada correo tiene TODA la información**: No se comparte información entre correos, cada uno es independiente.

2. **El mismo juego puede aparecer múltiples veces**: Cada correo es una "copia" del juego con sus propios códigos y cuentas.

3. **El ID del juego** (ej: `a_way_out`) se genera automáticamente del nombre, eliminando espacios y caracteres especiales.

4. **Al eliminar un juego** se eliminan automáticamente TODOS los correos asociados.

5. **El correo no se puede editar**: Una vez creado, el correo es el ID del documento y no se puede cambiar.

6. **Los códigos incluyen el master**: En la interfaz se muestra "X códigos" que incluye el master + los generados.

7. **Sistema de precios multi-moneda**: Cada juego tiene 8 precios diferentes (4 en USD para Ecuador y 4 en COP para Colombia). Los precios se configuran por tipo de cuenta (PS4 Principal, PS4 Secundaria, PS5 Principal, PS5 Secundaria) y se muestran en el home según la moneda seleccionada por el usuario en el navbar. Por defecto se muestran los precios en USD.

## 🔍 Búsqueda

La búsqueda en la vista de juegos busca por:
- Nombre del juego
- ID del juego (nombre normalizado)

## 📱 Navegación

### Para Juegos
- **Panel Admin/Empleado** → **Gestión de Juegos** → **Lista de Juegos** → **Correos del Juego** → **Detalles del Correo**
- Breadcrumb siempre visible
- Botón "Volver a juegos" en la vista de correos

### Para Combos
- **Panel Admin/Empleado** → **Gestión de Combos** → **Lista de Combos** → **Correos del Combo** → **Detalles del Correo**
- Breadcrumb siempre visible
- Botón "Volver a combos" en la vista de correos
- Los combos están disponibles tanto en el panel de admin como en el de empleados

## 🎯 Ejemplo Completo de Flujo

### Flujo para Juegos
1. Admin entra al sistema
2. Va a "Gestión de Juegos"
3. Selecciona plataforma "PS4 & PS5"
4. Ve "A Way Out" con 3 correos
5. Click en "Ver Correos"
6. Ve 3 correos listados
7. Click "+ Agregar Correo"
8. Ingresa nuevo correo con todos los datos
9. Guarda
10. Ahora hay 4 correos
11. Click en el ícono de info de un correo
12. Ve todos los detalles: códigos master, generados, cuentas con dueños

### Flujo para Combos
1. Admin entra al sistema
2. Va a "Gestión de Combos"
3. Selecciona plataforma "PS4 & PS5"
4. Ve lista de combos (pueden tener nombres propios o referenciar juegos)
5. Click en "Crear Combo" (opcional: seleccionar juego existente para referenciar)
6. Ingresa nombre del combo, precios, foto, etc.
7. Guarda el combo
8. Click en "Ver Correos" del combo
9. Click "+ Agregar Correo"
10. Arrastra archivo .txt con formato de combo o ingresa manualmente
11. El parser automáticamente extrae: correo, cuentas, nombre, costo, código master, fecha, código
12. Guarda
13. Ahora el combo tiene correos asociados
14. Click en el ícono de info de un correo
15. Ve todos los detalles: códigos master, generados, cuentas con dueños
