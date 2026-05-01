import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const buildCloudinaryImageUrl = (publicId: string): string =>
  cloudinary.url(publicId, {
    secure: true,
    quality: 'auto',
    fetch_format: 'auto',
    crop: 'fill',
    width: 800,
    height: 600,
  });

export const createCloudinaryUploadSignature = (folder: string) => {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { folder, timestamp },
    process.env.CLOUDINARY_API_SECRET || ''
  );

  return {
    timestamp,
    signature,
    folder,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
  };
};
