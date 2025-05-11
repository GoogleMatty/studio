'use server';
/**
 * @fileOverview Suggests related entities (organizations, people, and vendors) based on input data.
 *
 * - suggestRelatedEntities - A function that suggests related entities.
 * - SuggestRelatedEntitiesInput - The input type for the suggestRelatedEntities function.
 * - SuggestRelatedEntitiesOutput - The return type for the suggestRelatedEntities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelatedEntitiesInputSchema = z.object({
  customerData: z
    .string()
    .describe('The data entered for the customer, including name, address, and other relevant information.'),
});
export type SuggestRelatedEntitiesInput = z.infer<typeof SuggestRelatedEntitiesInputSchema>;

const SuggestRelatedEntitiesOutputSchema = z.object({
  organizations: z.array(z.string()).describe('A list of suggested related organizations.'),
  people: z.array(z.string()).describe('A list of suggested related people.'),
  vendors: z.array(z.string()).describe('A list of suggested related vendors.'),
});
export type SuggestRelatedEntitiesOutput = z.infer<typeof SuggestRelatedEntitiesOutputSchema>;

export async function suggestRelatedEntities(
  input: SuggestRelatedEntitiesInput
): Promise<SuggestRelatedEntitiesOutput> {
  return suggestRelatedEntitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelatedEntitiesPrompt',
  input: {schema: SuggestRelatedEntitiesInputSchema},
  output: {schema: SuggestRelatedEntitiesOutputSchema},
  prompt: `Based on the following customer data, suggest related organizations, people, and vendors. Return the results as a JSON object.

Customer Data: {{{customerData}}}`,
});

const suggestRelatedEntitiesFlow = ai.defineFlow(
  {
    name: 'suggestRelatedEntitiesFlow',
    inputSchema: SuggestRelatedEntitiesInputSchema,
    outputSchema: SuggestRelatedEntitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
