import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';

export async function POST(request: NextRequest) {
  const { isValidSignature, body } = await parseBody<{ _type: string }>(
    request,
    process.env.SANITY_REVALIDATE_SECRET,
  );

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
    return new NextResponse(JSON.stringify({ message: 'Bad Request' }), {
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
  } catch (e) {
    console.log(`revalidating tag ${body._type} failed`);
    return NextResponse.json({ revalidated: false, error: e });
  }

  console.log(`revalidating tag ${body._type} succeeded`);
  return NextResponse.json({ revalidated: true });
}
