document.getElementById("refresh-articles").addEventListener('click', async () => {
    try {
        const scrapeResponse = await fetch('http://127.0.0.1:5001/refresh-articles', {method: 'POST'});
        if (!scrapeResponse.ok) throw new Error("Failed to refresh articles");

        const response = await fetch('http://127.0.0.1:5001/articles');
        if (!response.ok) throw new Error('Failed to fetch articles');
        const articles = await response.json();
        //console.log('Articles: ', articles);

        renderArticles(articles);
    } catch (err) {
        console.error("Error refreshing articles:", err)
    }
});


function renderArticles(articles) {
    const preview = document.getElementById('article-preview');
    preview.innerHTML = '';
    for (const article of articles) {
        const formattedContent = article.summary.replace(/\n/g, '<br>');
        const dateStr = article.date_published || '';
        let formattedDate = 'No date available';
        if (dateStr) {
            const dateObj = new Date(dateStr);
            if (!isNaN(dateObj)) {
                formattedDate = dateObj.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            }
        }
        const articleElement = document.createElement('div');
        articleElement.classList.add('article-wrapper');
        articleElement.innerHTML = `
            <div class="article">
                <img src="${article.image_url}" alt="" class="article-image" />
                <div class="article-content">
                    <p class="article-title">${article.title}</p>
                    <p class="article-author">${article.author}</p>
                    <p class="article-date">${formattedDate}</p>
                </div>
            </div>
            <p class="article-summary">${formattedContent}</p>
        `;
        preview.appendChild(articleElement);
    }
}