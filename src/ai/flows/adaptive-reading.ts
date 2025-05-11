// src/ai/flows/adaptive-reading.ts
'use server';
/**
 * @fileOverview Dynamically adjusts reading difficulty based on Maximus's performance.
 *
 * - adjustReadingDifficulty - A function to adjust reading difficulty based on performance.
 * - AdjustReadingDifficultyInput - The input type for the adjustReadingDifficulty function.
 * - AdjustReadingDifficultyOutput - The return type for the adjustReadingDifficulty function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustReadingDifficultyInputSchema = z.object({
  level: z.number().describe('The current difficulty level of the reading passage.'),
  score: z.number().describe('The user\'s score on the previous reading passage.'),
  correctAnswers: z.number().describe('The number of questions answered correctly on the previous reading passage.'),
  totalQuestions: z.number().describe('The total number of questions in the previous reading passage.'),
});
export type AdjustReadingDifficultyInput = z.infer<typeof AdjustReadingDifficultyInputSchema>;

const AdjustReadingDifficultyOutputSchema = z.object({
  newLevel: z.number().describe('The new difficulty level of the reading passage.'),
  reason: z.string().describe('The reason for adjusting the difficulty level.'),
});
export type AdjustReadingDifficultyOutput = z.infer<typeof AdjustReadingDifficultyOutputSchema>;

export async function adjustReadingDifficulty(input: AdjustReadingDifficultyInput): Promise<AdjustReadingDifficultyOutput> {
  return adjustReadingDifficultyFlow(input);
}

const adjustReadingDifficultyPrompt = ai.definePrompt({
  name: 'adjustReadingDifficultyPrompt',
  input: {schema: AdjustReadingDifficultyInputSchema},
  output: {schema: AdjustReadingDifficultyOutputSchema},
  prompt: `You are an AI reading tutor that adjusts the reading difficulty for Maximus. You will receive the current level, the score, number of correct answers, and total number of questions answered for the previous reading passage.

  Based on this information, determine the new difficulty level for the next reading passage. If the user is consistently answering correctly, increase the difficulty. If the user is struggling, decrease the difficulty.

  The newLevel should be a number between 1 and 10 (inclusive).

Current Level: {{{level}}}
Score: {{{score}}}
Correct Answers: {{{correctAnswers}}}
Total Questions: {{{totalQuestions}}}

Considerations:
- If the score is above 80%, increase the level by 1.
- If the score is below 50%, decrease the level by 1.
- The level should not be less than 1 or greater than 10.

Return a newLevel and provide a short reason for the adjustment.`,
});

const adjustReadingDifficultyFlow = ai.defineFlow(
  {
    name: 'adjustReadingDifficultyFlow',
    inputSchema: AdjustReadingDifficultyInputSchema,
    outputSchema: AdjustReadingDifficultyOutputSchema,
  },
  async input => {
    const {output} = await adjustReadingDifficultyPrompt(input);
    // Ensure the level stays within the valid range of 1 to 10.
    output!.newLevel = Math.max(1, Math.min(10, output!.newLevel));
    return output!;
  }
);
