
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Link, useSearchParams } from "react-router-dom";
import { Clock, Tag, ArrowRight, ThumbsUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const allPosts = [
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
  },
  {
    id: 4,
    title: "איך לבנות מיתוג אישי חזק בלינikedאין",
    slug: "linkedin-personal-branding",
    excerpt: "מדריך מעשי לבניית נוכחות דיגיטלית משמעותית בלינikedאין",
    category: "personal-branding",
    date: "2024-03-08",
    readTime: "7 דקות קריאה",
    likes: 167,
    comments: 28,
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b"
  },
  {
    id: 5,
    title: "מיומנויות רכות: המפתח להצלחה בקריירה",
    slug: "soft-skills-career-success",
    excerpt: "למה מיומנויות רכות חשובות יותר מאי פעם ואיך לפתח אותן?",
    category: "career-coaching",
    date: "2024-03-06",
    readTime: "9 דקות קריאה",
    likes: 145,
    comments: 19,
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22"
  },
  {
    id: 6,
    title: "טיפים מעשיים לניהול זמן אפקטיבי בעבודה",
    slug: "effective-time-management-tips",
    excerpt: "שיטות וכלים לניהול זמן יעיל שיעזרו לך להספיק יותר בפחות זמן",
    category: "career-coaching",
    date: "2024-03-04",
    readTime: "5 דקות קריאה",
    likes: 112,
    comments: 15,
    image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f"
  },
  {
    id: 7,
    title: "איך להתמודד עם דחייה בחיפוש עבודה",
    slug: "dealing-with-job-search-rejection",
    excerpt: "אסטרטגיות להתמודדות עם דחייה והפיכתה להזדמנות לצמיחה",
    category: "career-coaching",
    date: "2024-03-02",
    readTime: "6 דקות קריאה",
    likes: 98,
    comments: 22,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
  },
  {
    id: 8,
    title: "מדריך למעבר קריירה מוצלח",
    slug: "successful-career-transition-guide",
    excerpt: "צעדים מעשיים למעבר בין תחומי קריירה שונים",
    category: "career-coaching",
    date: "2024-02-28",
    readTime: "8 דקות קריאה",
    likes: 134,
    comments: 27,
    image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc"
  },
  {
    id: 9,
    title: "איך לבנות רשת קשרים מקצועית",
    slug: "building-professional-network",
    excerpt: "טיפים ליצירת קשרים מקצועיים משמעותיים",
    category: "personal-branding",
    date: "2024-02-26",
    readTime: "7 דקות קריאה",
    likes: 156,
    comments: 31,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0"
  },
  {
    id: 10,
    title: "שיפור יכולות התקשורת בעבודה",
    slug: "improving-workplace-communication",
    excerpt: "כלים לתקשורת אפקטיבית יותר במקום העבודה",
    category: "personal-branding",
    date: "2024-02-24",
    readTime: "6 דקות קריאה",
    likes: 143,
    comments: 25,
    image: "https://images.unsplash.com/photo-1573497491208-6b1acb260507"
  },
  {
    id: 11,
    title: "טכניקות מתקדמות לשיפור הביטחון העצמי בראיונות עבודה",
    slug: "advanced-interview-confidence-techniques",
    excerpt: "למד איך להתגבר על חרדת ראיונות ולהציג את עצמך בצורה הטובה ביותר. כולל תרגילים מעשיים וטכניקות NLP שהוכחו מחקרית",
    category: "career-coaching",
    date: "2024-02-22",
    readTime: "8 דקות קריאה",
    likes: 178,
    comments: 32,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf"
  },
  {
    id: 12,
    title: "המדריך המקיף לבניית תיק עבודות דיגיטלי מנצח",
    slug: "digital-portfolio-guide",
    excerpt: "איך ליצור פורטפוליו מקצועי שימשוך את תשומת לבם של מעסיקים פוטנציאליים. כולל דוגמאות מעשיות והמלצות עיצוב",
    category: "personal-branding",
    date: "2024-02-20",
    readTime: "9 דקות קריאה",
    likes: 165,
    comments: 29,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
  },
  {
    id: 13,
    title: "אסטרטגיות מתקדמות למשא ומתן על שכר",
    slug: "salary-negotiation-strategies",
    excerpt: "טכניקות מוכחות להשגת חבילת תגמול אופטימלית. כולל תסריטי שיחה, טיפים מאנשי HR בכירים וסימולציות מעשיות",
    category: "career-coaching",
    date: "2024-02-18",
    readTime: "10 דקות קריאה",
    likes: 223,
    comments: 41,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85"
  },
  {
    id: 14,
    title: "איך להפוך את הלינikedאין לכלי גיוס אפקטיבי",
    slug: "linkedin-recruitment-optimization",
    excerpt: "מדריך מקיף להפיכת הפרופיל שלך למגנט למגייסים. כולל אסטרטגיות SEO, טיפים לתוכן ויראלי ושיטות נטוורקינג מתקדמות",
    category: "recruitment",
    date: "2024-02-16",
    readTime: "11 דקות קריאה",
    likes: 198,
    comments: 37,
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf"
  },
  {
    id: 15,
    title: "המדריך המלא לכתיבת מכתב מקדים שמנצח",
    slug: "winning-cover-letter-guide",
    excerpt: "טכניקות מתקדמות לכתיבת מכתב מקדים שיבדל אותך ממאות מועמדים אחרים. כולל תבניות מוכנות והתאמות לתעשיות שונות",
    category: "resume-writing",
    date: "2024-02-14",
    readTime: "7 דקות קריאה",
    likes: 167,
    comments: 28,
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4"
  },
  {
    id: 16,
    title: "פיתוח קריירה בעידן הבינה המלאכותית",
    slug: "ai-era-career-development",
    excerpt: "כי��ד להתאים את המסלול המקצועי שלך לעידן ה-AI. מיומנויות חיוניות, תחומים מבטיחים וטיפים להישארות רלוונטי",
    category: "career-coaching",
    date: "2024-02-12",
    readTime: "9 דקות קריאה",
    likes: 245,
    comments: 52,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
  },
  {
    id: 17,
    title: "בניית אסטרטגיית מיתוג אישי ארוכת טווח",
    slug: "long-term-personal-branding",
    excerpt: "איך לבנות מותג אישי חזק שיעמוד במבחן הזמן. כולל תכנון אסטרטגי, ניהול מוניטין ובניית קהילה מקצועית",
    category: "personal-branding",
    date: "2024-02-10",
    readTime: "12 דקות קריאה",
    likes: 189,
    comments: 34,
    image: "https://images.unsplash.com/photo-1493612276216-ee3925520721"
  },
  {
    id: 18,
    title: "מדריך מעשי להסבת קריירה לעולם ההייטק",
    slug: "tech-career-transition-guide",
    excerpt: "צעדים מעשיים למעבר מוצלח לתעשיית ההייטק. כולל מסלולי למידה מומלצים, טיפים ממעסיקים ותובנות מאנשים שהצליחו",
    category: "career-coaching",
    date: "2024-02-08",
    readTime: "13 דקות קריאה",
    likes: 276,
    comments: 58,
    image: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0"
  },
  {
    id: 19,
    title: "אומנות הרישות העסקי בעידן הדיגיטלי",
    slug: "digital-networking-mastery",
    excerpt: "שיטות מתקדמות ליצירת קשרים מקצועיים משמעותיים באונליין. כולל אסטרטגיות לכנסים וירטואליים ופלטפורמות מקצועיות",
    category: "personal-branding",
    date: "2024-02-06",
    readTime: "8 דקות קריאה",
    likes: 156,
    comments: 27,
    image: "https://images.unsplash.com/photo-1557425529-b1ae9c141e7d"
  },
  {
    id: 20,
    title: "המדריך המלא להתמודדות עם שחיקה תעסוקתית",
    slug: "workplace-burnout-guide",
    excerpt: "אסטרטגיות מעשיות למניעת שחיקה ושמירה על איזון בריא בין העבודה לחיים האישיים. כולל תרגילי מיינדפולנס וטיפים ארגוניים",
    category: "career-coaching",
    date: "2024-02-04",
    readTime: "10 דקות קריאה",
    likes: 234,
    comments: 45,
    image: "https://images.unsplash.com/photo-1516387938699-a93567ec168e"
  }
];

const AllPosts = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getCategoryTitle = (categoryId: string) => {
    const categoryTitles: Record<string, string> = {
      'career-coaching': t('services.items.careerCoaching.title'),
      'personal-branding': t('services.items.personalBranding.title'),
      'resume-writing': t('services.items.resumeWriting.title'),
      'recruitment': t('services.items.recruitment.title')
    };
    return categoryTitles[categoryId] || categoryId;
  };

  const filteredPosts = categoryFilter
    ? allPosts.filter(post => post.category === categoryFilter)
    : allPosts;

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'font-heebo' : ''}`}>
      <Helmet>
        <title>{t("nav.allPosts")} | {t("nav.brand")}</title>
      </Helmet>
      <div className="container pt-32 pb-16">
        <h1 className="text-4xl font-display font-bold mb-8">
          {categoryFilter ? getCategoryTitle(categoryFilter) : t("nav.allPosts")}
        </h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
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
                    {getCategoryTitle(post.category)}
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
                    {isRTL ? 'קרא עוד' : 'Read more'}
                    <ArrowRight className={`mr-2 h-4 w-4 ${isRTL ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllPosts;
