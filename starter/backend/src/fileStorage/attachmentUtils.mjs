import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client();
const bucketName = process.env.ATTACHMENT_S3_BUCKET;
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION, 10);

if (!bucketName) {
    throw new Error('S3 bucket name is not configured in the environment variables');
}

if (!urlExpiration) {
    throw new Error('Signed URL expiration time is not configured in the environment variables');
}

// Generate a pre-signed URL for uploading
export async function getUploadUrl(todoId) {
    if (!todoId) {
        throw new Error('Todo ID is required to generate an upload URL');
    }
    const key = `${todoId}/${originalFileName}`;
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key
    });

    try {
        const url = await getSignedUrl(s3Client, command, {
            expiresIn: urlExpiration
        });
        return url;
    } catch (error) {
        console.error('Error generating upload URL:', error);
        throw new Error('Could not generate upload URL');
    }
}

// Generate a public URL for accessing the uploaded file
export function getPublicUrl(todoId) {
    if (!todoId) {
        throw new Error('Todo ID is required to generate a public URL');
    }

    return `https://${bucketName}.s3.amazonaws.com/${todoId}`;
}
