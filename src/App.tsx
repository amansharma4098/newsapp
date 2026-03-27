import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import ArticlePage from '@/pages/Article';
import CategoryPage from '@/pages/Category';
import BookmarksPage from '@/pages/Bookmarks';
import ExplorePage from '@/pages/Explore';
import SettingsPage from '@/pages/Settings';
import SearchPage from '@/components/SearchModal';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/search" element={<SearchPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
