// src/ai/flows/adaptive-difficulty.ts
'use server';
/**
 * @fileOverview Dynamically adjusts the difficulty of math problems based on the user's performance.
 *
 * - adjustDifficulty - A function that adjusts the difficulty based on performance.
 * - AdjustDifficultyInput - The input type for the adjustDifficulty function.
 * - AdjustDifficultyOutput - The return type for the adjustDifficulty function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustDifficultyInputSchema = z.object({
  currentDifficulty: z
    .number()
    .describe('The current difficulty level of the math problems.'),
  correctAnswers: z
    .number()
    .describe('The number of correctly answered problems in a row.'),
  incorrectAnswers: z
    .number()
    .describe('The number of incorrectly answered problems in a row.'),
});
export type AdjustDifficultyInput = z.infer<typeof AdjustDifficultyInputSchema>;

const AdjustDifficultyOutputSchema = z.object({
  newDifficulty: z
    .number()
    .describe('The new difficulty level of the math problems.'),
  reasoning: z
    .string()
    .describe('The AI reasoning for the adjusted difficulty level.'),
});
export type AdjustDifficultyOutput = z.infer<typeof AdjustDifficultyOutputSchema>;

export async function adjustDifficulty(input: AdjustDifficultyInput): Promise<AdjustDifficultyOutput> {
  return adjustDifficultyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adjustDifficultyPrompt',
  input: {schema: AdjustDifficultyInputSchema},
  output: {schema: AdjustDifficultyOutputSchema},
  prompt: `You are an AI math tutor who is responsible for adjusting the difficulty of math problems for a student.

You will receive the current difficulty level, the number of correctly answered problems in a row, and the number of incorrectly answered problems in a row.

Based on this information, you will determine the new difficulty level and explain your reasoning.

If the student has answered several problems correctly in a row, you should increase the difficulty.
If the student has answered several problems incorrectly in a row, you should decrease the difficulty.
If the student has a mix of correct and incorrect answers, you should keep the difficulty the same.

Current Difficulty: {{{currentDifficulty}}}
Correct Answers in a Row: {{{correctAnswers}}}
Incorrect Answers in a Row: {{{incorrectAnswers}}}

New Difficulty:`,
});

const adjustDifficultyFlow = ai.defineFlow(
  {
    name: 'adjustDifficultyFlow',
    inputSchema: AdjustDifficultyInputSchema,
    outputSchema: AdjustDifficultyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
