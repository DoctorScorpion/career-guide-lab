
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Clock, User, Tag, ArrowLeft, Share2 } from "lucide-react";

// בהמשך נחבר למערכת ניהול תוכן אמיתית
const getBlogPost = (slug: string) => {
  return {
    title: "איך לכתוב קורות חיים שיבלטו במיוחד ב-2024",
    content: `
      <p>בשוק העבודה התחרותי של היום, קורות חיים מרשימים הם הכרטיס שלכם להצלחה. במאמר זה נסקור את הטיפים החשובים ביותר לכתיבת קורות חיים שיבלטו ויעזרו לכם להשיג את התפקיד שאתם רוצים.</p>
      
      <h2>1. התאמה אישית לתפקיד</h2>
      <p>חשוב להתאים את קורות החיים לדרישות התפקיד הספציפי אליו אתם מגישים מועמדות. קראו את תיאור התפקיד בעיון והדגישו את הכישורים והניסיון הרלוונטיים.</p>
      
      <h2>2. מבנה ברור ונקי</h2>
      <p>השתמשו בכותרות ברורות, רווחים נכונים ופונט קריא. קורות חיים מסודרים מקלים על המגייסים לסרוק את המידע החשוב במהירות.</p>
      
      <h2>3. הישגים מדידים</h2>
      <p>במקום לתאר רק את תחומי האחריות שלכם, הדגישו הישגים מדידים. למשל: "הובלתי פרויקט שהגדיל את המכירות ב-30%".</p>
    `,
    author: "עמית בקשי",
    date: "2024-03-14",
    readTime: "6 דקות קריאה",
    category: "קורות חיים",
    image: "/blog/cv-writing.jpg"
  };
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = getBlogPost(slug || "");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.title} | בלוג קריירה - עמית בקשי</title>
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
                חזרה לבלוג
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
                  פורסם ב-{post.date}
                </div>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  שתף מאמר
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
