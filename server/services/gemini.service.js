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

module.exports = { model, generateWeeklyPlan };
