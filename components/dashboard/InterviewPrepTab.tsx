'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Copy,
  Check,
  Send,
  Building,
  Target,
} from 'lucide-react';
import { ResumeDocument } from '@/lib/resume-engine';

interface InterviewPrepTabProps {
  activeResume: ResumeDocument;
  isDark?: boolean;
}

interface QuestionItem {
  id: string;
  category: 'Behavioral (STAR)' | 'Technical Leadership' | 'System Architecture' | 'Reverse Questions';
  question: string;
  starBreakdown: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  sampleAnswer: string;
  tips: string;
}

const DEFAULT_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-1',
    category: 'Behavioral (STAR)',
    question: 'Describe a high-stakes project where you had to balance urgent product delivery with technical debt.',
    starBreakdown: {
      situation: 'Our core processing pipeline was struggling under 300% surge during peak quarter traffic.',
      task: 'Deliver a major client-facing feature deadline while simultaneously preventing memory leaks and downtime.',
      action: 'Decomposed the monolith endpoint into an asynchronous job queue with Redis buffering and circuit breakers.',
      result: 'Achieved zero outages during peak load, reduced p99 latency by 42%, and delivered the product release on schedule.',
    },
    sampleAnswer: 'In my role at my previous company, our payment processing service encountered a 300% surge in throughput just as we committed to shipping a new multi-currency checkout feature. I led the technical triage, introduced Redis-backed job throttling to absorb traffic spikes without degrading DB pools, and isolated non-critical telemetry. This allowed us to meet the commercial launch date while decreasing p99 latency by 42%.',
    tips: 'Always quantify your result with percentages, latency drops, or dollar revenue. Avoid saying "we did", highlight your specific ownership.',
  },
  {
    id: 'q-2',
    category: 'Technical Leadership',
    question: 'How do you mentor junior engineers and align cross-functional engineering teams on standard architectural practices?',
    starBreakdown: {
      situation: 'Multiple teams were building conflicting microservice API schemas and inconsistent authentication schemes.',
      task: 'Standardize API design, improve engineering velocity, and coach junior team members.',
      action: 'Authored an engineering RFC framework, instituted bi-weekly architecture reviews, and ran weekly 1:1 pair programming sessions.',
      result: 'Accelerated cross-team deployment cycles by 35% and mentored two junior developers to mid-level promotions.',
    },
    sampleAnswer: 'I believe architectural excellence begins with psychological safety and transparent documentation. When our engineering organization scaled to multiple distributed pods, schema drift caused cross-team integration bugs. I instituted lightweight RFCs, ran hands-on pair debugging sessions, and established clear linting and contract testing in CI. This raised code review velocity by 35% and empowered junior engineers to propose RFCs independently.',
    tips: 'Focus on how you empower others rather than top-down directives.',
  },
  {
    id: 'q-3',
    category: 'System Architecture',
    question: 'How do you design for resilience, zero-trust security, and horizontal scalability in modern cloud SaaS applications?',
    starBreakdown: {
      situation: 'A legacy monolithic backend suffered single-point-of-failure vulnerabilities and slow geographic latency.',
      task: 'Design a globally distributed, fault-tolerant edge architecture adhering to SOC2 and OWASP standards.',
      action: 'Migrated stateless services to containerized edge runtimes, introduced token-based JWT rotation with KMS, and implemented partitioned database replicas.',
      result: 'Reduced global latency to under 80ms worldwide and passed compliance audits with zero findings.',
    },
    sampleAnswer: 'My architectural philosophy centers on defense-in-depth and stateless horizontal scaling. By pairing an edge proxy layer with zero-trust mTLS service-to-service communication, partitioned read replicas, and rigorous rate-limiting, we isolate blast radiuses. Every external boundary performs cryptographic validation, and persistent queues guarantee eventual consistency without blocking client threads.',
    tips: 'Mention tradeoffs! Interviewers love to hear why you chose one approach over another (e.g. consistency vs availability).',
  },
  {
    id: 'q-4',
    category: 'Reverse Questions',
    question: 'Smart questions you can ask the interviewer to demonstrate strategic insight and senior acumen.',
    starBreakdown: {
      situation: 'End of interview when asked "Do you have any questions for us?"',
      task: 'Assess team health, engineering culture, and strategic priorities.',
      action: 'Ask insightful questions focused on product trajectory and team friction points.',
      result: 'Leaves a lasting impression as a proactive, high-caliber candidate.',
    },
    sampleAnswer: '1. "What is the single biggest technical bottleneck preventing the engineering team from shipping twice as fast today?"\n2. "How does engineering leadership prioritize technical debt versus commercial feature requests during quarterly roadmapping?"\n3. "What does success look like in this role at the 90-day and 1-year milestones?"',
    tips: 'Never say you have no questions. Asking about team velocity or technical debt immediately positions you as a thoughtful senior contributor.',
  },
];

export function InterviewPrepTab({ activeResume, isDark }: InterviewPrepTabProps) {
  const [targetCompany, setTargetCompany] = useState('Google');
  const [targetRole, setTargetRole] = useState(activeResume.personalInfo.jobTitle || 'Senior Software Engineer');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string>('q-1');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // User practice notes
  const [practiceNotes, setPracticeNotes] = useState<{ [id: string]: string }>({});

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredQuestions = DEFAULT_QUESTIONS.filter((q) => {
    if (selectedCategory === 'All') return true;
    return q.category === selectedCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header bar */}
      <div
        className={`p-6 rounded-3xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        }`}
      >
        <div>
          <div className="text-xs font-mono font-bold text-[#FF5A4E] uppercase tracking-wider">
            ResumeBuilderAi 3.0 · STAR Method Studio
          </div>
          <h1
            className={`font-serif text-2xl sm:text-3xl mt-1 tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Interview Preparation & STAR Answers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Grounded behavioral responses, architectural deep-dives, and reverse questions tailored to your experience.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-[#FF5A4E]" />
            <span>Target: {targetRole}</span>
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-2">
        {['All', 'Behavioral (STAR)', 'Technical Leadership', 'System Architecture', 'Reverse Questions'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              selectedCategory === cat
                ? 'bg-[#FF5A4E] text-white'
                : isDark
                ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-3xl border transition overflow-hidden shadow-xs ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
              }`}
            >
              {/* Question Header */}
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? '' : item.id)}
                className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 transition hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FF5A4E]/10 text-[#FF5A4E]">
                      {item.category}
                    </span>
                  </div>
                  <h3
                    className={`font-serif text-base sm:text-lg font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {item.question}
                  </h3>
                </div>

                <div className="p-1 rounded-xl text-slate-400">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>

              {/* Collapsible Content */}
              {isExpanded && (
                <div
                  className={`p-5 sm:p-6 border-t space-y-6 ${
                    isDark ? 'border-slate-800 bg-slate-950/30' : 'border-slate-100 bg-slate-50/40'
                  }`}
                >
                  {/* STAR Breakdown Grid */}
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                      STAR Method Framework Breakdown
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div
                        className={`p-3.5 rounded-2xl border ${
                          isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="text-[10px] font-mono font-bold text-blue-500 uppercase">
                          [S] Situation
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {item.starBreakdown.situation}
                        </p>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl border ${
                          isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="text-[10px] font-mono font-bold text-amber-500 uppercase">
                          [T] Task
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {item.starBreakdown.task}
                        </p>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl border ${
                          isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="text-[10px] font-mono font-bold text-emerald-500 uppercase">
                          [A] Action
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {item.starBreakdown.action}
                        </p>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl border ${
                          isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="text-[10px] font-mono font-bold text-[#FF5A4E] uppercase">
                          [R] Result
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {item.starBreakdown.result}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sample Grounded Answer */}
                  <div
                    className={`p-5 rounded-2xl border ${
                      isDark ? 'bg-slate-850 border-slate-700' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white inline-flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#FF5A4E]" />
                        <span>Recommended Verbatim Delivery</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.id, item.sampleAnswer)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 inline-flex items-center gap-1"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Answer</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                      {item.sampleAnswer}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl">
                      <strong>Executive Tip:</strong> {item.tips}
                    </div>
                  </div>

                  {/* Your Personal Practice Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Your Personal Practice Notes (Saved in Session)
                    </label>
                    <textarea
                      value={practiceNotes[item.id] || ''}
                      onChange={(e) =>
                        setPracticeNotes({ ...practiceNotes, [item.id]: e.target.value })
                      }
                      placeholder="Outline your personal project name, metrics, or talking points for this question..."
                      rows={3}
                      className={`w-full p-3.5 rounded-xl border text-xs focus:outline-none focus:border-[#FF5A4E] ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
