document.getElementById('refresh-articles').addEventListener('click', async () => {
    const button = document.getElementById('refresh-articles');
    button.textContent = 'Loading...';
    try {
        const scrapeResponse = await fetch('http://127.0.0.1:5001/refresh-articles', { method: 'POST' });
        if (!scrapeResponse.ok) throw new Error('Failed to refresh articles');

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
    try {
        const response = await fetch('http://127.0.0.1:5001/articles');
        if (!response.ok) throw new Error('Failed to fetch articles');
        const articles = await response.json();
        await renderArticles(articles);
    } catch (err) {
        console.error('Error loading articles:', err);
    }
}

async function renderArticles(articles) {
    const preview = document.getElementById('article-preview');
    preview.innerHTML = '';
    for (const article of articles) {
        //call backend to get summar via openai
        let formattedContent = '';
        try {
            const result = await getOpenAIResponse({
                title: article.title,
                full_content: article.full_content ?? '',
            });
            formattedContent = (result.summary).replace(/\n/g, '<br>') || 'No summary available';
        } catch (e) {
            console.error('OpenAI summary error', e);
            formattedContent = (article.full_content ?? '').slice(0, 200) + '...'; //fallback
        }

        //const formattedContent = (article.full_content ?? '').replace(/\n/g, '<br>');
        const dateStr = article.date_published || '';
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
        const articleElement = document.createElement('div');
        articleElement.classList.add('article-wrapper');
        articleElement.innerHTML = `
            <div class="article">
                <img src="${article.image_url}" alt="" class="article-image" />
                <div class="article-content">
                    <a href="${article.url}" class="article-title">${article.title}</a>
                    <p class="article-author">${article.author}</p>
                    <p class="article-date">${formattedDate}</p>
                </div>
            </div>
            <p class="article-summary">${formattedContent}</p>
        `;
        preview.appendChild(articleElement);
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
loadArticles();
