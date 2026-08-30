import { supabase, isSupabaseConfigured } from './supabase';

export const STORAGE_BUCKET_NAME =
  import.meta.env.VITE_STORAGE_BUCKET_NAME || 'inkorium-media';

export function dataURLtoBlob(dataurl: string): Blob {
  const [header, data] = dataurl.split(',');
  const mime = header?.match(/:(.*?);/)?.[1] || 'image/jpeg';
  const binary = atob(data || '');
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function toBlob(input: File | Blob | string): { blob: Blob; filename: string } {
  if (typeof input === 'string') {
    if (/^https?:\/\//i.test(input)) {
      throw new Error('La subida espera un archivo o data URL, no una URL remota.');
    }
    const blob = dataURLtoBlob(input);
    return { blob, filename: `image-${Date.now()}.jpg` };
  }
  if (input instanceof File) {
    return { blob: input, filename: input.name || `upload-${Date.now()}` };
  }
  return { blob: input, filename: `upload-${Date.now()}` };
}

export async function uploadMediaFile(
  fileOrDataUrl: File | Blob | string,
  folder: 'avatars' | 'photos' | 'wall' = 'photos'
): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase no está configurado.');
  }

  const { blob, filename } = toBlob(fileOrDataUrl);
  const extension = filename.split('.').pop()?.toLowerCase() || 'bin';
  const safeExtension = /^[a-z0-9]+$/.test(extension) ? extension : 'bin';
  const path = `${folder}/${crypto.randomUUID()}.${safeExtension}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET_NAME)
    .upload(path, blob, {
      cacheControl: '3600',
      contentType: blob.type || 'application/octet-stream',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(STORAGE_BUCKET_NAME).getPublicUrl(path);
  if (!data.publicUrl) throw new Error('No se pudo obtener la URL pública del archivo.');
  return data.publicUrl;
}
