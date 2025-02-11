
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, ArrowRight, Tag } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "איך לכתוב קורות חיים שיבלטו במיוחד ב-2024",
    slug: "how-to-write-outstanding-cv-2024",
    excerpt: "המדריך המלא לכתיבת קורות חיים שיתפסו את תשומת לבם של מגייסים ומנהלי משאבי אנוש",
    author: "עמית בקשי",
    date: "2024-03-14",
    readTime: "6 דקות קריאה",
    category: "קורות חיים",
    image: "/blog/cv-writing.jpg"
  },
  {
    id: 2,
    title: "5 טרנדים בשוק העבודה שכדאי להכיר",
    slug: "5-job-market-trends-2024",
    excerpt: "סקירה מקיפה של המגמות החמות בשוק העבודה והכישורים שיהיו הכי מבוקשים בשנים הקרובות",
    author: "עמית בקשי",
    date: "2024-03-12",
    readTime: "8 דקות קריאה",
    category: "טרנדים בתעסוקה",
    image: "/blog/job-trends.jpg"
  },
  {
    id: 3,
    title: "המדריך המלא להתכונן לראיון עבודה",
    slug: "complete-job-interview-guide",
    excerpt: "כל מה שצריך לדעת כדי להגיע מוכנים לראיון העבודה ולהרשים את המראיינים",
    author: "עמית בקשי",
    date: "2024-03-10",
    readTime: "10 דקות קריאה",
    category: "ראיונות עבודה",
    image: "/blog/interview-prep.jpg"
  }
];

const Blog = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>בלוג קריירה - טיפים והמלצות לפיתוח קריירה | עמית בקשי</title>
        <meta name="description" content="בלוג מקצועי בנושאי קריירה, גיוס ומשאבי אנוש. טיפים, מדריכים וכלים פרקטיים לפיתוח הקריירה שלך." />
        <meta name="keywords" content="קריירה, גיוס, משאבי אנוש, פיתוח קריירה, מציאת עבודה, קורות חיים, ראיון עבודה" />
        <meta property="og:title" content="בלוג קריירה - טיפים והמלצות לפיתוח קריירה | עמית בקשי" />
        <meta property="og:description" content="בלוג מקצועי בנושאי קריירה, גיוס ומשאבי אנוש. טיפים, מדריכים וכלים פרקטיים לפיתוח הקריירה שלך." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/blog/og-image.jpg" />
      </Helmet>

      {/* Header */}
      <header className="pt-32 pb-16 bg-gradient-to-b from-accent/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="font-display text-4xl font-bold">בלוג קריירה</h1>
            <p className="text-lg text-muted-foreground">
              טיפים, מדריכים וכלים פרקטיים לפיתוח הקריירה שלך
            </p>
          </div>
        </div>
      </header>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all">
                <CardHeader>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {post.category}
                    </span>
                  </div>
                  <CardTitle className="text-xl leading-tight line-clamp-2 group-hover:text-accent transition-colors">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/blog/${post.slug}`} className="group">
                      קרא עוד
                      <ArrowRight className="mr-2 h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-accent/5">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="font-display text-3xl">הישארו מעודכנים</h2>
            <p className="text-muted-foreground">
              הירשמו לניוזלטר שלנו וקבלו טיפים ועדכונים שבועיים בנושאי קריירה
            </p>
            <form className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="הכנס את כתובת המייל שלך"
                className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button type="submit">הרשמה</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
