// ✅ GetCroppedImg.ts
export function GetCroppedImg(
  imageFile: File,
  crop: { x: number; y: number; width: number; height: number },
  rotation = 0
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = document.createElement("img");
    image.src = URL.createObjectURL(imageFile);
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context not found"));

      const radians = (rotation * Math.PI) / 180;

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(radians);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) reject(new Error("Canvas is empty"));
        else resolve(blob);
      }, imageFile.type);
    };
    image.onerror = (error) => reject(error);
  });
}
