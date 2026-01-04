import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchLatestAINews, HISTORICAL_REPORTS } from './services/gemini';
import { NewsContent, NewsArticle, GroundingSource } from './types';
import Navbar from './components/Navbar';
import ArticleHeader from './components/ArticleHeader';
import NewsSection from './components/NewsSection';
import Skeleton from './components/Skeleton';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import SubscribeModal from './components/SubscribeModal';
import CategoryMenu from './components/CategoryMenu';
import ArticleOverlay from './components/ArticleOverlay';

const STORAGE_KEY = 'ai_news_archive_v18'; 
const SYNC_KEY = 'ai_news_last_sync_timestamp';
const USER_KEY = 'ai_user_email';
const SUB_KEY = 'ai_user_subscribed';

const App: React.FC = () => {
  const [news, setNews] = useState<NewsContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isSubscribeModalOpen, setSubscribeModalOpen] = useState(false);
  
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem(USER_KEY));
  const [isSubscribed, setIsSubscribed] = useState<boolean>(localStorage.getItem(SUB_KEY) === 'true');

  // FIX: Initialization lock to prevent double-firing in React StrictMode
  const initialized = useRef(false);

  const saveToCache = useCallback((newContent: NewsContent | null) => {
    const cachedRaw = localStorage.getItem(STORAGE_KEY);
    const articleMap = new Map<string, NewsArticle>();
    const sourceMap = new Map<string, GroundingSource>();

    // Step 1: Initialize with expanded Historical Reports (Guarantee variety)
    HISTORICAL_REPORTS.forEach(a => {
      const key = a.title.trim().toLowerCase();
      articleMap.set(key, { ...a, category: a.category.toUpperCase() });
    });

    // Step 2: Merge existing Archive from LocalStorage (Retain previous syncs)
    if (cachedRaw) {
      try {
        const cached: NewsContent = JSON.parse(cachedRaw);
        cached.articles.forEach(a => {
          const key = a.title.trim().toLowerCase();
          // Retain if unique or if new version has more content
          const existing = articleMap.get(key);
          if (!existing || a.content.length > existing.content.length) {
            articleMap.set(key, { ...a, category: a.category.toUpperCase() });
          }
        });
        cached.sources.forEach(s => sourceMap.set(s.uri, s));
      } catch (e) {
        console.warn("Recalibrating archive...");
      }
    }

    // Step 3: Merge Fresh Intelligence from latest fetch
    if (newContent) {
      newContent.articles.forEach(a => {
        const key = a.title.trim().toLowerCase();
        const existing = articleMap.get(key);
        if (!existing || a.content.length > existing.content.length) {
          articleMap.set(key, { ...a, category: a.category.toUpperCase() });
        }
      });
      newContent.sources.forEach(s => sourceMap.set(s.uri, s));
    }

    let allArticles = Array.from(articleMap.values());
    
    // Sort by date (newest first)
    allArticles.sort((a, b) => {
      const d1 = new Date(a.date).getTime() || 0;
      const d2 = new Date(b.date).getTime() || 0;
      return d2 - d1;
    });

    // Limit to 500 unique articles to keep a deep history
    if (allArticles.length > 500) {
      allArticles = allArticles.slice(0, 500);
    }

    const finalContent: NewsContent = {
      articles: allArticles,
      sources: Array.from(sourceMap.values()).slice(0, 100),
      lastUpdated: newContent?.lastUpdated || news?.lastUpdated || new Date().toLocaleDateString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalContent));
    localStorage.setItem(SYNC_KEY, Date.now().toString());
    setNews(finalContent);
  }, [news]);

  const loadNews = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      setIsRefreshing(true);
      setError(null);
      
      const data = await fetchLatestAINews();
      if (data && data.articles && data.articles.length > 0) {
        saveToCache(data);
      } else {
        saveToCache(null);
      }
    } catch (err: any) {
      console.error("Sync error:", err.message);
      // Attempt to load from cache even on error
      const cachedRaw = localStorage.getItem(STORAGE_KEY);
      
      // UX Improvement: Only show error if we really have NO data to show.
      // If we have cached data, just show that and suppress the red alert.
      if (cachedRaw) {
        try {
          // Refresh the cache view (ensure we are showing latest stored data)
          const cached = JSON.parse(cachedRaw);
          if (cached.articles.length > HISTORICAL_REPORTS.length) {
            console.warn("Using cached data due to API failure.");
            setNews(cached);
          } else {
             // We only have hardcoded history, show error
             setError(`Sync Alert: ${err.message}. Showing archive.`);
             saveToCache(null);
          }
        } catch (e) {
          setError(`Sync Alert: ${err.message}. Showing archive.`);
          saveToCache(null);
        }
      } else {
         setError(`Sync Alert: ${err.message}. Showing archive.`);
         saveToCache(null); 
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [news, saveToCache]);

  useEffect(() => {
    // FIX: Strict Mode Guard
    if (initialized.current) return;
    initialized.current = true;

    const cachedRaw = localStorage.getItem(STORAGE_KEY);
    const lastSync = localStorage.getItem(SYNC_KEY);
    
    if (cachedRaw) {
      try {
        const parsed = JSON.parse(cachedRaw);
        setNews(parsed);
        setLoading(false);
        // Refresh every 24 hours
        if (!lastSync || Date.now() - parseInt(lastSync) > 86400000) {
          loadNews(true);
        }
      } catch (e) {
        loadNews();
      }
    } else {
      saveToCache(null);
      loadNews();
    }
  }, []);

  const handleSignInSuccess = (email: string) => {
    setUserEmail(email);
    localStorage.setItem(USER_KEY, email);
  };

  const handleSubscribeSuccess = (email: string) => {
    setUserEmail(email);
    setIsSubscribed(true);
    localStorage.setItem(USER_KEY, email);
    localStorage.setItem(SUB_KEY, 'true');
  };

  const handleSignOut = () => {
    setUserEmail(null);
    setIsSubscribed(false);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(SUB_KEY);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-orange-100">
      <Navbar 
        onSignInClick={() => setAuthModalOpen(true)}
        onSubscribeClick={() => setSubscribeModalOpen(true)}
        userEmail={userEmail}
        onSignOut={handleSignOut}
      />
      
      <main className="max-w-screen-xl mx-auto px-6 py-12">
        {loading && (!news || news.articles.length === 0) ? (
          <Skeleton />
        ) : (
          <>
            <ArticleHeader 
              date={news?.lastUpdated || new Date().toLocaleDateString()} 
              isRefreshing={isRefreshing}
              onRefresh={() => loadNews()}
            />
            
            <CategoryMenu 
              selectedCategory={selectedCategory} 
              onSelect={setSelectedCategory}
              className="mb-12"
            />

            {error && (
               <div className="mb-8 p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-700 text-center text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-500">
                 {error}
               </div>
            )}
            
            <NewsSection 
              content={news} 
              onSubscribeClick={() => setSubscribeModalOpen(true)}
              onArticleClick={setSelectedArticle}
              filter={selectedCategory}
              isSubscribed={isSubscribed}
            />
          </>
        )}
      </main>

      <Footer />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onSuccess={handleSignInSuccess}
      />

      <SubscribeModal 
        isOpen={isSubscribeModalOpen} 
        onClose={() => setSubscribeModalOpen(false)} 
        onSuccess={handleSubscribeSuccess}
      />

      <ArticleOverlay 
        article={selectedArticle} 
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
};

export default App;