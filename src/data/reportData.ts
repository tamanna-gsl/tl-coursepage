// Sample performance report data. Coherent with the scripted discussion from
// Screen 5 (a weak, hesitant, off-topic-once performance) and the reference
// screenshots. In the real product the scoring engine computes these values;
// here they are static and made internally consistent. Keyed by case id.

export interface SkillScore {
  title: string;
  /** Out of SKILL_MAX (4). */
  score: number;
  feedback: string;
}

export interface RadarPoint {
  axis: string;
  /** Out of RADAR_MAX (5). */
  value: number;
}

export interface MasteryBand {
  band: string;
  count: number;
}

export interface ReportData {
  /** All percentages, 0-100. */
  scores: { overall: number; caseAnalysis: number; participation: number };
  feedback: string;
  partB: SkillScore[];
  partA: SkillScore[];
  learningProfile: {
    topStrengths: string[];
    growthAreas: string[];
    nextLevel: string[];
    centurySkills: string;
  };
  radar: RadarPoint[];
  mastery: MasteryBand[];
}

export const SKILL_MAX = 4;
export const RADAR_MAX = 5;

export const reports: Record<string, ReportData> = {
  "nykaa-story": {
    scores: { overall: 39.6, caseAnalysis: 37.5, participation: 42.9 },
    feedback:
      "Your performance in this case discussion needs real improvement. You showed limited preparation and engagement with the core material, and trying to change the subject to unrelated topics broke the flow of the analysis. You identified very basic ideas such as risk management and authentic sellers when heavily prompted, but you did not back them with depth, analysis, or evidence from the case. For next time, read the case thoroughly beforehand, stay on topic, and aim for detailed, reasoned answers.",
    partB: [
      {
        title: "Understanding the Market Gap",
        score: 2,
        feedback:
          "You vaguely identified a gap by noting they had authentic sellers, but did not elaborate on the real problem of counterfeit products customers faced.",
      },
      {
        title: "Understanding Role of Market Research & Forecasting",
        score: 2,
        feedback:
          "You correctly noted that market research is part of risk management, but did not explain how it helped Nykaa forecast demand or succeed.",
      },
      {
        title: "Analysis of Nykaa's Strategy",
        score: 1,
        feedback:
          "You did not analyse Nykaa's strategic choices around technology, marketing, or partnerships. You only mentioned starting smaller.",
      },
      {
        title: "Evaluation of USP & Customer Focus",
        score: 2,
        feedback:
          "You identified the USP of authentic sellers at a surface level when prompted, but did not evaluate how it built trust or set the brand apart.",
      },
      {
        title: "Application of Learning to Business Idea",
        score: 1,
        feedback:
          "Asked to advise as an investor on scale, you said you would start smaller without applying any strategic lessons from the case.",
      },
      {
        title: "Quality of Case-Based Evidence in Responses",
        score: 1,
        feedback:
          "You provided no specific facts, data points, or evidence from the Nykaa case to support your answers.",
      },
    ],
    partA: [
      {
        title: "Preparation & Understanding",
        score: 2,
        feedback:
          "You engaged with the discussion but showed limited preparation on the case detail.",
      },
      {
        title: "Analytical Contribution",
        score: 1,
        feedback: "Your points stayed general. Aim to analyse rather than describe.",
      },
      {
        title: "Clarity & Structure",
        score: 3,
        feedback:
          "You expressed your ideas clearly, especially later in the discussion.",
      },
      {
        title: "Engagement & Relevance",
        score: 2,
        feedback:
          "You stayed with the discussion but drifted off topic once. Keeping focus will help.",
      },
    ],
    learningProfile: {
      topStrengths: ["Clarity and Structure"],
      growthAreas: ["Preparation and Understanding", "Analytical Contributions"],
      nextLevel: ["Clarity and Structure"],
      centurySkills: "Basic Communication",
    },
    radar: [
      { axis: "Preparation", value: 2 },
      { axis: "Analysis", value: 1.5 },
      { axis: "Relevance", value: 2.5 },
      { axis: "Engagement", value: 2.5 },
      { axis: "Clarity", value: 3.5 },
      { axis: "Frequency", value: 3 },
      { axis: "Professionalism", value: 2.5 },
    ],
    mastery: [
      { band: "Needs Improvement", count: 6 },
      { band: "Developing", count: 6 },
      { band: "Good", count: 1 },
      { band: "Excellent", count: 0 },
    ],
  },
};
