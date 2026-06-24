import type { ReportData } from "../../data/reportData";
import { Dial } from "./Dial";
import { SkillSection } from "./SkillSection";
import { LearningProfileBand } from "./LearningProfileBand";
import { RadarChart, MasteryBarChart } from "./charts";
import {
  ChatIcon,
  PenIcon,
  SparklesIcon,
  TargetIcon,
  UsersIcon,
} from "../icons";

// Self-contained report body: moderator feedback, score dials, the two
// per-skill breakdowns, the learning profile, and the two charts. Reused both
// inside the session shell (Screen 6) and on the dashboard (Screen 7), so it is
// not wired to the session chrome.
export function ReportBody({ report }: { report: ReportData }) {
  const { scores } = report;
  return (
    <div className="space-y-10">
      {/* AI Moderator Feedback */}
      <section className="rounded-2xl border border-secondary/15 bg-secondary/5 p-5 sm:p-6">
        <h2 className="flex items-center gap-3 font-heading text-lg font-bold text-secondary">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <ChatIcon className="h-5 w-5" aria-hidden />
          </span>
          AI Moderator Feedback
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground/80">
          {report.feedback}
        </p>
      </section>

      {/* Score dials */}
      <section>
        <h2 className="sr-only">Scores</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Dial
            label="Overall Score"
            percent={scores.overall}
            color="hsl(var(--secondary))"
          />
          <Dial
            label="Case Analysis (60%)"
            percent={scores.caseAnalysis}
            color="hsl(258 78% 60%)"
          />
          <Dial
            label="Participation (40%)"
            percent={scores.participation}
            color="hsl(var(--primary-dark))"
          />
        </div>
      </section>

      <SkillSection
        heading="Part B: Case-Specific Analysis"
        icon={<PenIcon className="h-5 w-5" />}
        skills={report.partB}
      />

      <SkillSection
        heading="Part A: Participation & 21st Century Skills"
        icon={<UsersIcon className="h-5 w-5" />}
        skills={report.partA}
      />

      {/* Learning Profile */}
      <section>
        <h3 className="flex items-center gap-2 font-heading text-xl font-extrabold text-secondary">
          <SparklesIcon className="h-5 w-5 text-primary" aria-hidden />
          Learning Profile
        </h3>
        <div className="mt-5">
          <LearningProfileBand profile={report.learningProfile} />
        </div>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-secondary">
            <TargetIcon className="h-5 w-5 text-primary" aria-hidden />
            Participation Profile
          </h3>
          <div className="mt-4">
            <RadarChart data={report.radar} />
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-secondary">
            <TargetIcon className="h-5 w-5 text-primary" aria-hidden />
            Mastery Profile
          </h3>
          <div className="mt-4">
            <MasteryBarChart data={report.mastery} />
          </div>
        </div>
      </section>
    </div>
  );
}
