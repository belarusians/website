import { Lang } from "../../components/types";
import { client } from "../client";
import { Feedback } from "../../../sanity.config";

export async function getNRandomFeedbacksByLang(lang: Lang, n: number): Promise<Feedback[]> {
  const allIds: { _id: string }[] = await client.fetch(`*[_type == "feedback" && language == "${lang}"]{ _id }`);
  const ids = allIds
    .sort(() => Math.random() - Math.random())
    .slice(0, n)
    .map(({ _id }) => _id);

  return client.fetch("*[_id in $ids]", { ids });
}
