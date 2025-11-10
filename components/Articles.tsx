import React, { useState } from 'react';
import { generateMotorcycleArticle } from '../services/geminiService.ts';
import { AiIcon } from './icons.tsx';
import { useOnlineStatus } from '../hooks/useOnlineStatus.ts';

interface Article {
  title: string;
  content: string;
}

const sampleArticles: Article[] = [
  {
    title: "The Importance of Regular Chain Maintenance",
    content: `Your motorcycle's chain is a critical component transferring power from the engine to the rear wheel. A well-maintained chain ensures smooth power delivery, prevents premature wear of sprockets, and is a crucial safety item. Neglecting it can lead to poor performance and even chain failure, which can be catastrophic.

### Key Maintenance Steps:
- **Cleaning:** Use a quality chain cleaner and a soft brush to remove old lube, dirt, and grime.
- **Lubrication:** Apply a fresh coat of motorcycle-specific chain lubricant evenly.
- **Tension Check:** Check for the correct slack as specified in your owner's manual. Too tight or too loose can cause problems.

Check your chain every 500-700 kilometers, and after every wash or ride in the rain.`
  },
  {
    title: "Tire Pressure: The Easiest Safety Check You Can Do",
    content: `Proper tire pressure is vital for the safety, handling, and longevity of your motorcycle's tires. It's the single most important check you can perform.

### Why it Matters:
- **Under-inflated tires:** Can overheat, cause sluggish handling, and wear out unevenly and quickly.
- **Over-inflated tires:** Reduce the contact patch with the road, leading to less grip and a harsh ride.

Always check your tire pressure when the tires are cold (i.e., before you ride) using a reliable pressure gauge. The correct pressures are listed in your owner's manual and often on a sticker on the swingarm.`
  }
];


const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(sampleArticles);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [activeArticleIndex, setActiveArticleIndex] = useState<number | null>(0);
  const isOnline = useOnlineStatus();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !isOnline) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateMotorcycleArticle(topic);
      const title = result.match(/^(#|\*\*)\s*(.*?)(\*\*|$)/m)?.[2] || topic;
      const newArticle: Article = { title, content: result };
      setArticles(prev => [newArticle, ...prev]);
      setTopic('');
      setActiveArticleIndex(0);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleArticle = (index: number) => {
    setActiveArticleIndex(activeArticleIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <h2 className="text-3xl font-display font-bold text-center text-light mb-8">Motorcycle Maintenance Articles</h2>
      
      <div className="bg-card p-6 rounded-lg shadow-2xl mb-8">
        <h3 className="text-xl font-bold text-primary-orange mb-4">Generate a New Article with AI</h3>
        <p className="text-muted mb-4">Have a specific question? Enter a topic below and let our AI generate a detailed maintenance article for you.</p>
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text" 
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g., How to check brake fluid"
            className="flex-grow bg-dark text-light p-3 rounded-md border border-charcoal focus:outline-none focus:ring-2 focus:ring-primary-orange disabled:bg-charcoal"
            disabled={isLoading || !isOnline}
          />
          <button
            type="submit"
            disabled={isLoading || !topic.trim() || !isOnline}
            className="bg-primary-orange text-white font-bold py-3 px-6 rounded-md hover:opacity-90 transition-opacity duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed inline-flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
               <>
                  <AiIcon className="w-5 h-5"/>
                  <span>Generate</span>
               </>
            )}
          </button>
        </form>
         {!isOnline && (
          <p className="text-yellow-400 text-sm mt-4">
            You are offline. Connect to the internet to generate new articles.
          </p>
        )}
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>

      <div className="space-y-4">
        {articles.map((article, index) => (
          <div key={index} className="bg-card rounded-lg overflow-hidden border border-transparent hover:border-primary-orange/50 transition-colors">
            <button onClick={() => toggleArticle(index)} className="w-full text-left p-4 flex justify-between items-center hover:bg-charcoal/50 transition-colors">
              <h4 className="text-lg font-bold text-light">{article.title}</h4>
              <svg className={`w-5 h-5 text-muted transform transition-transform ${activeArticleIndex === index ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {activeArticleIndex === index && (
              <div className="p-6 border-t border-charcoal prose prose-invert prose-headings:text-primary-orange prose-strong:text-white max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-muted leading-relaxed">{article.content}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Articles;