// Course shell content (in-depth course). Separate from the library catalogue:
// this is the chapter / module domain that the course shell renders, and that
// Screen 9 will plug a Case Study module into. Keyed by course id.

export type ModuleType = "read" | "chat" | "assessment" | "case-study";

export interface ReadContent {
  heading: string;
  paragraphs: string[];
}

export interface CourseModule {
  id: string;
  title: string;
  type: ModuleType;
  typeLabel: string;
  /** Initial completion state for the prototype. */
  completed?: boolean;
  read?: ReadContent;
}

export interface Chapter {
  id: string;
  name: string;
  description: string;
  outcomes: string[];
  moduleCount: number;
  locked: boolean;
  /** Chapter contains a case study module somewhere in its order. */
  hasCaseStudy?: boolean;
  /** Full module list (provided for the active chapter). */
  modules?: CourseModule[];
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  blurb: string;
}

export interface Course {
  id: string;
  title: string;
  programme: string;
  description: string;
  audience: string;
  progressPercent: number;
  chapters: Chapter[];
  mentors: Mentor[];
}

const chapterOneModules: CourseModule[] = [
  {
    id: "ch1-overview",
    title: "Chapter Overview",
    type: "read",
    typeLabel: "Read",
    completed: true,
    read: {
      heading: "Who, what, why: an introduction to entrepreneurship",
      paragraphs: [
        "An entrepreneur is someone who spots a problem people face and builds a solution for it, often by starting a business. They take an idea and turn it into something useful, taking on some risk along the way in the hope of creating value.",
        "Entrepreneurship is the process of building that solution: noticing a need, thinking of an idea, testing it, and improving it. It is not only about big companies. A student selling handmade cards, a farmer trying a new crop, and the founder of a large start-up are all being entrepreneurial.",
        "It matters because entrepreneurs help solve real problems, create jobs, and bring new ideas into everyday life. Across India, small businesses and start-ups are a big part of how communities grow and how new opportunities are created.",
        "Entrepreneurs come in many kinds. Some build small local businesses, some grow fast-scaling start-ups, some work for social change, and some bring fresh ideas inside an existing organisation. What they share is a habit of looking for opportunities.",
        "A few key skills show up again and again: curiosity to spot problems, courage to take sensible risks, an understanding of money, and the persistence to keep going when things are hard. These are skills you can practise and grow.",
      ],
    },
  },
  {
    id: "ch1-doubt",
    title: "Doubt Solving Session",
    type: "chat",
    typeLabel: "Chat",
  },
  {
    id: "ch1-assessment",
    title: "Assessment",
    type: "assessment",
    typeLabel: "Assessment",
  },
];

export const entrepreneurshipCourse: Course = {
  id: "entrepreneurship-101",
  title: "Entrepreneurship Level 1",
  programme: "Young Pioneers",
  description:
    "Learn how to spot opportunities, solve problems, and make smart decisions. And walk away knowing how to build a business plan from just an idea!",
  audience: "Ages 12 to 17",
  progressPercent: 5,
  chapters: [
    {
      id: "ch1",
      name: "Who, what why",
      description: "Understand what entrepreneurship is and why it matters.",
      outcomes: [
        "Define an entrepreneur and entrepreneurship",
        "Identify types of entrepreneurs",
        "Understand key skills and importance",
      ],
      moduleCount: 3,
      locked: false,
      modules: chapterOneModules,
    },
    {
      id: "ch2",
      name: "Step by Step",
      description: "Learn how ideas are created, analysed, and planned.",
      outcomes: [
        "Understand idea generation and analysis",
        "Learn goal setting and planning",
        "Understand the basics of a business plan",
      ],
      moduleCount: 4,
      locked: true,
    },
    {
      id: "ch3",
      name: "Problem to Solution",
      description: "Learn how innovation helps solve real-world problems.",
      outcomes: [
        "Develop an innovative thinking process",
        "Understand the relationship between innovation and risk",
        "Recognise entrepreneurs as problem solvers",
      ],
      moduleCount: 4,
      locked: true,
    },
    {
      id: "ch4",
      name: "Pathway to Plan",
      description: "Understand how ideas are shaped into structured plans.",
      outcomes: [
        "Learn how to define and organise ideas",
        "Understand planning frameworks",
        "Build structured approaches to execution",
      ],
      moduleCount: 5,
      locked: true,
      hasCaseStudy: true,
    },
    {
      id: "ch5",
      name: "Money Matters",
      description: "Understand how money works in a business.",
      outcomes: [
        "Learn basic financial concepts",
        "Understand costs, revenue, and profit",
        "Make informed financial decisions",
      ],
      moduleCount: 4,
      locked: true,
    },
    {
      id: "ch6",
      name: "Marketing & Sales",
      description: "Learn how businesses connect ideas to real users.",
      outcomes: [
        "Understand customer needs and markets",
        "Learn how value is created",
        "Explore positioning and differentiation",
      ],
      moduleCount: 5,
      locked: true,
    },
  ],
  mentors: [
    {
      id: "m1",
      name: "Kabir Anand",
      role: "Startup Coach",
      blurb: "Warm and patient, breaks things down so everything starts to make sense.",
    },
    {
      id: "m2",
      name: "Priya Nair",
      role: "Business Coach",
      blurb: "Energetic and curious, nudges you to think a little more deeply.",
    },
  ],
};

export const courses: Record<string, Course> = {
  "entrepreneurship-101": entrepreneurshipCourse,
};
