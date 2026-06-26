const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Gemini AI Service Initialization
 * 
 * 1. API Key Authentication:
 *    The GEMINI_API_KEY environment variable is used to authenticate our server requests with Google's
 *    AI services. It identifies our application, handles rate limiting, usage tracking, and verifies permissions.
 * 
 * 2. Model Selection ('gemini-1.5-flash'):
 *    We use the 'gemini-1.5-flash' model here.
 *    - Why Flash over Pro:
 *      * Speed: Flash is optimized for high-speed, low-latency execution, which is crucial for real-time user experiences like chat and quick response generation.
 *      * Cost Efficiency: Flash is significantly cheaper to run, making it much more cost-effective for general application usage.
 *      * Capabilities: While 'gemini-1.5-pro' is designed for complex reasoning, multi-modal tasks, and heavy tasks, 'gemini-1.5-flash' is perfectly suited for general text processing, JSON formatting, summaries, and chat features.
 */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

module.exports = { model };
