import type { ReactNode } from "react";
import type { ReportData } from "../../data/reportData";
import {
  TargetIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UsersIcon,
} from "../icons";
import { cn } from "../../lib/cn";

function ProfileCard({
  title,
  icon,
  tint,
  text,
  children,
}: {
  title: string;
  icon: ReactNode;
  tint: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border p-4", tint)}>
      <h4
        className={cn(
          "flex items-center gap-2 text-xs font-bold uppercase tracking-wide",
          text
        )}
      >
        <span aria-hidden>{icon}</span>
        {title}
      </h4>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function BulletList({ items, dot }: { items: string[]; dot: string }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-foreground">
          <span
            className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", dot)}
            aria-hidden
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function LearningProfileBand({
  profile,
}: {
  profile: ReportData["learningProfile"];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <ProfileCard
        title="Top Strengths"
        icon={<TrendingUpIcon className="h-4 w-4" />}
        tint="border-[hsl(142_50%_85%)] bg-[hsl(142_70%_97%)]"
        text="text-[hsl(142_60%_28%)]"
      >
        <BulletList items={profile.topStrengths} dot="bg-[hsl(142_60%_40%)]" />
      </ProfileCard>

      <ProfileCard
        title="Growth Areas"
        icon={<TrendingDownIcon className="h-4 w-4" />}
        tint="border-[hsl(38_80%_82%)] bg-[hsl(38_100%_96%)]"
        text="text-[hsl(32_85%_36%)]"
      >
        <BulletList items={profile.growthAreas} dot="bg-[hsl(38_92%_50%)]" />
      </ProfileCard>

      <ProfileCard
        title="Next Level Opportunities"
        icon={<TargetIcon className="h-4 w-4" />}
        tint="border-secondary/20 bg-secondary/5"
        text="text-secondary"
      >
        <BulletList items={profile.nextLevel} dot="bg-secondary" />
      </ProfileCard>

      <ProfileCard
        title="21st Century Skills"
        icon={<UsersIcon className="h-4 w-4" />}
        tint="border-[hsl(257_70%_88%)] bg-[hsl(257_100%_98%)]"
        text="text-[hsl(257_60%_52%)]"
      >
        <span className="inline-flex rounded-full border border-secondary/20 bg-card px-3 py-1 text-sm font-semibold text-secondary">
          {profile.centurySkills}
        </span>
      </ProfileCard>
    </div>
  );
}
