
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

const BlogCategories = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'font-heebo' : ''}`}>
      <Helmet>
        <title>{t("nav.categories")} | {t("nav.brand")}</title>
      </Helmet>
      <div className="container pt-32">
        <h1 className="text-4xl font-display font-bold mb-8">{t("nav.categories")}</h1>
        {/* תוכן הקטגוריות יתווסף כאן */}
      </div>
    </div>
  );
};

export default BlogCategories;
