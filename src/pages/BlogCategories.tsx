
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, FileText, UserCheck, Users } from "lucide-react";
import { allPosts } from "./AllPosts";

const categories = [
  { 
    id: 'career-coaching',
    icon: Briefcase,
    titleKey: 'services.items.careerCoaching.title',
    posts: allPosts.filter(post => post.category === 'career-coaching').length
  },
  {
    id: 'resume-writing',
    icon: FileText,
    titleKey: 'services.items.resumeWriting.title',
    posts: allPosts.filter(post => post.category === 'resume-writing').length
  },
  {
    id: 'personal-branding',
    icon: UserCheck,
    titleKey: 'services.items.personalBranding.title',
    posts: allPosts.filter(post => post.category === 'personal-branding').length
  },
  {
    id: 'recruitment',
    icon: Users,
    titleKey: 'services.items.recruitment.title',
    posts: allPosts.filter(post => post.category === 'recruitment').length
  }
];

const BlogCategories = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/blog/all?category=${categoryId}`);
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'font-heebo' : ''}`}>
      <Helmet>
        <title>{t("nav.categories")} | {t("nav.brand")}</title>
      </Helmet>
      <div className="container pt-32">
        <h1 className="text-4xl font-display font-bold mb-8">{t("nav.categories")}</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="group hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleCategoryClick(category.id)}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <category.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-xl">{t(category.titleKey)}</CardTitle>
                  <CardContent className="p-0 text-sm text-muted-foreground">
                    {t("nav.postsCount", { count: category.posts })}
                  </CardContent>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogCategories;
