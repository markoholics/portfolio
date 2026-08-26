import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import { blogPosts } from "@/lib/blog";
import { webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "GTM Strategy & AI-Native Marketing Insights",
  description:
    "Research-backed guides on GTM strategy, AI-native marketing, and demand generation for Series A-C tech, SaaS, and AI founders.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  return (
    <div className="bg-black pt-40">
      <section className="container-edge pb-16">
        <Reveal>
          <span className="eyebrow block mb-6">Insights</span>
          <h1 className="font-display text-white text-4xl md:text-5xl lg:text-6xl leading-tight max-w-3xl">
            <TextReveal text="GTM strategy, written for operators." />
          </h1>
          <p className="text-grey text-lg max-w-2xl mt-8">
            Research-backed guides on go-to-market strategy, AI-native
            marketing operations, and demand generation, written for the
            founders and marketing leaders who have to make the call, not
            just read about it.
          </p>
        </Reveal>
      </section>

      <section className="section-pad pt-0">
        <div className="container-edge">
          <div className="border-t hairline">
            {blogPosts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.05}>
                <Link
                  href={`/blog/${post.slug}`}
                  data-cursor-hover
                  className="block border-b hairline py-10 group"
                >
                  <span className="eyebrow block mb-4 text-grey">
                    {new Date(post.datePublished).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    &middot; {post.readingTime}
                  </span>
                  <h2 className="font-display text-white text-2xl md:text-3xl leading-snug max-w-2xl group-hover:text-grey transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-grey text-lg max-w-2xl mt-4">
                    {post.excerpt}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              name: "Blog | Markoholics",
              description: metadata.description as string,
              path: "/blog",
            })
          ),
        }}
      />
    </div>
  );
}
