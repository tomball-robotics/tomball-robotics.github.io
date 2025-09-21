import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { NewsArticle } from '@/types/supabase';
import Spinner from '@/components/Spinner';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const NewsArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      if (!id) {
        setError("Article ID is missing.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching news article:', error);
        setError('Failed to load news article. It might not exist or an error occurred.');
      } else {
        setArticle(data);
      }
      setLoading(false);
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 pt-24 text-center">
          <Spinner text="Loading news article..." />
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

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 pt-24 text-center">
          <p className="text-lg text-gray-600">News article not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const publishDate = new Date(article.publish_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow container mx-auto px-4 py-12 pt-24 max-w-4xl"
      >
        <article className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-4xl font-extrabold text-[#0d2f60] mb-4">{article.title}</h1>
          <p className="text-gray-600 text-sm mb-6">Published on: {publishDate}</p>

          {article.image_urls && article.image_urls.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {article.image_urls.map((url, index) => (
                <div key={index} className="overflow-hidden rounded-md shadow-sm">
                  <img
                    src={url}
                    alt={`${article.title} image ${index + 1}`}
                    className="w-full h-80 object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>
        </article>
      </motion.main>
      <Footer />
    </div>
  );
};

export default NewsArticlePage;