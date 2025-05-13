
'use server';
/**
 * @fileOverview Generates kindness scenarios for children.
 *
 * - generateKindnessScenario - A function that creates a scenario with choices.
 * - GenerateKindnessScenarioInput - The input type for the function (currently empty).
 * - KindnessScenarioOutput - The return type, including scenario, choices, correct choice, and explanation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input schema can be expanded later for difficulty, themes, etc.
const GenerateKindnessScenarioInputSchema = z.object({}).describe("Input for generating a kindness scenario. Currently no specific parameters needed.");
export type GenerateKindnessScenarioInput = z.infer<typeof GenerateKindnessScenarioInputSchema>;

const KindnessScenarioOutputSchema = z.object({
  scenarioText: z.string().describe('A short, child-friendly scenario posing an ethical or social choice.'),
  choiceA: z.string().describe('The first possible action or response (Option A).'),
  choiceB: z.string().describe('The second possible action or response (Option B).'),
  correctChoice: z.enum(['A', 'B']).describe("Indicates which choice ('A' or 'B') is considered more kind or pro-social."),
  explanation: z.string().describe('A brief explanation of why the correct choice is preferable, in simple terms for a child.'),
});
export type KindnessScenarioOutput = z.infer<typeof KindnessScenarioOutputSchema>;

export async function generateKindnessScenario(input: GenerateKindnessScenarioInput): Promise<KindnessScenarioOutput> {
  return kindnessScenarioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'kindnessScenarioPrompt',
  input: {schema: GenerateKindnessScenarioInputSchema},
  output: {schema: KindnessScenarioOutputSchema},
  prompt: `You are an AI assistant that creates simple ethical dilemmas and social scenarios for children aged 6-9. The goal is to teach kindness and good social behavior in a fun, game-like context (Fortnite-themed, but focus on universal kindness).

Generate a scenario where a child has to make a choice.
Provide:
1.  **scenarioText**: A short (2-3 sentences) description of the situation.
2.  **choiceA**: The first option the child can choose.
3.  **choiceB**: The second option the child can choose.
4.  **correctChoice**: Identify whether 'A' or 'B' is the kinder/more pro-social option.
5.  **explanation**: A brief, simple explanation (1-2 sentences) why the correctChoice is better, suitable for a 6-9 year old.

Example format:
Scenario: You see a new kid at the playground looking lonely while everyone else is playing a game.
Choice A: Ignore the new kid and keep playing with your friends.
Choice B: Ask the new kid if they want to join your game.
Correct Choice: B
Explanation: Including others is a kind way to make new friends and help someone feel welcome.

Make the scenarios relatable and age-appropriate. Avoid complex vocabulary.
The choices should be clearly distinct. One should be noticeably kinder or more thoughtful than the other.
Focus on everyday situations: sharing, helping, including others, honesty, empathy.
---
New Scenario Request:
(No specific input parameters for now, just generate a new one)
`,
});

const kindnessScenarioFlow = ai.defineFlow(
  {
    name: 'kindnessScenarioFlow',
    inputSchema: GenerateKindnessScenarioInputSchema,
    outputSchema: KindnessScenarioOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a kindness scenario.");
    }
    // Basic validation to ensure the output has the correctChoice field as 'A' or 'B'
    if (output.correctChoice !== 'A' && output.correctChoice !== 'B') {
        // Attempt to fix or default if missing/invalid, though schema should catch this.
        // This is a fallback, ideally the LLM respects the schema.
        console.warn("AI returned invalid correctChoice, defaulting or re-evaluating might be needed.");
        // For now, let's assume the schema validation from definePrompt handles this robustly.
        // If it were critical, one might try to infer or default, e.g. output.correctChoice = 'A';
    }
    return output;
  }
);
