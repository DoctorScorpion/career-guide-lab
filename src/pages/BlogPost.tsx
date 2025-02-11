
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Clock, User, Tag, ArrowLeft, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const BlogPost = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // בהמשך נחבר למערכת ניהול תוכן אמיתית
  const getBlogPost = (slug: string) => {
    return {
      title: t("blog.post.defaultTitle"),
      content: t("blog.post.defaultContent"),
      author: t("blog.post.defaultAuthor"),
      date: "2024-03-14",
      readTime: t("blog.post.readTime", { minutes: 6 }),
      category: t("blog.post.defaultCategory"),
      image: "/blog/cv-writing.jpg"
    };
  };

  const post = getBlogPost(slug || "");

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'font-heebo' : ''}`}>
      <Helmet>
        <title>{post.title} | {t("blog.title")}</title>
        <meta name="description" content={post.content.substring(0, 155)} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.substring(0, 155)} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={post.image} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        <meta property="article:tag" content={post.category} />
      </Helmet>

      {/* Header */}
      <header className="pt-32 pb-16 bg-gradient-to-b from-accent/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Button variant="ghost" asChild className="mb-8">
              <Link to="/blog" className="inline-flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("blog.backToBlog")}
              </Link>
            </Button>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  {post.category}
                </span>
                <span className="inline-flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
              </div>
              <h1 className="font-display text-4xl font-bold">{post.title}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="aspect-w-16 aspect-h-9 mb-8">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share Section */}
            <div className="mt-16 pt-8 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {t("blog.publishedOn", { date: post.date })}
                </div>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  {t("blog.sharePost")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
