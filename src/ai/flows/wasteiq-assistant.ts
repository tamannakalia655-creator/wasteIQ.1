'use server';
/**
 * @fileOverview A general-purpose AI assistant for the WasteIQ application.
 *
 * - wasteiqAssistant - A function that handles general queries about WasteIQ.
 * - WasteIQAssistantInput - The input type for the wasteiqAssistant function.
 * - WasteIQAssistantOutput - The return type for the wasteiqAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WasteIQAssistantInputSchema = z.object({
  query: z.string().describe("The user's natural language question about WasteIQ."),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })).optional().describe("Chat history for context."),
});
export type WasteIQAssistantInput = z.infer<typeof WasteIQAssistantInputSchema>;

const WasteIQAssistantOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the user query.'),
});
export type WasteIQAssistantOutput = z.infer<typeof WasteIQAssistantOutputSchema>;

export async function wasteiqAssistant(input: WasteIQAssistantInput): Promise<WasteIQAssistantOutput> {
  return wasteiqAssistantFlow(input);
}

const wasteiqAssistantPrompt = ai.definePrompt({
  name: 'wasteiqAssistantPrompt',
  input: {schema: WasteIQAssistantInputSchema},
  output: {schema: WasteIQAssistantOutputSchema},
  prompt: `You are the WasteIQ Virtual Assistant, a friendly and knowledgeable AI expert for the WasteIQ smart waste management platform in Baripada.

WasteIQ Features & Knowledge Base:
1. Smart Bins: 140 sensor-enabled bins across 28 wards. They track fill levels (0-100%).
2. Waste Reporting: Citizens can report issues like overflowing bins or illegal dumping. Workers are then assigned to fix them.
3. Rewards: Citizens earn "Eco Points" for using the app responsibly and participating in cleanup drives.
4. Disposal Guide: An AI tool that tells users which bin (Green/Blue/Yellow/Red) to use for specific items.
5. Roles: Citizens (report/earn), Workers (duty/tasks), Admins (monitor/broadcast).
6. Baripada: The city is divided into 28 municipal wards.
7. Support: help@wasteiq.in or 1800-123-WASTE.

Current User Query: {{{query}}}

Chat History (if any):
{{#each history}}
- {{role}}: {{content}}
{{/each}}

Provide a helpful, concise answer based on WasteIQ's features. If you don't know the answer, suggest contacting support.`,
});

const wasteiqAssistantFlow = ai.defineFlow(
  {
    name: 'wasteiqAssistantFlow',
    inputSchema: WasteIQAssistantInputSchema,
    outputSchema: WasteIQAssistantOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await wasteiqAssistantPrompt(input);
      if (output?.answer) return output;
    } catch (err) {
      console.error("wasteiqAssistantPrompt error, using Baripada knowledge fallback:", err);
    }

    const q = input.query.toLowerCase();
    let answer = "WasteIQ is the smart municipal waste platform for Baripada, Mayurbhanj. You can find smart bins on the map, file reports, or check our disposal guide.";

    if (q.includes("bin") || q.includes("map") || q.includes("where")) {
      answer = "There are 140 smart sensor-equipped bins across all 28 wards in Baripada. You can check real-time fill levels and get directions by opening the Waste Map from your dashboard.";
    } else if (q.includes("report") || q.includes("complain") || q.includes("overflow") || q.includes("dirty")) {
      answer = "To report an issue, tap 'Report an Issue' on your Citizen Dashboard. Select the issue type, enter your location or landmark, and submit. Sanitation workers assigned to your ward will be dispatched.";
    } else if (q.includes("reward") || q.includes("point")) {
      answer = "Citizens earn +10 Eco Points for each verified community waste report submitted. Accumulated points advance your Eco Champion rank and unlock civic badges.";
    } else if (q.includes("color") || q.includes("green") || q.includes("blue") || q.includes("red")) {
      answer = "🟢 Green Bins are for Wet / Biodegradable food waste. 🔵 Blue Bins are for Dry recyclables like plastics, paper, and metal cans. 🔴 Red Bins are for Hazardous and Sanitary waste.";
    } else if (q.includes("ward") || q.includes("baripada")) {
      answer = "Baripada Municipality has 28 wards, from Budhikhamari (Ward 1) to Mayurbhanj Palace Gate (Ward 28). Each ward has assigned sanitation workers and smart bins.";
    }

    return { answer };
  }
);
