export const GET = async () => {
  try {
    const { listMenuItems } = await import('@/lib/db');
    const items = await listMenuItems();
    return Response.json(items);
  } catch (error: unknown) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to load menu' },
      { status: 500 }
    );
  }
};
