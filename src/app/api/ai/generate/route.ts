import { NextResponse } from "next/server";

type RoleCategory = "software" | "marketing" | "product" | "design" | "operations";

function cleanText(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  return value.trim().replace(/\s+/g, " ").slice(0, 100) || fallback;
}

function getRoleCategory(jobTitle: string): RoleCategory {
  const title = jobTitle.toLowerCase();

  if (/market|brand|content|growth|seo|social/.test(title)) return "marketing";
  if (/product|owner/.test(title)) return "product";
  if (/design|ux|ui|research/.test(title)) return "design";
  if (/operat|customer success|account|sales|finance|analyst|coordinator/.test(title)) return "operations";
  return "software";
}

function getAchievementBullets(jobTitle: string, category: RoleCategory) {
  const bullets: Record<RoleCategory, string[]> = {
    software: [
      `Built and shipped scalable ${jobTitle.toLowerCase()} solutions with a focus on reliability, maintainability, and user impact.`,
      "Partnered with product, design, and engineering stakeholders to translate requirements into well-tested releases.",
      "Improved delivery workflows by automating repeatable tasks, reducing manual effort and increasing release confidence.",
      "Investigated production issues using data and monitoring signals, then implemented durable performance improvements.",
      "Documented technical decisions and mentored teammates to raise consistency across the development lifecycle.",
    ],
    marketing: [
      `Planned and optimized integrated campaigns as a ${jobTitle}, aligning audience insights, creative, and channel strategy.`,
      "Analyzed campaign performance to identify high-intent segments and reinvest budget in the strongest conversion paths.",
      "Collaborated with sales and creative partners to deliver consistent messaging across the customer journey.",
      "Built reporting that connected campaign activity to pipeline, engagement, and retention outcomes.",
      "Tested new positioning and content formats, documenting learnings for future launches.",
    ],
    product: [
      `Defined priorities as a ${jobTitle} by combining customer research, business goals, and delivery constraints.`,
      "Led cross-functional planning from discovery through launch, keeping teams aligned on outcomes and trade-offs.",
      "Used qualitative feedback and product metrics to validate hypotheses and refine the roadmap.",
      "Wrote clear requirements and acceptance criteria that reduced ambiguity for engineering and design partners.",
      "Measured launch results and translated findings into the next round of product improvements.",
    ],
    design: [
      `Created accessible, user-centered experiences as a ${jobTitle}, balancing customer needs with business priorities.`,
      "Planned research and usability testing to turn observed behavior into practical design decisions.",
      "Partnered with product and engineering teams to move concepts from prototypes to polished, feasible releases.",
      "Maintained consistent interaction patterns and documentation across key user flows.",
      "Used feedback and product data to iterate on designs after launch.",
    ],
    operations: [
      `Coordinated high-priority initiatives as a ${jobTitle}, keeping stakeholders informed and work moving on schedule.`,
      "Improved operational processes by mapping bottlenecks, standardizing handoffs, and tracking clear outcomes.",
      "Built reliable reports and documentation that enabled leaders to make faster, evidence-based decisions.",
      "Collaborated across teams to resolve escalations and improve the customer or internal partner experience.",
      "Identified recurring issues and implemented preventative improvements to strengthen service quality.",
    ],
  };

  return bullets[category];
}

export async function POST(req: Request) {
  try {
    const { type, jobTitle, company } = await req.json();
    const normalizedJobTitle = cleanText(jobTitle, "Professional");
    const normalizedCompany = cleanText(company, "your organization");
    const roleCategory = getRoleCategory(normalizedJobTitle);

    // Built-in intelligent AI suggestions library with realistic, highly tailored industry phrasing
    if (type === "summary") {
      const summaries: Record<string, string[]> = {
        software: [
          "Results-driven Software Engineer with 6+ years of expertise in designing and deploying scalable web architectures, microservices, and high-performance cloud applications. Proven track record of boosting team velocity by 40% and cutting latency by 65%.",
          "Innovative Full-Stack Developer specializing in TypeScript, React, and Node.js. Passionate about writing clean, maintainable code, test automation, and building user-centric interfaces that delight millions of daily active users.",
          "Senior Systems Architect and Engineer with deep proficiency in cloud infrastructure (AWS/GCP), containerization, and distributed databases. Adept at cross-functional leadership and agile development.",
        ],
        marketing: [
          "Strategic Growth Marketing Manager with 7+ years executing data-driven acquisition campaigns across multi-channel funnels. Generated over $12M in pipeline revenue and scaled conversion rates by 85%.",
          "Creative Brand Strategist and Content Lead passionate about storytelling, brand identity, and community engagement. Led end-to-end global campaigns featured in major industry publications.",
        ],
        product: [
          "Data-driven Senior Product Manager with 5+ years driving SaaS product strategy from zero to one. Championed customer discovery, roadmapping, and agile execution to deliver a 25% ARR increase.",
        ],
      };

      const summaryCategory = roleCategory === "design" || roleCategory === "operations"
        ? "software"
        : roleCategory;
      const options = summaries[summaryCategory] || summaries.software;
      const result = options[Math.floor(Math.random() * options.length)];
      return NextResponse.json({ result });
    }

    if (type === "bullets") {
      return NextResponse.json({ result: getAchievementBullets(normalizedJobTitle, roleCategory) });
    }

    if (type === "cover-letter") {
      const comp = normalizedCompany;
      const pos = normalizedJobTitle;
      const text = `I am writing to enthusiastically express my interest in the ${pos} position at ${comp}. With a solid track record of delivering measurable outcomes and driving technical excellence, I am confident in my ability to make an immediate, lasting impact on your team.

Throughout my career, I have consistently focused on solving complex challenges through innovation, collaboration, and high standards of execution. At my previous roles, I spearheaded key initiatives that improved team productivity, reduced delivery bottlenecks, and delightedly engaged customers.

What excites me most about ${comp} is your commitment to pioneering solutions and fostering a culture of excellence. I welcome the opportunity to bring my hands-on expertise and strategic vision to help ${comp} achieve its upcoming milestones.

Thank you for your time and consideration. I look forward to the possibility of discussing how my skills and background align with your goals.`;

      return NextResponse.json({ result: text });
    }

    return NextResponse.json({
      result: "Professional achievement: Successfully delivered high-impact initiatives with cross-functional leadership.",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate AI content" },
      { status: 500 }
    );
  }
}
