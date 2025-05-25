import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';

export async function POST(request: NextRequest) {
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
    revalidateTag(body._type);
    revalidatePath('/', 'page');
    revalidatePath('/[lang]', 'page');

    if (body.slug && body._type === 'event') {
      console.log(`Revalidating tag events with slug ${body.slug}`);
      revalidatePath('/[lang]/events/[slug]', 'page');
    }
    if (body.slug && body._type === 'news') {
      console.log(`Revalidating tag news with slug ${body.slug}`);
      revalidatePath('/[lang]/news/[slug]', 'page');
    }
    if (body.slug && body._type === 'guide') {
      console.log(`Revalidating tag guides with slug ${body.slug}`);
      revalidatePath('/[lang]/guides/[slug]', 'page');
    }
    if (body._type === 'guide') {
      console.log('Revalidating guides listing page');
      revalidatePath('/[lang]/guides', 'page');
    }
  } catch (e) {
    const message = `Tag ${body._type} revalidation failed`;
    console.log(message);
    return NextResponse.json(
      { message, error: e },
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
