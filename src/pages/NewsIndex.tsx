import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { NewsArticle } from '@/types/supabase';
import Spinner from '@/components/Spinner';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Helmet } from 'react-helmet-async'; // Import Helmet

const NewsIndex: React.FC = () => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsArticles = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('publish_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching news articles:', error);
        setError('Failed to load news articles.');
      } else {
        setNewsArticles(data || []);
      }
      setLoading(false);
    };

    fetchNewsArticles();
  }, []);

  const listVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
    hidden: {},
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.8,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 pt-24 text-center">
          <Spinner text="Loading news..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 pt-24 text-center">
          <p className="text-lg text-red-600">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>News & Updates - Tomball T3 Robotics</title>
        <meta name="description" content="Stay updated with the latest news, announcements, and achievements from Tomball T3 Robotics, FRC Team 7312." />
      </Helmet>
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow container mx-auto px-4 py-12 pt-24"
      >
        <h1 className="text-5xl font-extrabold text-[#0d2f60] text-center mb-12">All News & Updates</h1>

        <motion.div
          className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {newsArticles.length > 0 ? (
            newsArticles.map((article) => (
              <motion.div key={article.id} variants={itemVariants} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)]">
                <Card className="text-left shadow-lg bg-white flex flex-col h-full hover:shadow-xl transition-shadow">
                  {article.image_urls && article.image_urls.length > 0 && (
                    <img
                      src={article.image_urls[0]}
                      alt={`Image for ${article.title}`}
                      className="w-full h-48 object-cover rounded-t-lg"
                      width={400} // Explicit width
                      height={192} // Explicit height (h-48 = 192px)
                    />
                  )}
                  <CardHeader className="p-4">
                    <p className="font-semibold text-gray-500 text-sm">{new Date(article.publish_date).toLocaleDateString()}</p>
                    <CardTitle className="text-xl text-[#0d2f60]">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex-grow flex flex-col justify-between">
                    <div className="prose prose-sm text-gray-700 mb-4 line-clamp-3">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {article.content}
                      </ReactMarkdown>
                    </div>
                    <Button asChild variant="link" className="p-0 h-auto justify-start text-[#d92507] hover:text-[#b31f06] mt-auto w-full">
                      <Link to={`/news/${article.id}`} className="flex items-center w-full">
                        <span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
                          Read More about "{article.title}"
                        </span>
                        <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600 text-xl mt-8">
              No news articles to display yet. Check back soon!
            </div>
          )}
        </motion.div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default NewsIndex;