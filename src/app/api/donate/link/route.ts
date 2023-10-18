import { NextRequest, NextResponse } from "next/server";
import {
  createPLinkForPriceId,
  createPrice,
  searchPLinkByPriceId,
  searchPrice,
  searchProduct,
} from "../../../../lib/stripe";
import { parseDonation } from "../../../../contract/donate";
import { cutQuery, RequestError } from "../../../../lib/utils";


export async function GET(request: NextRequest) {
  const amountInEuro = request.nextUrl.searchParams.get("amount");
  const recurring = request.nextUrl.searchParams.get("recurring");

  try {
    const donation = parseDonation({ amount: amountInEuro, recurring: recurring === "true" });

    const productId = await searchProduct();
    if (!productId) {
      throw new RequestError("Donation product is not found", 500);
    }

    const amountInCents = donation.amount * 100;
    let priceId = await searchPrice(amountInCents, donation.recurring, productId);
    if (!priceId) {
      priceId = await createPrice(amountInCents, donation.recurring, productId);
    }

    let plink = await searchPLinkByPriceId(priceId);
    if (!plink) {
      const referer = request.headers.get("referer");
      const redirectUrl = referer ? `${cutQuery(referer)}?success` : undefined;

      plink = await createPLinkForPriceId(priceId, redirectUrl);
    }

    return NextResponse.json({ payment_link: plink.url }, { status: 200 });
  } catch (e) {
    if (!(e instanceof RequestError)) {
      throw e;
    }
    return NextResponse.json({ message: e.message, cause: e.cause }, { status: e.status });
  }
}
