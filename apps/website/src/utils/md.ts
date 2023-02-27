import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const getPath = (folder: string) => {
  return path.join(process.cwd(), `src/content/${folder}`); // Get full path
};

export const getFileContent = (filename: string, folder: string) => {
  const POSTS_PATH = getPath(folder);
  return fs.readFileSync(path.join(POSTS_PATH, filename), "utf8");
};

export const getSinglePost = (slug: string, folder: string) => {
  const source = getFileContent(`${slug}.mdx`, folder);
  const { data: frontmatter, content } = matter(source);
  return {
    frontmatter,
    content,
  };
};

export const getAllPosts = (folder: string) => {
  const POSTS_PATH = getPath(folder);
  const filenames = fs.readdirSync(POSTS_PATH);
  const posts = filenames
    .map((filename) => {
      const source = getFileContent(filename, folder);
      const { data: frontmatter } = matter(source);
      return {
        frontmatter,
        filename: filename.split(".").slice(0, -1).join("."), // Remove file extension
      };
    })
    .sort((a, b) => (a.frontmatter.sort < b.frontmatter.sort ? -1 : 1));
  return posts;
};

export const getPageMds = async (folder: string, currentPostSlug: string) => {
  const post = await getSinglePost(currentPostSlug, folder);
  const posts = await getAllPosts(folder);

  return {
    currentPost: post,
    posts,
  };
};
