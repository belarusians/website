import { Section } from "../components/section/section";
import { GetStaticPropsContext, GetStaticPropsResult } from "next/types";
import { CommonPageProps, Lang } from "../components/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Custom404() {
  return (
    <Section>
      <h1>404</h1>
      <p>The page does not exist</p>
      <p>
        If you think the page has to exist, please fill an issue on our{" "}
        <a href="https://github.com/belarusians/website/issues">GitHub</a>
      </p>
    </Section>
  );
}

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<CommonPageProps>> {
  return {
    props: {
      lang: locale as Lang,
      ...(await serverSideTranslations(locale || "be", ["common"])),
    },
  };
}
