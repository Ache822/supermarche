import { useParams, useNavigate } from 'react-router-dom';
import { KnowledgeBaseView } from './components/knowledge-base/KnowledgeBaseView';
import { SEO } from '../../components/seo/SEO';

interface HelpArticlesDirectoryPageProps {
  onOpenLiveChat?: () => void;
}

export function HelpArticlesDirectoryPage({ onOpenLiveChat }: HelpArticlesDirectoryPageProps) {
  const { articleSlug } = useParams<{ articleSlug?: string }>();
  const navigate = useNavigate();

  const handleOpenSupport = () => {
    if (onOpenLiveChat) {
      onOpenLiveChat();
    } else {
      navigate('/help');
    }
  };

  return (
    <>
      <SEO
        title="Knowledge Base & Guides | Kim's Store Help Center"
        description="Browse help articles, sizing guides, express delivery timelines, size exchanges, and Mobile Money documentation for Kim's Store."
      />
      <KnowledgeBaseView
        initialSelectedArticleId={articleSlug}
        onOpenSupport={handleOpenSupport}
      />
    </>
  );
}

export { KnowledgeBaseView };
