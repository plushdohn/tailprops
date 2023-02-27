import { MarkdownPage } from "@/components/MarkdownPage";
import { getAllPosts } from "@/utils/md";

type Props = {
  params: {
    slug?: string[];
  };
};

export async function generateStaticParams() {
  const posts = getAllPosts("integrations");

  return posts.map((p) => ({ slug: [p.filename] }));
}

export default async function IntegrationsPage({ params }: Props) {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <MarkdownPage
        params={params}
        route="integrations"
        defaultRouteFile="overview"
      />
    </>
  );
}
