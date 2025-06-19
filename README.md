# Rick and Morty - Personajes

¡Bienvenido/a! Este proyecto es una aplicación web desarrollada en **Laravel** (backend) y **JavaScript** (frontend) que consume la API de Rick and Morty, permitiendo visualizar, buscar, guardar, editar y marcar como favoritos a los personajes de la serie. Incluye una interfaz moderna, responsive y dockerizada, ideal para pruebas técnicas o como base para proyectos personales.

---

## 🚀 Características principales

- **Consumo de la API oficial de Rick and Morty** y visualización de personajes en tarjetas.
- **Guardar los primeros 100 personajes** en la base de datos con un solo clic.
- **Edición de personajes** solo si están guardados en la base de datos.
- **Marcar personajes como favoritos** (corazón persistente en localStorage).
- **Buscador en tiempo real** y paginación personalizable.
- **Selector de cantidad de personajes por página** (20, 50, 100).
- **Feedback visual y mensajes claros** para cada acción (SweetAlert2).
- **Tema galáctico y verde**, fondo animado de estrellas, tarjetas y botones modernos.
- **Favicon personalizado** y spinner de carga animado.
- **Modo "Ver favoritos"** para filtrar solo tus personajes favoritos.
- **Totalmente responsive** y compatible con cualquier dispositivo.
- **Dockerizado** y listo para producción o desarrollo local (XAMPP/Laragon).
- **Código limpio, organizado y documentado**.

---

## 📦 Instalación y ejecución

Puedes correr el proyecto de dos formas: **con Docker** (recomendado) o **de manera local** (XAMPP, Composer, etc.).

### 0. Clona el repositorio

```bash
git clone https://github.com/darwinandres23213/rick_and_morty.git
cd rick_and_morty
```

### 1. Ejecución con Docker 🐳

> ⚠️ **Nota:** El rendimiento de la aplicación en Docker puede ser más lento que en local, especialmente en modo desarrollo, dependiendo de los recursos (CPU, RAM) que le asignes a Docker y de la configuración de tu entorno. Esto es normal en contenedores y no afecta el funcionamiento en producción.

#### Requisitos previos
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)

#### Pasos

1. **Copia el archivo de entorno para Docker:**
   ```bash
   cp .env.example.docker .env
   ```
2. **Levanta los contenedores:**
   ```bash
   docker-compose up --build -d
   ```
3. **Genera la clave de la aplicación (APP_KEY):**
   ```bash
   docker-compose exec app bash
   php artisan key:generate
   ```
   Esto generará la clave de cifrado necesaria para Laravel y la agregará automáticamente a tu archivo `.env`.
4. **Ejecuta las migraciones dentro del contenedor:**
   ```bash
   docker-compose exec app php artisan migrate
   ```
5. **Accede a la aplicación:**
   - [http://localhost:8080/Ricky_and_Morty](http://localhost:8080/Ricky_and_Morty)

> **Nota:** Si tienes MySQL local, el contenedor usará el puerto 3307 para evitar conflictos.

---

### 2. Ejecución local (XAMPP, Laragon, etc.) 💻

#### Requisitos previos
- PHP >= 8.1
- Composer
- MySQL/MariaDB (por ejemplo, con XAMPP o Laragon)

#### Pasos

1. **Copia el archivo de entorno para local:**
   ```bash
   cp .env.example.local .env
   ```
2. **Crea la base de datos** (por ejemplo, en phpMyAdmin):
   - Nombre: `ricky_and_morty`
   - **Opción alternativa:** Si no deseas ejecutar las migraciones manualmente, puedes importar directamente el script `ricky_and_morty.sql` que se encuentra en la raíz del proyecto usando un gestor como XAMPP/phpMyAdmin.
3. **Instala dependencias:**
   ```bash
   composer install
   ```
4. **Genera la clave de la aplicación (APP_KEY):**
   ```bash
   php artisan key:generate
   ```
   Esto generará la clave de cifrado necesaria para Laravel y la agregará automáticamente a tu archivo `.env`.
5. **Ejecuta las migraciones:**
   ```bash
   php artisan migrate
   ```
6. **Levanta el servidor de desarrollo:**
   ```bash
   php artisan serve
   ```
7. **Accede a la aplicación:**
   - [http://127.0.0.1:8000/Ricky_and_Morty](http://127.0.0.1:8000/Ricky_and_Morty)

---

## 📝 Uso de la aplicación

1. **Cargar personajes:**  
   Haz clic en "Cargar API" para obtener los primeros 100 personajes de la API oficial.

2. **Guardar en base de datos:**  
   Una vez cargados, puedes guardarlos en tu base de datos local con "Guardar en BD".

3. **Buscar y filtrar:**  
   Usa el buscador para encontrar personajes por nombre y elige cuántos mostrar por página.

4. **Marcar favoritos:**  
   Haz clic en el corazón de cada tarjeta para marcar/desmarcar como favorito.  
   Tus favoritos se guardan en tu navegador (localStorage).

5. **Ver solo favoritos:**  
   Haz clic en "Ver favoritos" para filtrar solo tus personajes favoritos.  
   Vuelve a hacer clic para ver todos nuevamente.

6. **Editar personajes:**  
   Solo puedes editar personajes que ya estén guardados en la base de datos.

---

## 🛠️ Archivos de entorno incluidos

- `.env.example.docker` → Para ejecutar con Docker
- `.env.example.local`  → Para ejecución local (XAMPP, Laragon, etc.)

---

## 🧩 Estructura del proyecto

- **/public/app/index.html** — Frontend estático (puedes abrirlo directamente para ver la interfaz).
- **/public/app/js/app.js** — Lógica principal del frontend.
- **/public/app/css/styles.css** — Estilos personalizados.
- **/app/Http/Controllers/** — Controladores de Laravel.
- **/routes/api.php** — Rutas de la API.
- **/docker-compose.yml, Dockerfile, nginx/** — Archivos para despliegue en Docker.

---

## 🧑‍💻 Buenas prácticas y recomendaciones

- Código limpio, sin comentarios innecesarios ni malas prácticas.
- Organización clara de CSS y JS.
- Mensajes de error y éxito claros y amigables.
- Interfaz visualmente atractiva y profesional.
- Documentación detallada para facilitar la instalación y el mantenimiento.

---

## 🐞 Solución de problemas comunes

- **¿No conecta a la base de datos?**  
  - Verifica los datos de conexión en tu `.env`.
  - Si cambiaste el `.env`, ejecuta:  
    ```bash
    php artisan config:clear
    ```

- **¿Error: No application encryption key has been specified?**  
  Esto ocurre si falta la clave de cifrado en tu archivo `.env` (APP_KEY). Para solucionarlo en Docker:
  ```bash
  docker-compose exec app bash
  php artisan key:generate
  ```
  Esto generará la clave y la agregará automáticamente a tu `.env`.

- **¿Conflicto de puertos con MySQL?**  
  - Docker usa el puerto 3307 para evitar conflictos con instalaciones locales.

- **¿No ves los cambios en el frontend?**  
  - Limpia la caché de tu navegador o recarga con Ctrl+F5.

---

## 📄 Licencia

Este proyecto es de uso libre para fines educativos y pruebas técnicas.

---

¿Tienes dudas o sugerencias?  
¡No dudes en abrir un issue o contactarme!  

---
