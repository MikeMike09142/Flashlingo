# Instrucciones para Añadir Imágenes a las Tarjetas

## 📁 Estructura de Carpetas

Las imágenes deben colocarse en la siguiente estructura:
```
public/
└── images/
    └── flashcards/
        ├── book.jpg
        ├── house.jpg
        ├── dog.jpg
        ├── cat.jpg
        ├── table.jpg
        ├── pen.jpg
        ├── apple.jpg
        ├── car.jpg
        ├── window.jpg
        ├── friend.jpg
        ├── chair.jpg
        ├── bird.jpg
        ├── school.jpg
        ├── sun.jpg
        ├── water.jpg
        ├── shirt.jpg
        ├── food.jpg
        ├── phone.jpg
        ├── bag.jpg
        ├── ball.jpg
        ├── bed.jpg
        ├── shoe.jpg
        ├── street.jpg
        ├── watch.jpg
        ├── coffee.jpg
        ├── ice-cream.jpg
        ├── lamp.jpg
        ├── shoes.jpg
        ├── cup.jpg
        ├── computer.jpg
        ├── flower.jpg
        ├── rain.jpg
        ├── egg.jpg
        ├── hat.jpg
        ├── clock.jpg
        ├── tshirt.jpg
        ├── bicycle.jpg
        ├── pizza.jpg
        ├── door.jpg
        ├── camera.jpg
        ├── pencil.jpg
        ├── key.jpg
        ├── bread.jpg
        ├── notebook.jpg
        ├── bus.jpg
        ├── hotel.jpg
        ├── television.jpg
        ├── train.jpg
        ├── cake.jpg
        ├── fish.jpg
        ├── milk.jpg
        ├── laptop.jpg
        ├── picture.jpg
        ├── verb-eat.jpg
        ├── verb-drink.jpg
        ├── verb-sleep.jpg
        ├── verb-read.jpg
        ├── verb-write.jpg
        ├── verb-play.jpg
        ├── verb-work.jpg
        ├── verb-study.jpg
        ├── verb-go.jpg
        ├── verb-come.jpg
        ├── verb-have.jpg
        ├── verb-do.jpg
        ├── verb-say.jpg
        ├── verb-get.jpg
        ├── verb-make.jpg
        ├── verb-take.jpg
        ├── verb-give.jpg
        ├── verb-look.jpg
        ├── verb-find.jpg
        ├── verb-swim.jpg
        ├── verb-run.jpg
        ├── verb-walk.jpg
        ├── verb-see.jpg
        ├── verb-hear.jpg
        ├── verb-speak.jpg
        ├── verb-listen.jpg
        ├── verb-think.jpg
        ├── verb-know.jpg
        ├── verb-want.jpg
        └── verb-need.jpg
```

## 🖼️ Especificaciones de Imágenes

### Formato Recomendado
- **Formato**: JPG o PNG
- **Tamaño**: 400x300 píxeles (mínimo)
- **Peso**: Máximo 200KB por imagen
- **Calidad**: Buena calidad pero optimizada para web

### Opciones para Obtener Imágenes

#### 1. **Unsplash (Gratis)**
- Ve a [unsplash.com](https://unsplash.com)
- Busca cada palabra en inglés
- Descarga imágenes de alta calidad
- Renombra según la lista anterior

#### 2. **Pexels (Gratis)**
- Ve a [pexels.com](https://pexels.com)
- Busca cada palabra en inglés
- Descarga imágenes gratuitas

#### 3. **Pixabay (Gratis)**
- Ve a [pixabay.com](https://pixabay.com)
- Busca cada palabra en inglés
- Descarga imágenes libres de derechos

#### 4. **Iconos SVG (Alternativa)**
Si prefieres iconos en lugar de fotos:
- Ve a [heroicons.com](https://heroicons.com)
- O [feathericons.com](https://feathericons.com)
- Descarga iconos SVG
- Conviértelos a PNG si es necesario

## 🔧 Proceso de Implementación

### Paso 1: Descargar Imágenes
1. Crea la carpeta `public/images/flashcards/`
2. Descarga una imagen para cada palabra
3. Renombra cada imagen según la lista anterior

### Paso 2: Optimizar Imágenes
```bash
# Usando ImageOptim (Mac) o FileOptimizer (Windows)
# O herramientas online como TinyPNG
```

### Paso 3: Verificar Funcionamiento
1. Ejecuta la aplicación: `npm run dev`
2. Ve a la página de estudio
3. Verifica que las imágenes se muestren correctamente

## 🎯 Imágenes Especiales para Verbos

Para los verbos, puedes usar:
- **Iconos representativos**: Una persona comiendo, bebiendo, etc.
- **Fotos de acción**: Alguien realizando la acción
- **Símbolos universales**: Iconos que representen la acción

## 📱 Responsive Design

Las imágenes ya están configuradas para ser responsivas:
- Se adaptan automáticamente al tamaño de la pantalla
- Mantienen la proporción de aspecto
- Se cargan de forma lazy (solo cuando son visibles)

## 🚀 Beneficios

Una vez implementadas las imágenes:
- ✅ Mejor retención de vocabulario
- ✅ Experiencia de estudio más visual
- ✅ Aplicación más atractiva
- ✅ Las imágenes se mantienen aunque se borre el caché
- ✅ Todos los usuarios ven las mismas imágenes

## 🔄 Actualización Futura

Para añadir nuevas tarjetas con imágenes:
1. Añade la imagen a `public/images/flashcards/`
2. Actualiza el array `masterFlashcards` en `AppContext.tsx`
3. Incluye la propiedad `imageUrl: '/images/flashcards/nueva-imagen.jpg'`

¡Las imágenes harán que tu aplicación de flashcards sea mucho más efectiva y atractiva! 