import { NextRequest, NextResponse } from 'next/server';
import { captionGeneratorSchema } from '@/lib/validation';
import { generatePhotoCaption } from '@/lib/ai-service';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (mimeType === 'image/jpeg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (mimeType === 'image/png') {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }

  // WebP: 'RIFF' .... 'WEBP'
  if (mimeType === 'image/webp') {
    const isRiff = buffer.toString('ascii', 0, 4) === 'RIFF';
    const isWebp = buffer.toString('ascii', 8, 12) === 'WEBP';
    return isRiff && isWebp;
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const rate = await checkRateLimit(ip, 'upload');
    if (!rate.success) {
      return rateLimitResponse(rate);
    }

    const body = await req.json();
    const result = captionGeneratorSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid caption request', issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { fileBase64, mimeType, style, language, destinationName } = result.data;

    // Decode base64 to check size and magic bytes
    const base64Clean = fileBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');

    if (buffer.length > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: 'File size exceeds maximum permitted limit of 5 MB.' },
        { status: 400 }
      );
    }

    // Strict content validation (magic bytes verification)
    const isAuthenticImage = validateMagicBytes(buffer, mimeType);
    if (!isAuthenticImage) {
      return NextResponse.json(
        { error: 'File content does not match genuine JPEG, PNG, or WebP image headers.' },
        { status: 400 }
      );
    }

    const captionResult = await generatePhotoCaption({
      fileBase64: base64Clean,
      mimeType,
      style,
      language,
      destinationName,
    });

    return NextResponse.json({
      success: true,
      result: captionResult,
      privacyNotice:
        'Your photo was processed in ephemeral memory for caption generation only and is not published, stored, or exposed publicly.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Caption generation failed', message: err.message },
      { status: 500 }
    );
  }
}
