// Placeholder reading content for the prototype. The full, final case text is
// owned by the GSL academic team and will be dropped in later. Keyed by case id.

export interface ReadingSection {
  heading: string;
  paragraphs: string[];
}

export interface ReadingContent {
  title: string;
  sections: ReadingSection[];
}

export const readingContent: Record<string, ReadingContent> = {
  "nykaa-story": {
    title: "From Idea to Industry Leader: The Nykaa Story",
    sections: [
      {
        heading: "1. The Storyline",
        paragraphs: [
          "Falguni Nayar, a former investment banker, observed a challenge in the Indian beauty market before launching Nykaa. Customers often struggled to find authentic beauty and wellness products, reliable online sellers were limited, and overall customer experience lacked consistency.",
          "Recognising this gap, Nayar identified an opportunity to build a trustworthy online platform offering genuine, high-quality beauty and wellness products.",
        ],
      },
      {
        heading: "2. The Big Bet",
        paragraphs: [
          "In 2012, Nayar left a senior role in finance to start Nykaa, choosing to enter a market few online players had cracked. Rather than competing on price alone, Nykaa focused on authenticity, curation, and customer trust, and later combined its online store with physical outlets so customers could discover products in person as well.",
        ],
      },
      {
        heading: "3. Over to You",
        paragraphs: [
          "In the discussion that follows, you will be asked to think about the decisions behind Nykaa's rise: the gap Nayar spotted, why customers came to trust the brand, and what made the business hard to copy.",
        ],
      },
    ],
  },
};
