
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, ArrowRight, Tag, Bookmark, ThumbsUp, MessageCircle } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "איך לכתוב קורות חיים שיבלטו במיוחד ב-2024",
    slug: "how-to-write-outstanding-cv-2024",
    excerpt: "המדריך המלא לכתיבת קורות חיים שיתפסו את תשומת לבם של מגייסים ומנהלי משאבי אנוש. גלה את הטכניקות המתקדמות ביותר.",
    author: "עמית בקשי",
    date: "2024-03-14",
    readTime: "6 דקות קריאה",
    category: "קורות חיים",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    featured: true,
    likes: 156,
    comments: 23
  },
  {
    id: 2,
    title: "5 טרנדים בשוק העבודה שכדאי להכיר",
    slug: "5-job-market-trends-2024",
    excerpt: "סקירה מקיפה של המגמות החמות בשוק העבודה והכישורים שיהיו הכי מבוקשים בשנים הקרובות. למד איך להתכונן לעתיד.",
    author: "עמית בקשי",
    date: "2024-03-12",
    readTime: "8 דקות קריאה",
    category: "טרנדים בתעסוקה",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    featured: true,
    likes: 234,
    comments: 45
  },
  {
    id: 3,
    title: "המדריך המלא להתכונן לראיון עבודה",
    slug: "complete-job-interview-guide",
    excerpt: "כל מה שצריך לדעת כדי להגיע מוכנים לראיון העבודה ולהרשים את המראיינים. טיפים מעשיים ודוגמאות לשאלות נפוצות.",
    author: "עמית בקשי",
    date: "2024-03-10",
    readTime: "10 דקות קריאה",
    category: "ראיונות עבודה",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    likes: 189,
    comments: 34
  },
  {
    id: 4,
    title: "איך לבנות מיתוג אישי חזק בלינקדאין",
    slug: "linkedin-personal-branding",
    excerpt: "מדריך מעשי לבניית נוכחות דיגיטלית משמעותית בלינקדאין. טיפים לפרופיל מנצח ואסטרטגיות לנטוורקינג.",
    author: "עמית בקשי",
    date: "2024-03-08",
    readTime: "7 דקות קריאה",
    category: "מיתוג אישי",
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b",
    likes: 167,
    comments: 28
  },
  {
    id: 5,
    title: "מיומנויות רכות: המפתח להצלחה בקריירה",
    slug: "soft-skills-career-success",
    excerpt: "למה מיומנויות רכות חשובות יותר מאי פעם ואיך לפתח אותן? מדריך מקיף למיומנויות התקשורת, המנהיגות והעבודה בצוות.",
    author: "עמית בקשי",
    date: "2024-03-06",
    readTime: "9 דקות קריאה",
    category: "פיתוח אישי",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    likes: 145,
    comments: 19
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

      {/* Header with Search */}
      <header className="pt-32 pb-16 bg-gradient-to-b from-accent/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="font-display text-4xl font-bold">בלוג קריירה</h1>
            <p className="text-lg text-muted-foreground">
              טיפים, מדריכים וכלים פרקטיים לפיתוח הקריירה שלך
            </p>
            <div className="relative max-w-xl mx-auto">
              <input
                type="search"
                placeholder="חפש במאמרים..."
                className="w-full px-4 py-3 rounded-xl border bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Featured Posts */}
      <section className="py-16 bg-accent/5">
        <div className="container">
          <h2 className="text-2xl font-display font-bold mb-8">מאמרים מובילים</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {blogPosts.filter(post => post.featured).map((post) => (
              <Card key={post.id} className="group overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {post.category}
                    </span>
                  </div>
                  <CardTitle className="text-2xl mb-3 group-hover:text-accent transition-colors">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mb-4">
                    {post.excerpt}
                  </CardDescription>
                  <div className="flex items-center justify-between">
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
                    <Button variant="ghost" size="sm" className="group" asChild>
                      <Link to={`/blog/${post.slug}`}>
                        קרא עוד
                        <ArrowRight className="mr-2 h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts Grid */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-display font-bold mb-8">מאמרים אחרונים</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(post => !post.featured).map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all">
                <CardHeader className="p-0">
                  <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-t-lg">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {post.category}
                    </span>
                  </div>
                  <CardTitle className="!mt-0 text-xl leading-tight line-clamp-2 group-hover:text-accent transition-colors">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex items-center justify-between">
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
                  <Button variant="ghost" size="sm" className="group" asChild>
                    <Link to={`/blog/${post.slug}`}>
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
