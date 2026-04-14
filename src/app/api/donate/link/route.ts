import { NextRequest, NextResponse } from 'next/server';
import {
  createPLinkForPriceId,
  createPrice,
  searchPLinkByPriceId,
  searchPrice,
  searchProduct,
} from '../../../../lib/stripe';
import { parseDonation } from '../../../../contract/donate';
import { cutQuery, RequestError } from '../../../../lib/utils';
import { checkRateLimit } from '../../rate-limit';

export async function GET(request: NextRequest) {
  const rateLimitError = checkRateLimit(request, { limit: 20, windowMs: 60_000 });
  if (rateLimitError) return rateLimitError;
  const amountInEuro = request.nextUrl.searchParams.get('amount');
  const recurring = request.nextUrl.searchParams.get('recurring');
  const newsletterOptin = request.nextUrl.searchParams.get('newsletterOptin');

  try {
    const donation = parseDonation({
      amount: amountInEuro,
      recurring: recurring === 'true',
      ...(newsletterOptin !== null && { newsletterOptin }),
    });

    const productId = await searchProduct();
    if (!productId) {
      throw new RequestError('Donation product is not found', 500);
    }

    const amountInCents = donation.amount * 100;
    let priceId = await searchPrice(amountInCents, donation.recurring, productId);
    if (!priceId) {
      priceId = await createPrice(amountInCents, donation.recurring, productId);
    }

    const plinkOptions = donation.recurring
      ? { newsletterOptin: donation.newsletterOptin === true }
      : undefined;

    let plink = await searchPLinkByPriceId(priceId, plinkOptions);
    if (!plink) {
      const referer = request.headers.get('referer');
      const redirectUrl = referer ? `${cutQuery(referer)}?success` : undefined;

      plink = await createPLinkForPriceId(priceId, redirectUrl, plinkOptions);
    }

    return NextResponse.json({ payment_link: plink.url }, { status: 200 });
  } catch (e) {
    if (!(e instanceof RequestError)) {
      console.error(e);
      return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
    return NextResponse.json({ message: e.message, cause: e.cause }, { status: e.status });
  }
}
