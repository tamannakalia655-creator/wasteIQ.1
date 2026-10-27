'use server';
/**
 * @fileOverview An AI assistant that provides detailed waste disposal instructions.
 *
 * - wasteDisposalAssistant - A function that handles the waste disposal query and provides instructions.
 * - WasteDisposalAssistantInput - The input type for the wasteDisposalAssistant function.
 * - WasteDisposalAssistantOutput - The return type for the wasteDisposalAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WasteDisposalAssistantInputSchema = z.object({
  query: z.string().describe("The user's natural language query about waste disposal."),
});
export type WasteDisposalAssistantInput = z.infer<typeof WasteDisposalAssistantInputSchema>;

const WasteDisposalAssistantOutputSchema = z.object({
  wasteType: z.string().describe('The identified type of waste (e.g., "Plastic Bottle").'),
  category: z.string().describe('The category of the waste (e.g., "Dry / Recyclable Waste").'),
  bin: z.string().describe('The appropriate bin type for disposal (e.g., "🔵 Blue Bin").'),
  instruction: z.string().describe('Specific preparation steps before disposal (e.g., "Rinse the bottle and remove the cap before disposal.").'),
  tip: z.string().describe('A helpful eco-friendly tip related to the waste item (e.g., "Recycling plastic reduces pollution.").'),
});
export type WasteDisposalAssistantOutput = z.infer<typeof WasteDisposalAssistantOutputSchema>;

export async function wasteDisposalAssistant(input: WasteDisposalAssistantInput): Promise<WasteDisposalAssistantOutput> {
  return wasteDisposalAssistantFlow(input);
}

const wasteDisposalAssistantPrompt = ai.definePrompt({
  name: 'wasteDisposalAssistantPrompt',
  input: {schema: WasteDisposalAssistantInputSchema},
  output: {schema: WasteDisposalAssistantOutputSchema},
  prompt: `You are an expert waste disposal assistant for a smart waste management app named WasteIQ.
Your goal is to help citizens dispose of their waste responsibly by providing clear, concise, and accurate instructions.

Based on the user's query, identify the waste type, its category, the correct bin for disposal (including emoji), specific preparation instructions, and a helpful eco-friendly tip.

Follow these primary disposal examples exactly when applicable:

1. Waste Type: Plastic Bottle
   Category: Dry / Recyclable Waste
   Bin: 🔵 Blue Bin
   Instruction: Rinse the bottle and remove the cap before disposal.
   Tip: Recycling plastic saves energy and reduces pollution.

2. Waste Type: Vegetable Peels
   Category: Wet / Biodegradable Waste
   Bin: 🟢 Green Bin
   Instruction: Place the peels directly into the green bin without plastic packaging.
   Tip: Vegetable peels can be composted to create natural fertilizer.

3. Waste Type: Glass Bottle
   Category: Dry / Recyclable Waste
   Bin: 🔵 Blue Bin
   Instruction: Empty and rinse the bottle before placing it in the bin.
   Tip: Glass can be recycled many times without losing quality.

4. Waste Type: Aluminum Can
   Category: Dry / Recyclable Waste
   Bin: 🔵 Blue Bin
   Instruction: Rinse and crush the can before disposal.
   Tip: Recycling aluminum saves up to 95% of energy used in production.

5. Waste Type: Food Leftovers
   Category: Wet / Biodegradable Waste
   Bin: 🟢 Green Bin
   Instruction: Remove any plastic or packaging before disposing.
   Tip: Food waste can be composted instead of thrown away.

6. Waste Type: Old Newspapers
   Category: Dry / Recyclable Waste
   Bin: 🔵 Blue Bin
   Instruction: Keep newspapers dry and bundle them together before disposal.
   Tip: Newspapers are easily recyclable and reusable.

7. Waste Type: Used Battery
   Category: Hazardous Waste
   Bin: 🔴 Red Bin
   Instruction: Place batteries in a hazardous waste container and avoid mixing with regular waste.
   Tip: Batteries contain harmful chemicals that can pollute soil and water.

8. Waste Type: Sanitary Pads
   Category: Biomedical / Hazardous Waste
   Bin: 🔴 Red Bin
   Instruction: Wrap the pad in paper before placing it in the bin.
   Tip: Use biodegradable sanitary products when possible.

9. Waste Type: Broken Bulb
   Category: Hazardous Waste
   Bin: 🔴 Red Bin
   Instruction: Wrap the broken bulb in newspaper before disposal to avoid injury.
   Tip: Handle broken glass carefully.

10. Waste Type: Cardboard Box
    Category: Dry / Recyclable Waste
    Bin: 🔵 Blue Bin
    Instruction: Flatten the box before placing it in the bin.
    Tip: Flattened cardboard saves space and makes recycling easier.

11. Waste Type: Banana Peel
    Category: Wet / Biodegradable Waste
    Bin: 🟢 Green Bin
    Instruction: Dispose the peel directly into the wet waste bin.
    Tip: Banana peels decompose quickly and are great for compost.

12. Waste Type: Coconut Shell
    Category: Wet / Biodegradable Waste
    Bin: 🟢 Green Bin
    Instruction: Break the shell into smaller pieces before disposal.
    Tip: Coconut shells can also be reused as plant holders.

13. Waste Type: Used Tea Bags
    Category: Wet / Biodegradable Waste
    Bin: 🟢 Green Bin
    Instruction: Remove any staples or plastic before disposal.
    Tip: Tea bags can be composted to enrich soil.

14. Waste Type: Milk Packet
    Category: Dry / Recyclable Waste
    Bin: 🔵 Blue Bin
    Instruction: Rinse the packet and fold it before throwing.
    Tip: Cleaning the packet helps recycling plants process it better.

15. Waste Type: Chips Packet
    Category: Dry / Non-Recyclable Waste
    Bin: 🔵 Blue Bin
    Instruction: Empty the packet and dispose of it in the dry waste bin.
    Tip: Try reducing single-use snack packaging to minimize waste.

16. Waste Type: Thermocol (Styrofoam)
    Category: Dry / Non-Biodegradable Waste
    Bin: 🔵 Blue Bin
    Instruction: Place the thermocol pieces in the dry waste bin.
    Tip: Avoid breaking thermocol into small pieces as it spreads easily.

17. Waste Type: Broken Ceramic Plate
    Category: Dry Waste
    Bin: 🔵 Blue Bin
    Instruction: Wrap broken pieces in paper before disposal.
    Tip: Wrapping prevents injury to waste collectors.

18. Waste Type: Old Clothes
    Category: Dry Waste / Reusable Waste
    Bin: 🔵 Blue Bin
    Instruction: Donate usable clothes or place them in dry waste collection.
    Tip: Reusing clothes reduces textile waste.

19. Waste Type: Mosquito Repellent Bottle
    Category: Hazardous Waste
    Bin: 🔴 Red Bin
    Instruction: Empty the bottle and dispose of it in hazardous waste.
    Tip: Keep chemicals away from regular waste to prevent contamination.

20. Waste Type: Expired Cosmetics
    Category: Hazardous Waste
    Bin: 🔴 Red Bin
    Instruction: Dispose of cosmetic containers in the hazardous waste bin.
    Tip: Do not pour chemicals into drains.

21. Waste Type: Used Mask
    Category: Biomedical Waste
    Bin: 🔴 Red Bin
    Instruction: Cut the mask straps and wrap it in paper before disposal.
    Tip: Proper disposal prevents infection spread.

22. Waste Type: Small E-waste (Earphones / Charger)
    Category: Electronic Waste
    Bin: 🔴 Red Bin / E-waste Collection Center
    Instruction: Submit at an authorized e-waste collection point.
    Tip: Electronic waste contains valuable metals that can be recycled.

Query: {{{query}}}`,
});

const FALLBACK_DISPOSAL_GUIDE: Record<string, WasteDisposalAssistantOutput> = {
  "plastic": {
    wasteType: "Plastic Container / Bottle",
    category: "Dry / Recyclable Waste",
    bin: "🔵 Blue Bin",
    instruction: "Rinse out any liquid residue, crush to reduce volume, and place in the dry waste bin.",
    tip: "Clean plastics are recycled into textile fibers and municipal construction material."
  },
  "bottle": {
    wasteType: "Plastic / Glass Bottle",
    category: "Dry / Recyclable Waste",
    bin: "🔵 Blue Bin",
    instruction: "Empty completely, rinse with water, and remove the plastic seal or cap.",
    tip: "Glass can be recycled indefinitely without degradation."
  },
  "pizza": {
    wasteType: "Pizza Box",
    category: "Dry / Recyclable (if clean) or Wet (if oily)",
    bin: "🔵 Blue Bin / 🟢 Green Bin",
    instruction: "Tear off clean top cardboard for recycling (Blue Bin); put greasy food-stained bottom in Green Bin.",
    tip: "Oil and melted cheese contaminate paper recycling pulp."
  },
  "peel": {
    wasteType: "Vegetable / Fruit Peels",
    category: "Wet / Biodegradable Waste",
    bin: "🟢 Green Bin",
    instruction: "Place directly into the green compostable bin without any plastic wrappers or bags.",
    tip: "Food scraps can be turned into organic compost for household gardens."
  },
  "banana": {
    wasteType: "Banana Peel",
    category: "Wet / Biodegradable Waste",
    bin: "🟢 Green Bin",
    instruction: "Drop directly in the green wet waste bucket.",
    tip: "Banana peels are rich in potassium and decompose quickly in compost."
  },
  "coconut": {
    wasteType: "Coconut Shell / Husk",
    category: "Wet / Garden Biomass",
    bin: "🟢 Green Bin",
    instruction: "Break into smaller pieces if possible to assist municipal composting.",
    tip: "Coconut husks are processed into organic coir and soil conditioners."
  },
  "battery": {
    wasteType: "Used Battery (AA / AAA / Button)",
    category: "Hazardous / Toxic Waste",
    bin: "🔴 Red Bin (Hazardous)",
    instruction: "Store safely in a dry bag and hand over to municipal e-waste collection or Red Bins.",
    tip: "Never throw batteries in regular waste; heavy metals like cadmium pollute groundwater."
  },
  "chips": {
    wasteType: "Multi-layered Plastic (Chips / Biscuit Wrapper)",
    category: "Dry / Non-Recyclable MLP",
    bin: "🔵 Blue Bin (Dry Waste)",
    instruction: "Empty all crumbs and place into dry waste. In Baripada, these are sent for co-processing in cement kilns.",
    tip: "Try carrying reusable snack boxes to minimize single-use packaging."
  },
  "milk": {
    wasteType: "Milk Pouch",
    category: "Dry / Recyclable Low-Density Polyethylene",
    bin: "🔵 Blue Bin",
    instruction: "Snip only a corner (avoid cutting a tiny detached tip), rinse with water, and keep dry.",
    tip: "Rinsed milk pouches have high recycling value in municipal sorting centers."
  },
  "charger": {
    wasteType: "Old Cable / Charger / Earphones",
    category: "Electronic Waste (E-Waste)",
    bin: "🔴 Red Bin / Authorized E-Waste Center",
    instruction: "Hand over at ward e-waste dropoff drives or designated municipal e-waste bins.",
    tip: "E-waste contains recoverable copper and rare earth metals."
  },
  "mask": {
    wasteType: "Surgical / Used Mask",
    category: "Biomedical Waste",
    bin: "🔴 Red Bin (Sanitary / Hazardous)",
    instruction: "Cut the earloops, wrap securely in clean newspaper, and mark with a red dot.",
    tip: "Wrapping prevents exposure to sanitation staff."
  },
  "pad": {
    wasteType: "Sanitary Pad / Diaper",
    category: "Sanitary / Hazardous Waste",
    bin: "🔴 Red Bin",
    instruction: "Wrap securely in the provided bag or newspaper before disposal in Red Bin.",
    tip: "Never flush sanitary items; they clog municipal drainage networks."
  }
};

const wasteDisposalAssistantFlow = ai.defineFlow(
  {
    name: 'wasteDisposalAssistantFlow',
    inputSchema: WasteDisposalAssistantInputSchema,
    outputSchema: WasteDisposalAssistantOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await wasteDisposalAssistantPrompt(input);
      if (output) return output;
    } catch (err) {
      console.error("wasteDisposalAssistantPrompt failed, using verified municipal rules fallback:", err);
    }

    // Match query against curated verified Indian municipal waste guidelines
    const q = input.query.toLowerCase();
    for (const [key, item] of Object.entries(FALLBACK_DISPOSAL_GUIDE)) {
      if (q.includes(key)) {
        return item;
      }
    }

    // Generic fallback based on wet vs dry keyword heuristics
    if (q.includes("food") || q.includes("leaf") || q.includes("tea") || q.includes("egg") || q.includes("rice") || q.includes("curry")) {
      return {
        wasteType: "Organic Food / Kitchen Waste",
        category: "Wet / Biodegradable Waste",
        bin: "🟢 Green Bin",
        instruction: "Place in the green compostable bin without any plastic wrappers or plastic containers.",
        tip: "Composting organic kitchen waste keeps up to 50% of municipal waste out of landfills."
      };
    }

    if (q.includes("paper") || q.includes("can") || q.includes("box") || q.includes("metal") || q.includes("glass") || q.includes("cup")) {
      return {
        wasteType: "Recyclable Packaging / Paper",
        category: "Dry / Recyclable Waste",
        bin: "🔵 Blue Bin",
        instruction: "Keep clean and dry, flatten packaging where possible, and place into the blue dry waste bin.",
        tip: "Recycling clean paper and cardboard saves trees and municipal water resources."
      };
    }

    return {
      wasteType: input.query,
      category: "Dry Waste (General Municipal Classification)",
      bin: "🔵 Blue Bin (Dry Waste)",
      instruction: "Ensure the item is dry and free of organic food residues before placing in the blue dry bin.",
      tip: "When in doubt, keep wet (food/organic) and dry (packaging/solid) items in separate household bins."
    };
  }
);
