import { put, del } from '@vercel/blob';

export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `shoes/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const blob = await put(filename, file, {
    access: 'public',
    addRandomSuffix: false,
  });

  return blob.url;
}

export async function deleteImage(url: string): Promise<void> {
  try {
    await del(url);
  } catch {
    console.warn('Failed to delete blob image:', url);
  }
}
