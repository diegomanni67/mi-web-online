import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const bucket = process.env.KOTERIE_STORAGE_BUCKET || 'koterie-materials'

function client() {
  const endpoint = process.env.KOTERIE_STORAGE_ENDPOINT || process.env.AWS_ENDPOINT_URL_S3
  const region = process.env.KOTERIE_STORAGE_REGION || process.env.AWS_REGION || 'us-east-2'
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  if (!endpoint || !accessKeyId || !secretAccessKey) throw new Error('Koterie file storage is not configured')
  return new S3Client({ endpoint, region, forcePathStyle: true, credentials: { accessKeyId, secretAccessKey } })
}

export async function createUploadUrl(objectKey: string, contentType: string) {
  return getSignedUrl(client(), new PutObjectCommand({ Bucket: bucket, Key: objectKey, ContentType: contentType }), { expiresIn: 600 })
}

export async function createDownloadUrl(objectKey: string, fileName?: string | null) {
  return getSignedUrl(client(), new GetObjectCommand({
    Bucket: bucket,
    Key: objectKey,
    ResponseContentDisposition: fileName ? `attachment; filename="${fileName.replace(/["\r\n]/g, '')}"` : undefined,
  }), { expiresIn: 600 })
}

export function storageBucketName() { return bucket }
