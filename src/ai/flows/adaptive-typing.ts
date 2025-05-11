// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Adjusts typing difficulty based on user performance.
 *
 * Exports:
 * - `adjustTypingDifficulty`: Adjusts the difficulty of typing exercises based on the user's performance.
 * - `AdjustTypingDifficultyInput`: Input type for the `adjustTypingDifficulty` function.
 * - `AdjustTypingDifficultyOutput`: Output type for the `adjustTypingDifficulty` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustTypingDifficultyInputSchema = z.object({
  previousText: z
    .string()
    .describe('The text that the user previously typed.'),
  userTypingResult: z
    .string()
    .describe('The user input for the previous text.'),
  currentDifficultyLevel: z
    .number()
    .describe('The current difficulty level of the typing exercise.'),
});
export type AdjustTypingDifficultyInput = z.infer<typeof AdjustTypingDifficultyInputSchema>;

const AdjustTypingDifficultyOutputSchema = z.object({
  newText: z.string().describe('The new typing text for the user.'),
  newDifficultyLevel: z
    .number()
    .describe('The new difficulty level of the typing exercise.'),
  feedback: z.string().describe('Feedback for the user on their typing.'),
});
export type AdjustTypingDifficultyOutput = z.infer<typeof AdjustTypingDifficultyOutputSchema>;

export async function adjustTypingDifficulty(
  input: AdjustTypingDifficultyInput
): Promise<AdjustTypingDifficultyOutput> {
  return adjustTypingDifficultyFlow(input);
}

const adjustTypingDifficultyPrompt = ai.definePrompt({
  name: 'adjustTypingDifficultyPrompt',
  input: {schema: AdjustTypingDifficultyInputSchema},
  output: {schema: AdjustTypingDifficultyOutputSchema},
  prompt: `You are an AI typing tutor who will help Maximus improve his typing skills.

You will receive the text he previously typed, his result, and the current difficulty level. You will respond with a new typing text, and a new difficulty level.

Here is the information about the last round:
Previous Text: {{{previousText}}}
User Typing Result: {{{userTypingResult}}}
Current Difficulty Level: {{{currentDifficultyLevel}}}

Based on this, generate a new text for Maximus to type, adjust the difficulty level appropriately, and give him some feedback on his typing.

Difficulty levels range from 1 to 10. If Maximus is doing well, increase the difficulty level. If he is struggling, decrease the difficulty level.

Consider these factors when increasing the difficulty:
- Increase the length of the words.
- Use more difficult words.
- Increase the length of the text.

Consider these factors when decreasing the difficulty:
- Decrease the length of the words.
- Use simpler words.
- Decrease the length of the text.

Output the new text, the new difficulty level, and some feedback for Maximus.`,
});

const adjustTypingDifficultyFlow = ai.defineFlow(
  {
    name: 'adjustTypingDifficultyFlow',
    inputSchema: AdjustTypingDifficultyInputSchema,
    outputSchema: AdjustTypingDifficultyOutputSchema,
  },
  async input => {
    const {output} = await adjustTypingDifficultyPrompt(input);
    return output!;
  }
);
