document.addEventListener("DOMContentLoaded", async () => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  canvas.width = 400;
  canvas.height = 400;

  let posX = canvas.width / 2;
  let posY = canvas.height / 2;

  let currentFrame = 0;
  let lastFrameTime = 0;

  let imgWidth, imgHeight;

  const dataUrl = "data/Bird_Spritesheet.json";

  const data = await loadJson(dataUrl).catch((error) => {
    console.error("Erreur de chargement du fichier JSON :", error);
  });

  const sprites = data.sprites;
  const animationData = data.animations[0];
  imgWidth = sprites[0].width / 8;
  imgHeight = sprites[0].height / 8;

  const image = await loadImage(data.file).catch((error) => {
    console.error("Erreur de chargement de l'image :", error);
  });

  const drawFrame = (image, sprites, frameIndex, x, y, width, height) => {
    const sprite = sprites[frameIndex];
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
      image,
      sprite.x,
      sprite.y,
      sprite.width,
      sprite.height,
      x,
      y,
      width,
      height
    );
  };

  const animate = (timestamp) => {
    drawFrame(image, sprites, currentFrame, posX, posY, imgWidth, imgHeight);

    if (timestamp - lastFrameTime >= animationData.frameRate) {
      currentFrame = (currentFrame + 1) % sprites.length;
      lastFrameTime = timestamp;
    }

    requestAnimationFrame(animate);
  };

  animate(lastFrameTime);

  document.addEventListener("keydown", (event) => {
    const step = 5;

    switch (event.key) {
      case "ArrowUp":
        posY -= step;
        break;
      case "ArrowDown":
        posY += step;
        break;
      case "ArrowLeft":
        posX -= step;
        break;
      case "ArrowRight":
        posX += step;
        break;
    }
  });
});

const loadJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Données non récupérées");
  }
  return response.json();
};

const loadImage = async (src) => {
  const img = new Image();
  img.src = src;
  await img.onload;
  return img;
};
