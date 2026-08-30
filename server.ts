import express from 'express';
import path from 'path';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }
});

let s3Client: S3Client | null = null;

function getHetznerS3Client(): { client: S3Client; bucket: string; endpoint: string; publicUrlBase?: string } | null {
  const endpoint = process.env.HETZNER_S3_ENDPOINT;
  const accessKeyId = process.env.HETZNER_S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.HETZNER_S3_SECRET_ACCESS_KEY;
  const bucket = process.env.HETZNER_S3_BUCKET || 'inkorium-media';
  const region = process.env.HETZNER_S3_REGION || 'fsn1';
  const publicUrlBase = process.env.HETZNER_S3_PUBLIC_URL;

  if (!endpoint || !accessKeyId || !secretAccessKey) return null;

  if (!s3Client) {
    s3Client = new S3Client({
      endpoint,
      region,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true
    });
  }

  return { client: s3Client, bucket, endpoint, publicUrlBase };
}

app.get('/api/storage/status', (_req, res) => {
  const hetznerConfig = getHetznerS3Client();
  res.json({
    hetznerConfigured: !!hetznerConfig,
    bucket: hetznerConfig?.bucket || null,
    endpoint: process.env.HETZNER_S3_ENDPOINT ? 'Configured' : 'Not configured'
  });
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const folder = (req.body.folder as string) || 'photos';

    if (!file) {
      return res.status(400).json({ error: 'No se ha enviado ningún archivo para subir.' });
    }

    const hetzner = getHetznerS3Client();
    if (!hetzner) {
      return res.status(503).json({
        error: 'HETZNER_STORAGE_NOT_CONFIGURED',
        message: 'Hetzner S3 Object Storage credentials are not set in environment.'
      });
    }

    const fileExt = file.originalname.split('.').pop() || 'jpg';
    const key = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    await hetzner.client.send(new PutObjectCommand({
      Bucket: hetzner.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype || 'image/jpeg',
      ACL: 'public-read'
    }));

    const cleanBase = (hetzner.publicUrlBase || hetzner.endpoint).replace(/\/+$/, '');
    const publicUrl = hetzner.publicUrlBase
      ? `${cleanBase}/${key}`
      : `${cleanBase}/${hetzner.bucket}/${key}`;

    return res.json({ success: true, url: publicUrl, key, bucket: hetzner.bucket, provider: 'hetzner' });
  } catch (err: any) {
    console.error('Error uploading file to Hetzner Object Storage:', err);
    return res.status(500).json({
      error: 'UPLOAD_FAILED',
      message: err.message || 'Error al subir el archivo al almacenamiento de Hetzner.'
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => console.log(`Inkorium Server running on port ${PORT}`));
}

startServer();
