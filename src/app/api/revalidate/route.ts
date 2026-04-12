import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';
import { checkRateLimit } from '../rate-limit';

export async function POST(request: NextRequest) {
  const rateLimitError = checkRateLimit(request, { limit: 30, windowMs: 60_000 });
  if (rateLimitError) return rateLimitError;
  const { isValidSignature, body } = await parseBody<{
    _type: string,
    slug?: string
  }>(request, process.env.SANITY_REVALIDATE_SECRET);

  if (!isValidSignature) {
    return new NextResponse(JSON.stringify({ message: 'Invalid Token' }), {
      status: 401,
      statusText: 'Unauthorized',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  if (!body?._type) {
    return new NextResponse(JSON.stringify({ message: 'Bad Request: _type should exist in body' }), {
      status: 400,
      statusText: 'Bad Request',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  console.log(`revalidating tag ${body._type} requested`);
  try {
    revalidateTag(body._type, 'max');
    revalidatePath('/', 'page');
    revalidatePath('/[lang]', 'page');

    if (body.slug && body._type === 'event') {
      console.log(`Revalidating tag events with slug ${body.slug}`);
      revalidatePath('/[lang]/events/[slug]', 'page');
    }
    if (body._type === 'event') {
      console.log('Revalidating events listing page');
      revalidatePath('/[lang]/events', 'page');
    }
    if (body.slug && body._type === 'news') {
      console.log(`Revalidating tag news with slug ${body.slug}`);
      revalidatePath('/[lang]/news/[slug]', 'page');
    }
    if (body._type === 'guide') {
      console.log('Revalidating alien-passport page');
      revalidatePath('/[lang]/alien-passport', 'page');
    }
  } catch (e) {
    console.error(`[Revalidate] Tag ${body._type} revalidation failed:`, e instanceof Error ? e.message : e);
    return NextResponse.json(
      { message: 'Revalidation failed' },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  const message = `Tag ${body._type} revalidation succeeded`;
  console.log(message);
  return NextResponse.json(
    { message },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}
