import { Feedback, Lang } from '../../components/types';
import { client } from '../client';

export async function getNRandomFeedbacksByLang(lang: Lang, n: number): Promise<Feedback[]> {
  const allIds: { _id: string }[] = await client.fetch('*[_type == "feedback"]{ _id }');
  const ids = allIds
    .sort(() => Math.random() - Math.random())
    .slice(0, n)
    .map(({ _id }) => _id);

  return client.fetch(`*[_id in $ids]{
    _id,
    "text": text.${lang},
    "signature": signature.${lang},
   }`, { ids });
}
