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

/**
 * Single-Turn vs Multi-Turn Conversations:
 * 
 * - model.generateContent() (Single Turn):
 *   This is a stateless method designed for one-off prompts. It takes a single input request and returns
 *   a completion. To use it for a conversational interface, you would have to manually format, manage,
 *   and append the previous conversation logs (chat history) into the prompt text on each call.
 * 
 * - model.startChat() (Multi-Turn):
 *   This is a stateful session helper that simplifies conversation flows. It tracks and persists the chat history
 *   automatically. When you call chat.sendMessage(), the SDK appends the user's message and Gemini's response
 *   to the running history list, maintaining contextual continuity over multiple turns without requiring the
 *   developer to manually rebuild the conversation chain.
 */

/**
 * Generates a weekly plan based on user profile and activity.
 * 
 * @param {Object} userData 
 * @param {string} userData.name
 * @param {'lose' | 'maintain' | 'gain'} userData.goal
 * @param {number} userData.dailyCalorieTarget
 * @param {Array} userData.last7DaysWorkouts
 * @param {Array} userData.last7DaysMeals
 * @returns {Promise<Object>} The weekly health plan JSON object
 */
async function generateWeeklyPlan(userData) {
  const shortMealsList = userData.last7DaysMeals.slice(0, 15);

  const prompt = `
You are a professional health, diet, and fitness AI assistant.
Your task is to generate a comprehensive 7-day Weekly diet and workout plan for a user named "${userData.name}".

User Details:
- Fitness Goal: ${userData.goal} (lose weight, maintain weight, or gain weight)
- Daily Calorie Target: ${userData.dailyCalorieTarget} kcal

Recent Activity (Last 7 Days):
- Workouts logged: ${JSON.stringify(userData.last7DaysWorkouts, null, 2)}
- Meals logged (up to 15 entries): ${JSON.stringify(shortMealsList, null, 2)}

Please customize the 7-day plan (Monday to Sunday) to match their goal.
For each day, provide a workout recommendation, a meal plan (breakfast, lunch, dinner, snack), the recommended total calories, and a tailored daily actionable health tip.

CRITICAL INSTRUCTIONS:
- You must respond ONLY with a raw, valid JSON object.
- DO NOT wrap the output in markdown code blocks (such as \`\`\`json ... \`\`\`), do not include any backticks, and do not include any introductory or concluding text or explanation. 
- The JSON object must strictly match this structure:
{
  "weeklyPlan": [
    {
      "day": "Monday",
      "workout": {
        "type": "string",
        "duration": number,
        "exercises": ["exercise 1", "exercise 2", "exercise 3"]
      },
      "meals": {
        "breakfast": { "name": "string", "calories": number, "protein": number },
        "lunch": { "name": "string", "calories": number, "protein": number },
        "dinner": { "name": "string", "calories": number, "protein": number },
        "snack": { "name": "string", "calories": number, "protein": number }
      },
      "totalCalories": number,
      "tip": "string"
    }
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // Clean up markdown wrappers
    text = text.replace(/```json|```/g, '').trim();

    // Extract JSON object if there is wrapping text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }

    const parsedPlan = JSON.parse(text);
    return parsedPlan;
  } catch (error) {
    console.error('Error generating weekly plan:', error);
    throw new Error('Gemini returned invalid JSON');
  }
}

/**
 * Handles nutritionist chat with memory and user health metrics context.
 * 
 * @param {Array} messages - Chat history in Gemini's format
 * @param {Object} userContext - Current user status metrics
 * @param {string} userContext.goal - 'lose' | 'maintain' | 'gain'
 * @param {number} userContext.dailyCalorieTarget
 * @param {number} userContext.todayCalories
 * @returns {Promise<string>} The generated chat response text
 */
async function chatWithNutritionist(messages, userContext) {
  try {
    const chatMessages = [...messages];

    const systemContext = `You are a concise, friendly nutritionist chatbot. The user's fitness goal is to ${userContext.goal} weight. Their daily calorie target is ${userContext.dailyCalorieTarget} kcal and they have consumed ${userContext.todayCalories} kcal today. Answer nutrition questions in 2-4 sentences. Be specific with numbers when relevant. Never give medical advice.`;

    if (chatMessages.length === 0) {
      chatMessages.push({ role: 'user', parts: [{ text: systemContext }] });
    } else if (chatMessages.length === 1) {
      chatMessages.unshift({ role: 'user', parts: [{ text: systemContext }] });
    }

    const history = chatMessages.slice(0, -1);
    const lastMessage = chatMessages[chatMessages.length - 1];

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.parts[0].text);
    return result.response.text();
  } catch (error) {
    console.error('Error in nutritionist chat service:', error);
    throw new Error('Failed to communicate with Gemini Nutritionist');
  }
}

module.exports = { model, generateWeeklyPlan, chatWithNutritionist };
