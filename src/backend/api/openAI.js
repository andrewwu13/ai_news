import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

export async function summarizeArticle(article) {
    try {
        console.log(article);
        // const response = await openai.chat.completions.create({
        //     model: "gpt-4",
        //     messages: [
        //         {
        //             role: "system",
        //             content: "You are a NewKnew, a helpful assistant that summarizes daily tech news articles into rich and condensed summaries.",
        //         },
        //         {
        //             role: "user",
        //             content: `Summarize the following article into 5 concise bullet points:\n\nTitle: ${article.title}\n\nContent:\n${article.content}`,
        //         },
        //     ],
        //     temperature: 0.5,
        //     max_tokens: 250,
        // });
        // console.log("Article passed to su")
        // const summary = response.choices[0]?.message?.content;
        // return summary;
        const contentLength = article.full_content ? article.full_content.length : 'no content';
        const preview = article.full_content ? article.full_content.slice(0, 50) : '';
        return `Mock summary for article titled "${article.title}".\n\nContent length: ${contentLength}.\n\nPreview: "${preview}"...`;
    } catch (error) {
        console.error('Error generating summary:', error);
        return null;
    }
}
