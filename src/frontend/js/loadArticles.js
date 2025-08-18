let allArticlesRendered = false;

//track rendered articles
const renderedArticles = new Set();
//load articles on initial launch
loadArticles();

//check when user scrolls near bottom
window.addEventListener('scroll', async () => {
    if (!allArticlesRendered &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadArticles();
    }
});


document.getElementById('refresh-articles').addEventListener('click', async () => {
    const button = document.getElementById('refresh-articles');
    button.textContent = 'Loading...';
    try {
        const scrapeResponse = await fetch('http://127.0.0.1:5001/refresh-articles', { method: 'POST' });
        if (!scrapeResponse.ok) throw new Error('Failed to refresh articles');

        // Reset state for new articles after refresh
        allArticlesRendered = false;
        renderedArticles.clear();
        document.getElementById('article-preview').innerHTML = '';

        await loadArticles();
        button.textContent = 'Done!';
        setTimeout(() => {
            button.textContent = 'Refresh';
        }, 1000);
    } catch (err) {
        console.error('Error refreshing articles:', err);
        button.textContent = 'Refresh';
    }
});


async function loadArticles() {
    if (allArticlesRendered) return;

    try {
        const response = await fetch('http://127.0.0.1:5001/articles');
        if (!response.ok) throw new Error('Failed to fetch articles');
        const data = await response.json();

        const articles = Array.isArray(data.articles) ? data.articles : [];
        if (!articles.length) {
            allArticlesRendered = true;
            return;
        }
        
        // Filter out articles already rendered
        const newArticles = articles.filter(article => !renderedArticles.has(article.id));

        if (!newArticles.length) {
            allArticlesRendered = true;
            return;
        }

        await renderArticles(newArticles);
    } catch (err) {
        console.error('Error loading articles:', err);
    }
}

const observer = new IntersectionObserver(async (entries, observer) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            const articleElement = entry.target;
            const articleId = articleElement.getAttribute('data-article-id');
            if (!articleId) {
                observer.unobserve(articleElement);
                continue;
            }
            const articleData = articleElement.articleData;
            if (!articleData) {
                observer.unobserve(articleElement);
                continue;
            }

            // Populate article content when visible
            let formattedContent = '';
            try {
                const result = await getOpenAIResponse({
                    title: articleData.title,
                    full_content: articleData.full_content ?? '',
                });
                formattedContent = result.summary.replace(/\n/g, '<br>') || 'No summary available';
            } catch (e) {
                console.error('OpenAI summary error', e);
                formattedContent = (articleData.full_content ?? '').slice(0, 200) + '...'; //fallback
            }

            const dateStr = articleData.date_published || '';
            let formattedDate = 'No date available';
            if (dateStr) {
                const dateObj = new Date(dateStr);
                if (!isNaN(dateObj)) {
                    formattedDate = dateObj.toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    });
                }
            }

            articleElement.innerHTML = `
                <div class="article">
                    <img src="${articleData.image_url}" alt="" class="article-image" loading="lazy" />
                    <div class="article-content">
                        <a href="${articleData.url}" class="article-title">${articleData.title}</a>
                        <p class="article-author">${articleData.author}</p>
                        <p class="article-date">${formattedDate}</p>
                    </div>
                </div>
                <p class="article-summary">${formattedContent}</p>
            `;

            observer.unobserve(articleElement);
        }
    }
}, {
    rootMargin: '0px 0px 200px 0px',
    threshold: 0.1
});

async function renderArticles(articles) {
    console.log('Rendering articles:', articles);
    if (!Array.isArray(articles)) {
        console.error('Articles is not an array', articles);
        return;
    }
    
    const preview = document.getElementById('article-preview');

    for (const article of articles) {
        if (renderedArticles.has(article.id)) {
            continue;
        } else {
            // Mark article as rendered to prevent duplicates
            renderedArticles.add(article.id);

            // Create placeholder element
            const articleElement = document.createElement('div');
            articleElement.classList.add('article-wrapper');
            articleElement.setAttribute('data-article-id', article.id);
            articleElement.innerHTML = `<p>Loading article...</p>`;
            articleElement.articleData = article; // store article data for lazy loading

            preview.appendChild(articleElement);
            observer.observe(articleElement);
        }
    }
}

async function getOpenAIResponse(article) {
    const response = await fetch('http://127.0.0.1:5001/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
    });
    if (!response.ok) throw new Error('OpenAI request failed');
    return await response.json();
}
