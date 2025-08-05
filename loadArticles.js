fetch('articles.json')
    .then((res) => res.json())
    .then((data) => {
        const article = data[0]; // or loop over all
        const preview = document.getElementById('article-preview');
        const formattedContent = article.content.replace(/\n/g, '<br>');

        preview.innerHTML = `
            <div class="article">
                <img src="${article.img}" alt="" class="article-image" />
                <div class="article-content">
                    <p class="article-title">${article.title}</p>
                    <p class="article-author">${article.author}</p>
                    <p class="article-date">${article.date}</p>
                </div>
            </div>
            <p class="article-summary">${formattedContent}</p>
        `;
    });
