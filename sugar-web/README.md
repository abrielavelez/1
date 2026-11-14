# Sugar Tienda Digital · Sugar Club + Sugar Doggy Pops

Sitio estático (HTML, CSS y JS), mobile-first, sin pasarela de pago: todos los pedidos van por WhatsApp.

## Páginas

| Ruta | Qué es | Link para |
|---|---|---|
| `/` | Selector de marcas | Web general |
| `/club` | Link-tree de Sugar Club | Bio de @sugarclub.ec |
| `/club/catalogo.html` | Catálogo con filtros: Collares · Aretes · Lazos | |
| `/doggy` | Link-tree de Doggy Pops | Bio de @sugardoggypops.ec |
| `/doggy/catalogo.html` | Catálogo con filtros por tipo | |
| `/doggy/arma-tu-collar.html` | Configurador "Arma su collar" | |
| `/match.html` | Sets "tú + tu perrito" | |

## Cómo editar sin tocar el diseño

Todo está en la carpeta `data/`:

| Archivo | Qué cambias |
|---|---|
| `config.json` | **Número de WhatsApp** (formato 593…, sin + ni 0 inicial) y usuarios de Instagram |
| `productos.json` | Productos de las dos marcas y sets Match: nombre, precio, foto, disponible |
| `configurador.json` | Cordones, charms, placas, tallas y precios del configurador |

- **Precio:** `"precio": 12`. Para mostrar otro texto: `"precioTexto": "$6 + $1 por letra"`. Con `"precio": null` muestra "Consultar precio".
- **Ocultar un producto agotado:** `"disponible": false`.
- **Foto:** guarda la imagen en `fotos/club/` o `fotos/doggy/` y pon `"foto": "doggy/collar-placa.jpg"`. Usa JPG o WebP cuadrado (1:1), de unos 800 px, para que cargue rápido.
- **Logos:** guarda `assets/img/logo-club.png` y `assets/img/logo-doggy.png`, y en `club/index.html` y `doggy/index.html` cambia el texto del círculo por la línea `<img>` que está comentada ahí.
- `"ejemplo": true` marca productos de prueba que hay que reemplazar.

## Probarlo en tu computadora

Los datos se cargan con `fetch`, así que abrir el HTML con doble clic no funciona. En la carpeta `sugar-web`:

```
python3 -m http.server 8000
```

y abre http://localhost:8000

## Publicar gratis en Netlify

1. Crea una cuenta en netlify.com y elige **Add new site → Import from Git**, con este repositorio. El archivo `netlify.toml` ya indica la carpeta `sugar-web`.
   - Opción sin Git: arrastra la carpeta `sugar-web` a **app.netlify.com/drop**.
2. Netlify te da un link tipo `sugar-xxxx.netlify.app`.
3. Dominio propio: en **Domain settings → Add custom domain** pones por ejemplo `sugar.ec` y sigues los pasos de DNS.
4. Links para las bios: `tudominio/club` y `tudominio/doggy`.

## Pendiente

- Número de WhatsApp en `data/config.json`
- Productos y precios reales de Sugar Club
- Precios de Sparkle Kit, bandanas, disfraces y set de lazos
- Fotos de productos y logos en PNG
- Colores reales de los cordones lisos en `configurador.json`
- Precio de talla L para collar de letras y collar con dije
