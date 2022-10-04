export interface News extends NewsMetadata {
  content: string;
}

export interface NewsMetadata {
  slug: string;
  title: string;
  date: string;
  backgroundUrl: string;
}
