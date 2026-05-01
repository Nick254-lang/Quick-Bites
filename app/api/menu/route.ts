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

export const POST = async (request: Request) => {
  try {
    const { getSessionUser } = await import('@/lib/session');
    const user = await getSessionUser();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { createMenuItem } = await import('@/lib/db');
    const menuItem = await createMenuItem(body);
    return Response.json(menuItem, { status: 201 });
  } catch (error: unknown) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to create menu item' },
      { status: 500 }
    );
  }
};

export const PUT = async (request: Request) => {
  try {
    const { getSessionUser } = await import('@/lib/session');
    const user = await getSessionUser();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return Response.json({ error: 'Menu item ID is required' }, { status: 400 });
    }

    const { updateMenuItem } = await import('@/lib/db');
    const menuItem = await updateMenuItem(id, updateData);
    return Response.json(menuItem);
  } catch (error: unknown) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to update menu item' },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { getSessionUser } = await import('@/lib/session');
    const user = await getSessionUser();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'Menu item ID is required' }, { status: 400 });
    }

    const prisma = (await import('@/lib/prisma')).prisma;
    await prisma.menuItem.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error: unknown) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to delete menu item' },
      { status: 500 }
    );
  }
};
