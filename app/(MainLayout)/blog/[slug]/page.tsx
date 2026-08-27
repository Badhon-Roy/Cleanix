import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailsContent from "@/components/blog/BlogDetailsContent";
import CtaBanner from "@/components/CtaBanner";
import { fetchBlogBySlugServer } from "@/services/blogServerService";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchBlogBySlugServer(slug);

  if (!blog) {
    return {
      title: "Article Not Found | Cleanix",
    };
  }

  return {
    title: `${blog.title} | Cleanix Blog`,
    description: blog.shortDesc,
    keywords: [blog.title, "Cleanix Blog", "Cleaning Guide", blog.category],
  };
}

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const blog = await fetchBlogBySlugServer(slug);

  if (!blog) {
    notFound();
  }

  return (
    <>
      <BlogDetailsContent blog={blog} />
      <CtaBanner />
    </>
  );
}
