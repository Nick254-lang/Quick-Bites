import { createCloudinaryUploadSignature } from '@/lib/cloudinary';
import { getSessionUser } from '@/lib/session';

export const POST = async () => {
  try {
    const user = await getSessionUser();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = createCloudinaryUploadSignature('myrestaurant/menu');
    return Response.json(payload);
  } catch (error: unknown) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unauthorized' },
      { status: 401 }
    );
  }
};
