const sharp = require('sharp');

async function processLogo() {
  try {
    // Leer la imagen original
    const image = sharp('public/Untitled.png');
    const metadata = await image.metadata();

    console.log('Procesando logo...');
    console.log('Dimensiones:', metadata.width, 'x', metadata.height);

    // Procesar la imagen para hacer el blanco transparente
    // Usamos un threshold para detectar píxeles cercanos al blanco puro
    const processed = await image
      .resize(null, null, {
        kernel: sharp.kernel.nearest
      })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data, info } = processed;
    const { width, height, channels } = info;

    // Crear un nuevo buffer con canal alpha
    const newBuffer = Buffer.alloc(width * height * 4);

    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Ignorar el canal alpha original si existe

      const newIndex = (i / channels) * 4;

      // Detectar si el píxel es blanco o casi blanco
      // Usamos un threshold de 240 para detectar blanco
      const isWhite = r > 240 && g > 240 && b > 240;

      if (isWhite) {
        // Hacer el píxel transparente
        newBuffer[newIndex] = r;
        newBuffer[newIndex + 1] = g;
        newBuffer[newIndex + 2] = b;
        newBuffer[newIndex + 3] = 0; // Alpha = 0 (transparente)
      } else {
        // Mantener el píxel original
        newBuffer[newIndex] = r;
        newBuffer[newIndex + 1] = g;
        newBuffer[newIndex + 2] = b;
        newBuffer[newIndex + 3] = 255; // Alpha = 255 (opaco)
      }
    }

    // Guardar la imagen procesada
    await sharp(newBuffer, {
      raw: {
        width,
        height,
        channels: 4
      }
    })
    .png()
    .toFile('public/koterie-logo-transparent.png');

    console.log('✅ Logo procesado exitosamente: public/koterie-logo-transparent.png');
  } catch (error) {
    console.error('❌ Error al procesar el logo:', error);
  }
}

processLogo();
