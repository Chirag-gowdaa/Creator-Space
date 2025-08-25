import React from 'react';

async function fetchnews() {
  try {
    const res = await fetch(
      `https://newsdata.io/api/1/news?apikey=${process.env.NEWS_API_KEY}&q=gym OR film OR marvel OR F1 OR content creator OR youtube OR influencer&language=en&image=1`,
      { next: { revalidate: 3600 } }
    );

    const data = await res.json();
    return Array.isArray(data.results) ? data.results : [];
  } catch (err) {
    console.error("Failed to fetch news", err);
    return [];
  }
}


const Page = async () => {
    const articles = await fetchnews();

    return (
        <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" style={{ marginTop: "80px", marginBottom: "40px" }}>
            {articles?.map((article, idx) => (
                <a
                    key={idx}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                >
                    {article.image_url && (
                        <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-48 object-cover"
                        />
                    )}
                    <div className="p-4">
                        <h3 className="font-semibold text-lg line-clamp-2">{article.title}</h3>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                            {article.description || 'No description available'}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            {article.source_id} • {new Date(article.pubDate).toLocaleDateString()}
                        </p>
                    </div>
                </a>
            ))}
        </div>
    );
};

export default Page;
