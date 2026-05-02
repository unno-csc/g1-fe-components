# @itsa-develop/itsa-fe-components

Deploy Vercel

yarn run build-storybook
yarn create-package

npm i -g vercel
vercel login
vercel link
npx vercel@latest --prod --yes

Publicar la version en NPM

npm publish --access public

Este paquete contiene componentes de interfaz de usuario reutilizables y personalizables para aplicaciones web basadas en React. Está diseñado para mejorar la productividad y facilitar la implementación de componentes comunes en proyectos que utilizan React y TypeScript.

## Características

- **Compatibilidad con React**: Diseñado específicamente para React 18+.
- **Componentes reutilizables**: Componentes listos para usar en cualquier proyecto.
- **Estilizado con Ant Design y Tailwind**: Los estilos predeterminados están basados en Ant Design y Tailwind CSS.
- **Storybook**: Documentación interactiva para los componentes.
- **Pruebas**: Integración con `Vitest` para pruebas unitarias y de cobertura.

## Pre Requisitos

- Node.js >= 22.x.x (LTS)
- yarn >= 1.22.22 (LTS)

## Tecnología Base:

- React 19.1.0 (as peerDependencies)
- Tailwind 3.4.3
- Ant Design 5.26.7
- React hook form 7.62.0
- Storybook 8.0.9
- Zustand 5.0.3
- Vite 7.1.7

## Instalación

Para instalar este paquete, puedes usar yarn:

### Instalación de la version publica

```bash
yarn add @ITSA-Nucleo/itsa-fe-components
```

### Instalación de la version local

Para instalar la versión local del paquete se debera generar el paquete con el comando:

```bash
yarn create-package
```

esto creara un tgz con el nombre y la version del paquete segun este en el package json en la raiz del proyecto. Es importante que sepas que si cambias algo y generas uno nuevo deberas actualizar el nombre/version, la recomendación es, para tener un control visual entendible, es aumentar alfabeticamente, pro ejemplo:

paquete generado:

`itsa-develop-itsa-fe-components-v0.0.6.tgz`

Luego de actualizar algo , localmente hablando, mas en el paquete debemos actualizar el nombre a:

`itsa-develop-itsa-fe-components-v0.0.6-a.tgz` para que la version local se sobreescriba.

## Scripts

Este paquete incluye varios scripts útiles para el desarrollo y la gestión del proyecto. A continuación se listan algunos de ellos:

### Scripts de desarrollo

`bash yarn storybook`: Inicia el servidor de Storybook para ver y probar los componentes.

`bash yarn build-storybook`: Construye la documentación de Storybook.

`bash yarn preview`: Previsualiza la aplicación construida.

`bash yarn test`: Ejecuta las pruebas unitarias con Vitest.

`bash yarn test:watch`: Ejecuta Vitest en modo de observación.

`bash yarn test:coverage`: Ejecuta las pruebas y genera un informe de cobertura.

```bash
95% o más: Excelente, casi todo testeado, muy robusto.

85-90%: Muy bueno, cubre casi todo, buen nivel de confianza.

menos de 85%: Puede ser preocupante, hay áreas sin tests que podrían esconder bugs.
```

### Scripts de mantenimiento y limpieza

`bash yarn lint`: Ejecuta ESLint para comprobar el código fuente.

`bash yarn prettier`: Formatea el código con Prettier.

`bash yarn clean`: Elimina los archivos generados en la carpeta dist.

Scripts de construcción
`bash yarn build`: Construye el paquete final, ejecutando los pasos de compilación, optimización de estilos y pruebas.

`bash yarn build-tailwind`: Compila el archivo CSS de Tailwind.

`bash yarn build-css`: Optimiza y compila los estilos CSS.

`bash yarn build-styles`: Compila y optimiza los estilos utilizando Tailwind y PostCSS.

Scripts de actualización de versión

`bash yarn create-package`: Crea un paquete comprimido listo para ser distribuido.

### Scripts de construcción del paquete

Estos scripts están diseñados para facilitar la creación de paquetes y su despliegue en diferentes entornos (staging y producción).

```bash
yarn build-package:staging
```

Construye el paquete en modo staging utilizando Vite, optimiza los estilos con Tailwind CSS.

```bash
yarn build-package:production
```

Construye el paquete en modo producción sin mapas de origen (--no-sourcemap) y optimiza los estilos con Tailwind CSS.

## Uso

### Importar y usar los componentes

Para importar y utilizar los componentes en tu aplicación:

```bash
import { MyComponent } from '@itsa-develop/itsa-fe-components';
```

```bash
<MyComponent prop="value" />
```

## Storybook

Para ver los componentes en acción, puedes ejecutar Storybook. Esto abrirá un entorno interactivo donde podrás ver ejemplos de uso de cada componente:

```bash
yarn storybook
```

Visita http://localhost:6006 en tu navegador para explorar los componentes.
