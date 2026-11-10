# 🏙️ Lumera Heights Dubái — Plataforma Web Frontend

> **Plataforma web interactiva de arquitectura y residencias de ultra lujo en Dubái**, desarrollada con **React 19**, **TypeScript**, **Tailwind CSS v4**, **GSAP 3** y **Lenis Smooth Scroll**. Diseñada bajo la metodología de **Desarrollo Guiado por Componentes (CDD)**.

---

## 🌟 Características Principales

* **Arquitectura Basada en Componentes:** Organización modular desacoplada en submódulos especializados (`navegacion`, `modal`, `sections`, `ui`, `utils`).
* **Scroll Cinemático y Pinning (GSAP 3):** Catálogo de residencias con desplazamiento vertical anclado a deslizamiento horizontal y animaciones de texto.
* **Física de Desplazamiento Suave (Lenis):** Navegación fluida y eliminación de saltos bruscos en toda la experiencia.
* **Odómetros Numéricos Dinámicos:** Animación de cifras métricas y financieras con descomposición de números y caracteres especiales.
* **Modal de Cotización Global (Context API):** Gestión reactiva de estado sin prop-drilling, accesible desde cualquier botón de llamada a la acción (CTA).
* **Selector Mundial de Teléfonos:** Buscador interactivo de prefijos internacionales con banderas (+51, +52, +57, +34, +1, +971, etc.).
* **(+OPCIONAL) Persistencia de Datos Local:** Almacenamiento automático de solicitudes en base de datos local del navegador (`localStorage`) en formato JSON.
* **Diseño 100% Responsivo:** Adaptación precisa y milimétrica para computadoras de escritorio, tablets y dispositivos móviles con menú táctil y distintivos fluidos.

---

## 🛠️ Tecnologías Utilizadas

* **React 19**
* **TypeScript**
* **Vite 8**
* **Tailwind CSS v4**
* **GSAP 3 (ScrollTrigger, SplitText, InertiaPlugin)**
* **Lenis Smooth Scroll**
* **Lucide React** (Iconografía vectorial)
* **Node.js Test Runner & TSX** (Pruebas unitarias)

---

## 🚀 Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/TU_USUARIO/lumera-dubai.git
   cd lumera-dubai
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

5. **Ejecutar pruebas unitarias:**
   ```bash
   npx tsx --test src/utils/lumera.test.ts
   ```

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos y de demostración técnica frontend.
