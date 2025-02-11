
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Clock, ThumbsUp, MessageCircle } from "lucide-react";

const featuredPosts = [
  {
    id: 1,
    title: "איך לכתוב קורות חיים שיבלטו במיוחד ב-2024",
    slug: "how-to-write-outstanding-cv-2024",
    excerpt: "המדריך המלא לכתיבת קורות חיים שיתפסו את תשומת לבם של מגייסים ומנהלי משאבי אנוש",
    category: "resume-writing",
    date: "2024-03-14",
    readTime: "6 דקות קריאה",
    likes: 156,
    comments: 23,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  },
  {
    id: 2,
    title: "5 טרנדים בשוק העבודה שכדאי להכיר",
    slug: "5-job-market-trends-2024",
    excerpt: "סקירה מקיפה של המגמות החמות בשוק העבודה והכישורים שיהיו הכי מבוקשים בשנים הקרובות",
    category: "career-coaching",
    date: "2024-03-12",
    readTime: "8 דקות קריאה",
    likes: 234,
    comments: 45,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
  },
  {
    id: 3,
    title: "המדריך המלא להתכונן לראיון עבודה",
    slug: "complete-job-interview-guide",
    excerpt: "כל מה שצריך לדעת כדי להגיע מוכנים לראיון העבודה ולהרשים את המראיינים",
    category: "career-coaching",
    date: "2024-03-10",
    readTime: "10 דקות קריאה",
    likes: 189,
    comments: 34,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
  }
];

const FeaturedPosts = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'font-heebo' : ''}`}>
      <Helmet>
        <title>{t("nav.featuredPosts")} | {t("nav.brand")}</title>
      </Helmet>
      <div className="container pt-32">
        <h1 className="text-4xl font-display font-bold mb-8">{t("nav.featuredPosts")}</h1>
        <div className="grid gap-8">
          {featuredPosts.map((post) => (
            <Card key={post.id} className="group overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <div className="aspect-video md:aspect-square">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <CardHeader className="p-0 mb-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <CardTitle className="text-2xl mb-2 group-hover:text-accent transition-colors">
                        {post.title}
                      </CardTitle>
                    </Link>
                    <CardDescription className="text-base">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <ThumbsUp className="w-4 h-4" />
                        {post.likes}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </span>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedPosts;
