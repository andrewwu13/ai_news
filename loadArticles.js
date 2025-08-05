fetch('articles.json')
    .then((res) => res.json())
    .then((data) => {
        const preview = document.getElementById('article-preview');
        preview.innerHTML = ''; // Clear any existing content

        for (var i = 0; i < data.length; i++) {
            const article = data[i];
            const formattedContent = article.content.replace(/\n/g, '<br>');

            const articleElement = document.createElement('div');
            articleElement.classList.add('article-wrapper');
            articleElement.innerHTML = `
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
            preview.appendChild(articleElement);
        }
    })
    .catch((err) => {
        console.error("Failed to load articles.json:", err);
        const preview = document.getElementById('article-preview');
        preview.innerHTML = '<p style="font-size: 20px; color: #555;">No articles available at the moment.</p>';
    });
