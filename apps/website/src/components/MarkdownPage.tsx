import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPageMds } from "@/utils/md";
import ScrollUp from "@/components/ScrollUp";
import { CodeBlock } from "@/components/Markdown/CodeBlock";
import MarkdownNote from "@/components/Markdown/Note";
import { SideNavigation } from "./SideNavigation/SideNavigation";
import { createHeaderRenderer } from "./Markdown/Header";

type Props = {
  params: {
    slug?: string[];
  };
  route: "docs" | "integrations";
  defaultRouteFile?: string;
};

export async function MarkdownPage({ params, route, defaultRouteFile }: Props) {
  const slug = params.slug ? params.slug[0] : defaultRouteFile;

  if (!slug) notFound();

  let currentPost, posts;
  try {
    const markdowns = await getPageMds(route, slug);

    posts = markdowns.posts;
    currentPost = markdowns.currentPost;
  } catch {
    notFound();
  }

  const sections = posts.map((p) => ({
    title: p.frontmatter.title,
    href: p.filename === defaultRouteFile ? "" : p.filename,
  }));

  return (
    <div tw="w-full flex">
      <SideNavigation
        route={route}
        sections={sections}
        currentSection={slug === defaultRouteFile ? "" : slug}
      />
      <div
        tw="overflow-hidden prose prose-invert max-w-full grow p-4 pb-12"
        tw-sm="p-8"
        tw-lg="pl-10 pt-8"
        tw-prose_pre="p-0 bg-gray-800"
        tw-prose_a="text-blue-400 no-underline"
        tw-hover-prose_a="underline"
        tw-focus-prose_a="underline"
        tw-prose_code="p-0 bg-gray-800 text-blue-300 text-sm p-0.5 rounded-sm before:hidden after:hidden"
        tw-prose_blockquote="border-l-4 border-blue-500 text-gray-300 pl-4 prose-quoteless not-italic"
        tw-prose_h2="mb-0"
        tw-prose_h3="mb-0"
      >
        {currentPost.frontmatter.warning && (
          <MarkdownNote tw="mb-8" kind="warning">
            {currentPost.frontmatter.warning}
          </MarkdownNote>
        )}
        <h1 tw="text-5xl text-white mb-6 font-black w-full">
          {currentPost.frontmatter.title}
        </h1>
        {/* @ts-expect-error Server Component */}
        <MDXRemote
          source={currentPost.content}
          components={{
            code: CodeBlock,
            Note: MarkdownNote,
            h1: createHeaderRenderer("h1"),
            h2: createHeaderRenderer("h2"),
            h3: createHeaderRenderer("h3"),
            h4: createHeaderRenderer("h4"),
            h5: createHeaderRenderer("h5"),
            h6: createHeaderRenderer("h6"),
          }}
        />
        <ScrollUp />
      </div>
    </div>
  );
}
