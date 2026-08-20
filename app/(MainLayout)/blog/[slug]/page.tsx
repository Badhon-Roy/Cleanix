import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogsData } from "@/lib/blogsData";
import BlogDetailsContent from "@/components/blog/BlogDetailsContent";
import CtaBanner from "@/components/CtaBanner";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(blogsData).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = blogsData[slug];

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
  const blog = blogsData[slug];

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
