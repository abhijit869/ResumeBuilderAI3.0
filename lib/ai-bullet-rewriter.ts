export type BulletRewriteTone =
  | 'impact_xyz'
  | 'executive'
  | 'technical'
  | 'concise';

export interface BulletSuggestionItem {
  index: number;
  original: string;
  rewritten: string;
  actionVerb: string;
  improvementNote: string;
}

export interface BulletRewriteResponse {
  ok: boolean;
  aiConfigured: boolean;
  tone: BulletRewriteTone;
  originalBullets: string[];
  bullets: string[];
  bulletComparisons: BulletSuggestionItem[];
  missingInfoQuestions: string[];
}

const WEAK_PREFIX_MAP: Array<{ pattern: RegExp; replacement: string; verb: string }> = [
  {
    pattern: /^(worked on|helped with|assisted in|assisted with)\s+/i,
    replacement: 'Engineered and delivered ',
    verb: 'Engineered',
  },
  {
    pattern: /^(responsible for|in charge of|tasked with)\s+/i,
    replacement: 'Spearheaded and directed ',
    verb: 'Spearheaded',
  },
  {
    pattern: /^(managed|handled|oversaw)\s+/i,
    replacement: 'Orchestrated and scaled ',
    verb: 'Orchestrated',
  },
  {
    pattern: /^(built|made|created|developed)\s+/i,
    replacement: 'Architected and launched ',
    verb: 'Architected',
  },
  {
    pattern: /^(improved|increased|reduced|optimized)\s+/i,
    replacement: 'Accelerated and optimized ',
    verb: 'Accelerated',
  },
  {
    pattern: /^(co-managed|collaborated on|participated in)\s+/i,
    replacement: 'Co-directed and executed ',
    verb: 'Co-directed',
  },
  {
    pattern: /^(wrote|drafted|prepared)\s+/i,
    replacement: 'Authored and standardized ',
    verb: 'Authored',
  },
];

const TONE_VERB_CYCLE: Record<BulletRewriteTone, string[]> = {
  impact_xyz: ['Spearheaded', 'Architected', 'Accelerated', 'Orchestrated', 'Streamlined'],
  executive: ['Directed', 'Chaired', 'Transformed', 'Pioneered', 'Governed'],
  technical: ['Engineered', 'Architected', 'Automated', 'Optimized', 'Deployed'],
  concise: ['Delivered', 'Led', 'Scaled', 'Cut', 'Launched'],
};

const TONE_OUTCOME_SUFFIX: Record<BulletRewriteTone, string[]> = {
  impact_xyz: [
    'driving measurable gains in cross-functional execution velocity and stakeholder alignment',
    'elevating operational reliability and delivery throughput across core milestones',
    'strengthening quality assurance standards and reducing review turnaround cycles',
  ],
  executive: [
    'aligning multi-disciplinary teams around high-priority organizational objectives',
    'establishing scalable governance frameworks across senior leadership stakeholders',
    'delivering sustained strategic impact and operational excellence',
  ],
  technical: [
    'improving system scalability, maintainability, and production resilience',
    'streamlining technical workflows and end-to-end engineering reliability',
    'enabling high-throughput execution with verifiable quality guardrails',
  ],
  concise: [
    'improving team delivery speed and output quality',
    'streamlining execution across key project milestones',
    'strengthening operational accuracy and stakeholder delivery',
  ],
};

/**
 * Transforms raw work experience bullets into professional, impact-oriented bullet points
 * while preserving every factual number, tool, and domain entity from the candidate's input.
 */
export function upgradeBulletsToImpactStyle(
  currentBullets: string[],
  options: {
    roleTitle?: string;
    company?: string;
    tone?: BulletRewriteTone;
    skills?: string[];
  } = {}
): {
  bullets: string[];
  bulletComparisons: BulletSuggestionItem[];
  missingInfoQuestions: string[];
} {
  const tone: BulletRewriteTone = options.tone || 'impact_xyz';
  const role = (options.roleTitle || 'Project Lead').trim();
  const company = (options.company || 'the organization').trim();
  const nonEmpty = (currentBullets || [])
    .map((b) => b.replace(/^[•\-*]\s*/, '').trim())
    .filter(Boolean);

  if (nonEmpty.length === 0) {
    const starterBullets = [
      `Spearheaded core ${role} initiatives at ${company}, establishing structured workflows that improved cross-functional delivery reliability.`,
      `Orchestrated end-to-end project execution and stakeholder reviews, accelerating milestone completion and quality compliance.`,
    ];
    return {
      bullets: starterBullets,
      bulletComparisons: starterBullets.map((b, idx) => ({
        index: idx,
        original: '',
        rewritten: b,
        actionVerb: idx === 0 ? 'Spearheaded' : 'Orchestrated',
        improvementNote: 'Generated impact-oriented starter bullet grounded in role title.',
      })),
      missingInfoQuestions: [
        `What specific metric (% improvement, budget, or team size) did you achieve as ${role} at ${company}?`,
      ],
    };
  }

  const verbs = TONE_VERB_CYCLE[tone] || TONE_VERB_CYCLE.impact_xyz;
  const suffixes = TONE_OUTCOME_SUFFIX[tone] || TONE_OUTCOME_SUFFIX.impact_xyz;
  const missingInfoQuestions: string[] = [];

  const bulletComparisons: BulletSuggestionItem[] = nonEmpty.map((raw, idx) => {
    let text = raw.replace(/\.+$/, '').trim();
    let chosenVerb = verbs[idx % verbs.length];
    let matchedWeak = false;

    for (const rule of WEAK_PREFIX_MAP) {
      if (rule.pattern.test(text)) {
        text = text.replace(rule.pattern, rule.replacement);
        chosenVerb = rule.verb;
        matchedWeak = true;
        break;
      }
    }

    // If bullet starts with a lowercase word or gerund, prepend a strong action verb
    const firstWord = text.split(/\s+/)[0] || '';
    if (!matchedWeak) {
      if (/^[a-z]/.test(firstWord) || /ing$/i.test(firstWord)) {
        const cleanedRest = text.charAt(0).toLowerCase() + text.slice(1);
        text = `${chosenVerb} ${cleanedRest}`;
      } else {
        // Upgrade common leading verbs so the rewrite is visibly more impactful
        const genericVerbMatch = text.match(
          /^(Led|Delivered|Executed|Developed|Created|Supported|Maintained|Coordinated|Streamlined|Spearheaded|Conducted|Authored|Designed|Built|Implemented)\s+(.*)$/i
        );
        if (genericVerbMatch) {
          const currentLead = genericVerbMatch[1];
          const altVerb =
            chosenVerb.toLowerCase() === currentLead.toLowerCase()
              ? verbs[(idx + 1) % verbs.length]
              : chosenVerb;
          chosenVerb = altVerb;
          text = `${altVerb} and scaled ${genericVerbMatch[2]}`;
        } else {
          chosenVerb = firstWord.replace(/[^a-zA-Z-]/g, '') || chosenVerb;
        }
      }
    }

    const hasMetric = /\d+%|\$\d+|\b\d+\b/.test(text);
    const hasOutcomeClause =
      /\b(resulting in|driving|achieving|reducing|increasing|improving|delivering|saving|expanded|by\s+\d+)/i.test(
        text
      );

    if (!hasOutcomeClause) {
      const suffix = suffixes[idx % suffixes.length];
      text = `${text}, ${suffix}.`;
    } else if (text.replace(/\.+$/, '').trim() === raw.replace(/\.+$/, '').trim()) {
      const suffix = suffixes[idx % suffixes.length];
      text = `${text}, ${suffix}.`;
    } else {
      text = `${text}.`;
    }

    if (!hasMetric && missingInfoQuestions.length < 2) {
      missingInfoQuestions.push(
        `Bullet #${idx + 1}: Can you add a concrete metric (e.g., % gain, volume, or time saved) to quantify "${raw.slice(0, 48)}..."?`
      );
    }

    const improvementNote = hasMetric
      ? `Upgraded to ${tone === 'impact_xyz' ? 'Google X-Y-Z impact structure' : `${tone} tone`} with "${chosenVerb}" while preserving verified metrics.`
      : `Strengthened opening action verb ("${chosenVerb}") and added impact-oriented outcome framing.`;

    return {
      index: idx,
      original: raw,
      rewritten: text,
      actionVerb: chosenVerb,
      improvementNote,
    };
  });

  if (missingInfoQuestions.length === 0) {
    missingInfoQuestions.push(
      `Would you like to highlight any additional tools or leadership scope for ${role} at ${company}?`
    );
  }

  return {
    bullets: bulletComparisons.map((c) => c.rewritten),
    bulletComparisons,
    missingInfoQuestions,
  };
}
