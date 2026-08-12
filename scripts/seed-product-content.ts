/**
 * seed-product-content.ts
 * Adds rich, realistic pharmacy content (description, uses, warnings)
 * to all existing products. Safe to run multiple times — upserts by ID.
 */
import { prisma } from '../lib/prisma';

const productContent: Record<string, { description: string; uses: string; warnings: string }> = {

  // ─── Amoxicillin 250mg Capsules ─────────────────────────────────────────
  'ae6a21aa-1d71-4513-b2ee-03543de5c9bb': {
    description:
      'Amoxicillin 250mg Capsules is a broad-spectrum penicillin-class antibiotic used to treat a wide range of bacterial infections. Each hard gelatin capsule contains 250mg of amoxicillin trihydrate, formulated for rapid absorption and effective systemic distribution. It works by inhibiting the synthesis of bacterial cell walls, ultimately causing cell death. This medicine is commonly prescribed for respiratory tract infections, urinary tract infections, ear and throat infections, and skin infections. It is available in packs of 10 and 20 capsules and should be stored at room temperature away from moisture.',
    uses:
      'Amoxicillin 250mg is indicated for the treatment of infections caused by susceptible strains of bacteria, including: upper and lower respiratory tract infections (tonsillitis, pharyngitis, sinusitis, pneumonia), urinary tract infections (UTIs), ear infections (otitis media), skin and soft tissue infections, and Helicobacter pylori eradication (in combination therapy). It may also be used as prophylaxis before dental procedures in patients at risk of bacterial endocarditis.',
    warnings:
      'Do not use if you are allergic to amoxicillin, any other penicillin antibiotic, or cephalosporins. Serious allergic reactions (anaphylaxis) can occur — seek immediate medical attention if you experience rash, swelling, or breathing difficulty. Use with caution in patients with kidney disease; dose adjustment may be required. Complete the full prescribed course even if symptoms improve — stopping early may lead to antibiotic resistance. Prolonged use may result in oral thrush or vaginal yeast infections. Do not share this antibiotic with others. Inform your doctor of all other medications you are taking.',
  },

  // ─── Aspirin Sample Test (pain killer) ──────────────────────────────────
  'ed0df95b-49f8-437e-955f-9206d8c4e288': {
    description:
      'Aspirin 75mg/325mg Tablets (Acetylsalicylic Acid) is a widely used analgesic, antipyretic, and anti-inflammatory medicine belonging to the salicylate class. Each tablet is enteric-coated to minimize gastric irritation. It works by irreversibly inhibiting cyclooxygenase (COX-1 and COX-2) enzymes, thereby reducing prostaglandin synthesis — the key mediators of pain, fever, and inflammation. At lower doses (75mg), aspirin is widely prescribed as an antiplatelet agent to reduce the risk of heart attacks and strokes. It is one of the most extensively researched medicines in the world.',
    uses:
      'Aspirin is used for: mild to moderate pain relief (headache, toothache, muscle pain, menstrual pain), reduction of fever and flu symptoms, inflammation relief in conditions such as arthritis and rheumatic disease, and as low-dose antiplatelet therapy to prevent thrombosis, heart attacks, and ischemic strokes. It may also be used in the acute treatment of myocardial infarction (heart attack) as directed by a physician.',
    warnings:
      'Aspirin should not be given to children under 16 years of age due to the risk of Reye\'s syndrome — a rare but serious condition. Do not use if you are allergic to NSAIDs or have a history of peptic ulcers, gastrointestinal bleeding, or bleeding disorders. Use with caution in patients on blood-thinning medications (warfarin, heparin) as aspirin increases bleeding risk. Avoid alcohol while taking aspirin. Do not use during the third trimester of pregnancy. Take with food or milk to reduce stomach irritation. Seek medical advice before use if you have kidney or liver disease, asthma, or gout.',
  },

  // ─── Cetirizine 10mg Tablets ────────────────────────────────────────────
  '60c4174f-5adb-44d3-bec1-5bf4baa4c1ce': {
    description:
      'Cetirizine 10mg Tablets is a second-generation, non-sedating antihistamine used for the relief of allergy symptoms. Each film-coated tablet contains cetirizine hydrochloride 10mg, the active metabolite of hydroxyzine. Unlike first-generation antihistamines, cetirizine has minimal sedative effects due to poor penetration across the blood-brain barrier. It works by selectively blocking peripheral H1 histamine receptors, reducing the allergic response triggered by allergens such as pollen, dust mites, pet dander, and mold. The effects typically begin within 1 hour and last for up to 24 hours, making once-daily dosing convenient.',
    uses:
      'Cetirizine 10mg is indicated for the treatment of: allergic rhinitis (seasonal hay fever and perennial year-round allergy) — relieving symptoms such as sneezing, runny nose, nasal congestion, and watery/itchy eyes; chronic idiopathic urticaria (hives) and allergic skin reactions; allergic conjunctivitis; and as supportive treatment for mild allergic reactions. It is suitable for adults and children over 6 years of age.',
    warnings:
      'Cetirizine may cause mild drowsiness in some patients — use caution when driving or operating heavy machinery, especially when first starting the medication. Avoid alcohol as it may enhance sedative effects. Do not use if you are allergic to cetirizine, levocetirizine, or hydroxyzine. Use with caution in patients with severe renal impairment — dose reduction may be necessary. Inform your doctor if you are pregnant or breastfeeding. Do not exceed the recommended dose of one 10mg tablet per day. Consult your doctor before use if you have epilepsy or conditions predisposing to urinary retention.',
  },

  // ─── Inlife Fish Oil Omega 3 Capsules ───────────────────────────────────
  '275b0479-fe07-4eea-ab89-46664c68b36d': {
    description:
      'Inlife Fish Oil Omega 3 Capsules (1000mg per softgel) provides a concentrated source of marine-derived omega-3 polyunsaturated fatty acids — EPA (Eicosapentaenoic Acid) 180mg and DHA (Docosahexaenoic Acid) 120mg per capsule. The oil is molecularly distilled and tested to be free from heavy metals, PCBs, and environmental contaminants. Omega-3 fatty acids are essential fats that the body cannot produce on its own and must be obtained through diet or supplementation. These fatty acids play a crucial role in cardiovascular health, brain function, joint flexibility, and reduction of systemic inflammation. Each pack contains 60 softgel capsules providing a two-month supply at one capsule per day.',
    uses:
      'Fish Oil Omega-3 supplements are used to support: cardiovascular health (reducing triglycerides and supporting healthy blood pressure and cholesterol levels), brain health and cognitive function (DHA is a major structural component of the brain), joint health and reduction of inflammation in conditions like arthritis, eye health (DHA is essential for retinal function), mood support and mental well-being, and healthy skin and hair. It may also be used alongside prescribed medications for hypertriglyceridemia under medical supervision.',
    warnings:
      'Fish Oil may increase bleeding time — use with caution if you are taking blood-thinning medications such as warfarin, aspirin, or clopidogrel, and inform your doctor or pharmacist. Consult your doctor before use if you have a fish or shellfish allergy. High doses (above 3g per day) should only be taken under medical supervision. Some patients may experience mild gastrointestinal effects such as fishy aftertaste, nausea, or loose stools — taking the capsule with food can minimize this. Refrigerate after opening to maintain freshness. Not a substitute for a balanced diet. Keep out of reach of children.',
  },

  // ─── Metformin 500mg Tablets ────────────────────────────────────────────
  '4543da5c-a923-4770-972a-9f92fcb6c263': {
    description:
      'Metformin 500mg Tablets is the first-line oral antidiabetic medication for the management of type 2 diabetes mellitus. Each tablet contains metformin hydrochloride 500mg. Metformin is a biguanide class medicine that works primarily by reducing hepatic glucose production (gluconeogenesis) in the liver, improving insulin sensitivity in peripheral tissues, and decreasing intestinal absorption of glucose. Unlike many other diabetes medications, metformin does not cause hypoglycemia (low blood sugar) when used alone and is generally weight-neutral. It is also used in polycystic ovary syndrome (PCOS) and in the prevention of type 2 diabetes in high-risk individuals.',
    uses:
      'Metformin 500mg is indicated for: management of blood glucose levels in adults with type 2 diabetes mellitus, either as monotherapy or in combination with other antidiabetic agents or insulin; management of PCOS (polycystic ovary syndrome) to improve menstrual regularity and insulin sensitivity; prevention of type 2 diabetes in prediabetic patients at high risk. It is used alongside dietary modification and regular exercise as part of a comprehensive diabetes management plan.',
    warnings:
      'Metformin is contraindicated in patients with significantly impaired kidney function (eGFR < 30 mL/min), severe liver disease, heart failure, or excessive alcohol consumption, due to the rare but serious risk of lactic acidosis. Temporarily discontinue metformin before contrast dye procedures or surgery, and restart only after confirming adequate renal function. Common side effects include nausea, vomiting, diarrhoea, and stomach upset — these usually improve if taken with food and if the dose is increased gradually. Long-term use may reduce vitamin B12 absorption — periodic B12 level monitoring is recommended. Do not use in type 1 diabetes. Contact your doctor immediately if you experience unusual muscle pain, breathing difficulty, or extreme fatigue.',
  },

  // ─── Omeprazole 20mg Capsules ───────────────────────────────────────────
  'e8c2f50f-30f0-4d10-b256-d9c712d8cb77': {
    description:
      'Omeprazole 20mg Capsules is a proton pump inhibitor (PPI) used for the treatment of acid-related gastrointestinal conditions. Each hard gelatin capsule contains omeprazole 20mg in the form of enteric-coated granules, protecting the active substance from gastric acid degradation. Omeprazole works by irreversibly inhibiting the hydrogen/potassium ATPase enzyme system (the "proton pump") in the parietal cells of the stomach lining, thereby reducing the secretion of gastric acid by up to 90%. It provides sustained acid suppression for up to 24 hours and is effective for both treatment and long-term maintenance of acid-related conditions.',
    uses:
      'Omeprazole 20mg is indicated for: gastroesophageal reflux disease (GERD/acid reflux) — providing relief from heartburn and preventing damage to the oesophagus; gastric and duodenal ulcer treatment and prevention; Helicobacter pylori eradication (as part of combination therapy with antibiotics); Zollinger-Ellison syndrome; and prevention of NSAID-induced gastric ulcers in patients requiring long-term anti-inflammatory treatment. It is typically taken once daily, preferably 30–60 minutes before the first meal of the day.',
    warnings:
      'Long-term use of omeprazole (more than 1 year) may be associated with an increased risk of bone fractures (hip, wrist, spine), low magnesium levels (hypomagnesemia), and increased susceptibility to gastrointestinal infections (such as Clostridium difficile). Do not use if you are allergic to omeprazole or other proton pump inhibitors. Omeprazole may interact with clopidogrel, methotrexate, and certain antiretroviral drugs — inform your doctor of all medications. Vitamin B12 and iron absorption may be reduced with long-term use. Omeprazole can mask symptoms of stomach cancer — consult your doctor before use if you have unexplained weight loss, difficulty swallowing, or persistent vomiting.',
  },

  // ─── Paracetamol 500mg Tablets ──────────────────────────────────────────
  'f8801d75-2f65-4922-96af-41d549bc11f6': {
    description:
      'Paracetamol 500mg Tablets (Acetaminophen) is one of the most widely used over-the-counter analgesic and antipyretic medicines in the world. Each tablet contains paracetamol 500mg. Paracetamol is believed to work by inhibiting prostaglandin synthesis in the central nervous system and blocking pain signal transmission through peripheral pain receptors. Unlike NSAIDs (ibuprofen, aspirin), paracetamol does not have significant anti-inflammatory effects and does not irritate the stomach lining, making it suitable for patients with gastrointestinal sensitivities. It is recommended as the first-choice pain reliever by the WHO and most national clinical guidelines for mild to moderate pain.',
    uses:
      'Paracetamol 500mg is used for: temporary relief of mild to moderate pain including headache, migraine, toothache, backache, muscular pain, and joint pain; reduction of fever in adults and children; relief of cold and flu symptoms; post-operative pain management; period pain (dysmenorrhea); and pain associated with osteoarthritis. It can be used safely by most patient groups including pregnant women (under medical supervision), the elderly, and children (in appropriate formulations and doses).',
    warnings:
      'Do not take more than the recommended dose (maximum 4g per day for adults, 500mg–1g every 4–6 hours). Overdose of paracetamol can cause severe and potentially fatal liver damage — this risk is increased by alcohol consumption. Do not take paracetamol with other products containing paracetamol (many cold, flu, and pain medicines contain it). Use with caution in patients with liver disease, kidney disease, or those who regularly consume alcohol. Seek immediate medical attention if you accidentally take more than the recommended dose, even if you feel well. Keep out of reach of children. Avoid prolonged use beyond 3 days for fever or 5 days for pain without medical advice.',
  },

  // ─── Vitamin D3 1000IU Softgels ─────────────────────────────────────────
  'b0947c9d-7863-42d9-a9ed-af863a4baa24': {
    description:
      'Vitamin D3 1000IU Softgels (Cholecalciferol) is a premium-grade nutritional supplement providing the body\'s preferred form of vitamin D. Each easy-to-swallow softgel capsule contains 1000 International Units (25 micrograms) of vitamin D3, dissolved in a carrier oil (typically sunflower or olive oil) for optimal absorption. Vitamin D3 is the naturally occurring form produced by the skin upon exposure to UVB sunlight and is significantly more effective at raising and maintaining blood vitamin D levels than the alternative form, vitamin D2. Vitamin D functions as both a vitamin and a prohormone, playing a critical role in calcium and phosphorus metabolism, immune system regulation, muscle function, and overall health. Vitamin D deficiency is extremely common, particularly in populations with limited sun exposure.',
    uses:
      'Vitamin D3 1000IU is used for: prevention and treatment of vitamin D deficiency; supporting calcium absorption and bone mineralisation — essential for the prevention of rickets in children and osteomalacia and osteoporosis in adults; supporting immune system function and reducing susceptibility to infections; muscle strength and function, particularly in the elderly to reduce fall risk; supporting cardiovascular health; mood regulation and reducing the risk of seasonal affective disorder (SAD); and adjunctive support in chronic conditions associated with vitamin D deficiency such as multiple sclerosis, type 2 diabetes, and autoimmune conditions.',
    warnings:
      'Do not exceed the recommended dose without medical supervision. Excessive intake of vitamin D (vitamin D toxicity / hypervitaminosis D) can cause hypercalcaemia (elevated blood calcium levels), symptoms of which include nausea, vomiting, weakness, frequent urination, kidney stones, and in severe cases, heart rhythm abnormalities. The tolerable upper intake level for adults is generally 4000 IU (100mcg) per day; higher doses should only be taken under medical monitoring. Use with caution in patients with hyperparathyroidism, sarcoidosis, or other conditions causing hypercalcaemia. Vitamin D supplements can interact with thiazide diuretics, steroids, and certain heart medications. Consult your doctor before supplementation if you have kidney or liver disease.',
  },
};

async function main() {
  console.log('🌱 Seeding product content (description, uses, warnings)...\n');

  for (const [id, content] of Object.entries(productContent)) {
    try {
      const updated = await prisma.product.update({
        where: { id },
        data: {
          description: content.description,
          uses: content.uses,
          warnings: content.warnings,
        },
        select: { name: true },
      });
      console.log(`✅ Updated: ${updated.name}`);
    } catch (err) {
      console.warn(`⚠️  Skipped ID ${id} — ${(err as Error).message}`);
    }
  }

  console.log('\n✨ Product content seeding complete!');
}

main().finally(() => prisma.$disconnect());
