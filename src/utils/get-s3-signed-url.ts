import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import fileConfig from "../files/config/file.config"
import { FileConfig } from "../files/config/file-config.type"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";



export async function getS3SignedUrl(key:string):Promise<string>{
    const s3 = new S3Client({
        region: (fileConfig() as FileConfig).awsS3Region ?? '',
        credentials: {
            accessKeyId: (fileConfig() as FileConfig).accessKeyId ?? '',
            secretAccessKey: (fileConfig() as FileConfig).secretAccessKey ?? '',
        },
    });

    const command = new GetObjectCommand({
        Bucket: (fileConfig() as FileConfig).awsDefaultS3Bucket ?? '',
        Key: key,
    });

    return await getSignedUrl(s3, command, { expiresIn: 3600 });
}