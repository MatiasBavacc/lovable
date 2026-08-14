# Sabor Local — Navbar, Home, Búsqueda, Carruseles y Detalle de Producto

## Punto de partida

Este proyecto en Lovable está vacío (sólo la página placeholder del template). El prototipo de Figma Make no es accesible desde acá, así que las pantallas que el documento da por "ya existentes" (vidriera de vendedores, perfil del cocinero) hay que crearlas también, siguiendo el estilo descrito: fondo crema/beige, acentos naranja-terracota, cards blancas redondeadas, títulos serif y texto sans-serif.

Todo mobile-first, con datos mock en memoria (sin base de datos todavía).

## Sistema visual

- Tokens de color en el CSS global: crema/beige de fondo, terracota/naranja como primario, blanco para cards, radios generosos.
- Tipografías: una serif para títulos, una sans para el resto.
- Sin modo oscuro por ahora.

## Estructura de pantallas

```text
/                       Home (chip de entrega, búsqueda, 4 carruseles)
/buscar                 Resultados de búsqueda (+ estado vacío)
/producto/$id           Detalle de producto
/producto/$id/opiniones Listado completo de reseñas
/cocinero/$id           Perfil del vendedor con su menú
/cuenta                 Mi Perfil
/ayuda  /contacto  /terminos  /privacidad
/notificaciones  /favoritos  /pedidos   (placeholders con título)
```

Cada pantalla interna lleva flecha de volver arriba a la izquierda.

## Navbar y navegación

- Navbar fijo: logo (espacio para isotipo cuadrado) + "Sabor Local" a la izquierda, ambos linkean a Home.
- Derecha: carrito con badge numérico (atenuado y sin badge cuando está en 0) + hamburguesa.
- Drawer lateral: avatar + email o "Invitado", y los ítems Mi Perfil, Ayuda, Contacto, Términos, Privacidad, y Cerrar Sesión sólo con sesión activa.
- Cerrar Sesión abre modal de confirmación; al confirmar vuelve a Home en estado Invitado.
- Menú inferior fijo con Inicio, Notificaciones, Favoritos, Pedidos.

## Selector de entrega

- Chip debajo del navbar: "Delivery · Hoy" con flecha hacia abajo.
- Bottom sheet: tabs Delivery / Retiro en el local, fecha con "Hoy" preseleccionado y opción de elegir otra, campo de dirección sólo en Delivery, botón Aplicar.
- Guardado en estado global (sin persistencia). Se deja comentado en el código que a futuro filtrará home y búsqueda.

## Búsqueda

- Input con lupa y placeholder "¿Qué querés comer hoy?".
- Al enfocar: 3 búsquedas recientes + chips de sugerencias (Carnes, Vegetariano, Postres, Sin TACC).
- Enter navega a resultados, reutilizando el formato de lista de la vidriera.
- Sin resultados: ilustración simple, "No encontramos nada con ese nombre" y botón "Volver a la vidriera".

## Carruseles

Cuatro secciones con scroll horizontal de 10 cards cada una: Menú del Día, Destacados, Más Vendidos, Nuevos.

Card: imagen, título, rating con estrellas y número, corazón de favorito con estado outline/relleno, descripción truncada, precio. Si el producto está agotado, botón deshabilitado "Agotado".

## Detalle de producto

Pantalla completa con volver, carrusel de 1-3 imágenes, favorito sincronizado con la card, título, precio, rating con cantidad de reseñas, ingredientes, nombre del cocinero clickeable, botón secundario "Ver menú del cocinero", badge de entrega con horario, chips de categoría (sólo estado visual seleccionado), selector de cantidad -/+ y "Agregar al plato" que suma al carrito.

Sección de valoraciones: promedio, 2-3 reseñas de ejemplo y link "Ver todas las opiniones".

## Estados especiales

- Cocinero sin entregas hoy: banner en su perfil y en el detalle, botón reemplazado por "No disponible hoy" deshabilitado.
- Producto agotado: botón "Agotado" deshabilitado en card y detalle.

## Detalles técnicos

- Estado global de carrito, favoritos y contexto de entrega vía React Context en `src/lib/`.
- Datos mock (productos, cocineros, reseñas) en un módulo compartido; los carruseles son vistas filtradas del mismo set.
- Rutas de archivo TanStack Router bajo `src/routes/`, con `head()` propio por ruta.
- Imágenes de producto generadas y guardadas en `src/assets/`.
- Sesión simulada en memoria (Invitado / usuario mock) para poder mostrar el flujo de Cerrar Sesión sin backend. El login real y la persistencia quedan para un prompt siguiente.
