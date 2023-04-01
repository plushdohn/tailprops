import { MarkdownPage } from "@/components/MarkdownPage";
import { getAllPosts } from "@/utils/md";

type Props = {
  params: {
    slug?: string[];
  };
};

export async function generateStaticParams() {
  const posts = getAllPosts("docs");

  return [...posts.map((p) => ({ slug: [p.filename] })), { slug: [] }];
}

export default async function DocsPage({ params }: Props) {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <MarkdownPage params={params} route="docs" defaultRouteFile="overview" />
    </>
  );
}
