import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/lib/blog";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import FAQAccordion from "@/components/FAQAccordion";
import MagneticButton from "@/components/MagneticButton";
import RichText from "@/components/blog/RichText";
import { blogPostJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <div className="bg-black pt-40">
      <article className="container-edge pb-20">
        <Reveal>
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-grey text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ol>
          </nav>
          <span className="eyebrow block mb-6">
            {new Date(post.datePublished).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            &middot; {post.readingTime} &middot; By {post.author}
          </span>
          <h1 className="font-display text-white text-4xl md:text-5xl lg:text-6xl leading-tight max-w-4xl">
            <TextReveal text={post.title} />
          </h1>
        </Reveal>

        <div className="max-w-3xl mt-12">
          <Reveal delay={0.1}>
            {post.intro.map((p, i) => (
              <p key={i} className="text-mist text-xl md:text-2xl leading-snug font-display mb-6">
                <RichText text={p} />
              </p>
            ))}
            <p className="text-grey text-lg leading-relaxed">
              <RichText text={post.definition} />
            </p>
          </Reveal>
        </div>

        {post.keyTakeaways.length > 0 && (
          <div className="max-w-3xl mt-12 border hairline p-8">
            <Reveal delay={0.15}>
              <span className="eyebrow block mb-6">Key Takeaways</span>
              <ul className="space-y-4">
                {post.keyTakeaways.map((t, i) => (
                  <li key={i} className="text-grey leading-relaxed pl-6 relative">
                    <span className="absolute left-0 top-[0.6em] w-2 h-px bg-grey" />
                    <RichText text={t} />
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        )}

        {post.ranking.length > 0 && (
          <div className="mt-16">
            <Reveal>
              <span className="eyebrow block mb-8">The Ranking</span>
            </Reveal>
            <div className="border-t hairline">
              {post.ranking.map((entry, i) => (
                <Reveal key={entry.rank} delay={i * 0.04}>
                  <div className="border-b hairline py-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
                    <div className="md:col-span-1">
                      <span className="font-display text-3xl text-grey/50">
                        {String(entry.rank).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="md:col-span-3">
                      {entry.internal ? (
                        <Link
                          href={entry.href}
                          data-cursor-hover
                          className="font-display text-white text-xl hover:text-grey transition-colors"
                        >
                          {entry.name}
                        </Link>
                      ) : (
                        <a
                          href={entry.href}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          data-cursor-hover
                          className="font-display text-white text-xl hover:text-grey transition-colors underline underline-offset-4"
                        >
                          {entry.name}
                        </a>
                      )}
                      <span
                        className="block text-xs uppercase tracking-[0.1em] mt-2"
                        style={{ color: "var(--color-accent)" }}
                      >
                        {entry.bestFor}
                      </span>
                    </div>
                    <div className="md:col-span-8">
                      <p className="text-grey leading-relaxed">
                        <RichText text={entry.description} />
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-3xl mt-16 space-y-16">
          {post.sections.map((section, i) => (
            <Reveal key={i}>
              <h2 className="font-display text-white text-2xl md:text-3xl leading-tight mb-6">
                {section.heading}
              </h2>
              {section.paragraphs.map((p, j) => (
                <p key={j} className="text-grey text-lg leading-relaxed mb-5">
                  <RichText text={p} />
                </p>
              ))}
              {section.table && (
                <div className="overflow-x-auto mt-8 border hairline">
                  <table className="w-full min-w-[560px] border-collapse">
                    <thead>
                      <tr className="border-b hairline">
                        {section.table.headers.map((h) => (
                          <th
                            key={h}
                            className="text-left py-4 px-5 text-grey text-sm uppercase tracking-[0.1em] font-normal"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, r) => (
                        <tr key={r} className="border-b hairline last:border-b-0">
                          {row.map((cell, c) => (
                            <td key={c} className="py-4 px-5 text-grey align-top">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Reveal>
          ))}
        </div>

        <div className="max-w-3xl mt-16">
          <Reveal>
            <MagneticButton href="/contact" variant="solid">
              Book a GTM Strategy Call
            </MagneticButton>
          </Reveal>
        </div>
      </article>

      <FAQAccordion
        items={post.faqs}
        eyebrow="Frequently Asked Questions (FAQs)"
        heading="Before you decide."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd(post)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(post.faqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ])
          ),
        }}
      />
    </div>
  );
}
