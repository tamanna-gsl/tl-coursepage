// Scripted stand-in for the live Socratic moderator. The real moderator
// generates this live from the case teaching notes; here it is fixed so the
// prototype can reproduce the discussion experience without a backend.

export interface DiscussionTurn {
  role: "moderator" | "student";
  text: string;
}

export const discussionScripts: Record<string, DiscussionTurn[]> = {
  "nykaa-story": [
    {
      role: "moderator",
      text: "Welcome. Let us talk about Nykaa. To start, what problem did Falguni Nayar notice in the Indian beauty market before she built Nykaa?",
    },
    {
      role: "student",
      text: "Um, people could not find good beauty products online?",
    },
    {
      role: "moderator",
      text: "That is a start. Why do you think that was a problem worth solving? What were customers struggling with specifically?",
    },
    { role: "student", text: "Just tell me why Nykaa succeeded." },
    {
      role: "moderator",
      text: "I will not hand you the answer, but I will help you find it. Think about trust. When you buy something online, what makes you believe it is genuine, and how might that have shaped Nykaa's choices?",
    },
    {
      role: "student",
      text: "Maybe people did not trust random websites, so Nykaa selling only genuine products made them feel safe?",
    },
    {
      role: "moderator",
      text: "Good. Nykaa decided to go big with a wide range and a polished platform from day one. If she had started very small instead, do you think she would have built that same level of trust and authority in the market?",
    },
    { role: "student", text: "No, I do not think so." },
    {
      role: "moderator",
      text: "I think you are right. Going small might have made her look like just another tiny hobby site rather than a serious beauty destination. By launching with a wide selection and a professional platform, she signalled that Nykaa was credible. You have connected the strategy to customer trust well. Let us wrap up there.",
    },
  ],
};

// Shown when the moderator cannot make use of a turn and asks the student to
// rephrase, staying in character (not an error).
export const moderatorFallback =
  "Sorry, I did not quite catch that. Could you say it again in your own words?";
