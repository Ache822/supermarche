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
        title="Knowledge Base | Supermarche Help Center"
        description="Browse help articles, guides, warranties, Mobile Money escrow documentation, and provider manuals."
      />
      <KnowledgeBaseView
        initialSelectedArticleId={articleSlug}
        onOpenSupport={handleOpenSupport}
      />
    </>
  );
}

export { KnowledgeBaseView };
