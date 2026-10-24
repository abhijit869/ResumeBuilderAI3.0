'use client';

import React, { useState, useEffect } from 'react';
import {
  INITIAL_RESUMES,
  INITIAL_COVER_LETTERS,
  INITIAL_JOB_APPLICATIONS,
  INITIAL_SHARE_LINKS,
  RESUME_TEMPLATES,
  ResumeDocument,
  CoverLetterDocument,
  JobApplicationItem,
  ShareLinkItem,
  TemplateId,
  applyTemplateTheme,
  cloneResumeDocument,
} from '@/lib/resume-engine';
import {
  subscribeToAuthChanges,
  signOutUser,
  AppUserProfile,
} from '@/lib/auth-service';
import {
  saveResumeToFirestore,
  loadResumesFromFirestore,
  deleteResumeFromFirestore,
  saveCoverLetterToFirestore,
  loadCoverLettersFromFirestore,
  saveJobToFirestore,
  loadJobsFromFirestore,
} from '@/lib/firestore-service';
import { auth } from '@/lib/firebase';
import { LandingView } from './LandingView';
import { AuthModalView } from './AuthModalView';
import { DashboardView, DashboardTab } from './DashboardView';
import { LinkedInImportModal } from './LinkedInImportModal';
import { AtsScoreGeneratorModal } from './AtsScoreGeneratorModal';

interface ResumeBuilderAppProps {
  initialMode?: 'landing' | 'dashboard';
  initialDashboardTab?: DashboardTab;
}

const STORAGE_KEY_RESUMES = 'resumebuilder_ai_3_resumes_v2';
const STORAGE_KEY_COVER_LETTERS = 'resumebuilder_ai_3_cover_letters_v2';
const STORAGE_KEY_JOBS = 'resumebuilder_ai_3_jobs_v2';
const STORAGE_KEY_SHARES = 'resumebuilder_ai_3_shares_v2';
const STORAGE_KEY_THEME = 'resumebuilder_ai_3_theme_v2';

export function ResumeBuilderApp({
  initialMode = 'landing',
  initialDashboardTab = 'overview',
}: ResumeBuilderAppProps) {
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>(initialMode);
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>(
    initialDashboardTab
  );
  const [uiTheme, setUiTheme] = useState<'light' | 'dark'>('light');

  // Authentication State (Closed Loophole: starts null, requires sign in/up)
  const [user, setUser] = useState<AppUserProfile | null>(null);
  const [authModal, setAuthModal] = useState<{
    open: boolean;
    mode: 'login' | 'signup';
    notice?: string;
  }>({ open: false, mode: 'login' });

  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [atsModal, setAtsModal] = useState<{
    open: boolean;
    initialJdText?: string;
  }>({ open: false });

  // Dedicated fictional Demo Showcase Resume strictly for the public Landing / Demonstration page
  const [demoPersonaIdx, setDemoPersonaIdx] = useState<number>(0);
  const [demoHeroResume, setDemoHeroResume] = useState<ResumeDocument>(
    INITIAL_RESUMES[0]
  );

  // Authenticated Workspace Resumes (isolated from public demo page)
  const [resumes, setResumes] = useState<ResumeDocument[]>(INITIAL_RESUMES);
  const [activeResumeId, setActiveResumeId] = useState<string>(
    INITIAL_RESUMES[0].id
  );
  const [coverLetters, setCoverLetters] = useState<CoverLetterDocument[]>(
    INITIAL_COVER_LETTERS
  );
  const [jobApplications, setJobApplications] = useState<JobApplicationItem[]>(
    INITIAL_JOB_APPLICATIONS
  );
  const [shareLinks, setShareLinks] = useState<ShareLinkItem[]>(
    INITIAL_SHARE_LINKS
  );

  // Subscribe to Firebase Auth changes + Firestore synchronization
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        if (viewMode === 'dashboard') {
          setViewMode('landing');
        }
        // Reset workspace state to fictional defaults when logged out
        setResumes(INITIAL_RESUMES);
        setActiveResumeId(INITIAL_RESUMES[0].id);
        setCoverLetters(INITIAL_COVER_LETTERS);
        setJobApplications(INITIAL_JOB_APPLICATIONS);
        setShareLinks(INITIAL_SHARE_LINKS);
        return;
      }
      if (!currentUser.isAnonymous) {
        try {
          const userStorageKey = `${STORAGE_KEY_RESUMES}_${currentUser.uid}`;
          const savedUserResumes = localStorage.getItem(userStorageKey);
          if (savedUserResumes) {
            const parsed = JSON.parse(savedUserResumes);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setResumes(parsed);
              setActiveResumeId(parsed[0].id);
            }
          }

          const cloudResumes = await loadResumesFromFirestore(currentUser.uid);
          if (cloudResumes && cloudResumes.length > 0) {
            setResumes(cloudResumes);
            setActiveResumeId(cloudResumes[0].id);
          } else {
            // First-time sign-in: seed personalized starter resume in Firestore
            const starterDoc: ResumeDocument = {
              ...INITIAL_RESUMES[0],
              id: `resume-${Date.now()}`,
              userId: currentUser.uid,
              ownerEmail: currentUser.email,
              title: `${currentUser.displayName} — Career Resume`,
              personalInfo: {
                ...INITIAL_RESUMES[0].personalInfo,
                fullName:
                  currentUser.displayName ||
                  INITIAL_RESUMES[0].personalInfo.fullName,
                email:
                  currentUser.email || INITIAL_RESUMES[0].personalInfo.email,
              },
            };
            setResumes([starterDoc]);
            setActiveResumeId(starterDoc.id);
            saveResumeToFirestore(currentUser.uid, starterDoc);
          }
          const cloudCls = await loadCoverLettersFromFirestore(currentUser.uid);
          if (cloudCls && cloudCls.length > 0) {
            setCoverLetters(cloudCls);
          }
          const cloudJobs = await loadJobsFromFirestore(currentUser.uid);
          if (cloudJobs && cloudJobs.length > 0) {
            setJobApplications(cloudJobs);
          }
        } catch (err) {
          console.warn('Firestore database sync notice:', err);
        }
      }
    });
    return () => unsubscribe();
  }, [viewMode]);

  // Purge legacy unscoped localStorage keys & hydrate UI theme + URL query gates
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // Purge unscoped keys so logged-out demonstration page never leaks previous user data
        localStorage.removeItem(STORAGE_KEY_RESUMES);
        localStorage.removeItem(STORAGE_KEY_COVER_LETTERS);
        localStorage.removeItem(STORAGE_KEY_JOBS);
        localStorage.removeItem(STORAGE_KEY_SHARES);

        const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
        if (savedTheme === 'dark' || savedTheme === 'light') {
          setUiTheme(savedTheme);
        }
      } catch {
        // Ignore storage errors
      }

      // Security Gate for URL Navigation / Parameters
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const requestsProtectedView =
          params.get('autostart') === '1' ||
          params.get('view') === 'dashboard' ||
          Boolean(params.get('tab'));

        if (requestsProtectedView) {
          if (!auth.currentUser) {
            // Block unauthenticated access to dashboard via URL manipulation
            setViewMode('landing');
            setAuthModal({
              open: true,
              mode: 'login',
              notice:
                'Authentication required. Please log in or create an account to access the workspace.',
            });
          } else {
            setViewMode('dashboard');
            const tabParam = params.get('tab') as DashboardTab | null;
            if (tabParam) {
              setDashboardTab(tabParam);
            }
          }
        }

        if (params.get('linkedin') === '1') {
          if (!auth.currentUser) {
            setAuthModal({
              open: true,
              mode: 'login',
              notice: 'Please log in to import your LinkedIn profile.',
            });
          } else {
            setShowLinkedInModal(true);
          }
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleToggleUiTheme = () => {
    const next = uiTheme === 'light' ? 'dark' : 'light';
    setUiTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY_THEME, next);
    } catch {
      // Ignore
    }
  };

  const persistResumes = (next: ResumeDocument[]) => {
    setResumes(next);
    if (user && !user.isAnonymous) {
      try {
        localStorage.setItem(
          `${STORAGE_KEY_RESUMES}_${user.uid}`,
          JSON.stringify(next)
        );
      } catch {
        // Ignore
      }
      next.forEach((item) => {
        saveResumeToFirestore(user.uid, item);
      });
    }
  };

  const persistCoverLetters = (next: CoverLetterDocument[]) => {
    setCoverLetters(next);
    if (user && !user.isAnonymous) {
      try {
        localStorage.setItem(
          `${STORAGE_KEY_COVER_LETTERS}_${user.uid}`,
          JSON.stringify(next)
        );
      } catch {
        // Ignore
      }
      next.forEach((item) => {
        saveCoverLetterToFirestore(user.uid, item);
      });
    }
  };

  const persistJobs = (next: JobApplicationItem[]) => {
    setJobApplications(next);
    if (user && !user.isAnonymous) {
      try {
        localStorage.setItem(
          `${STORAGE_KEY_JOBS}_${user.uid}`,
          JSON.stringify(next)
        );
      } catch {
        // Ignore
      }
      next.forEach((item) => {
        saveJobToFirestore(user.uid, item);
      });
    }
  };

  const persistShares = (next: ShareLinkItem[]) => {
    setShareLinks(next);
    if (user && !user.isAnonymous) {
      try {
        localStorage.setItem(
          `${STORAGE_KEY_SHARES}_${user.uid}`,
          JSON.stringify(next)
        );
      } catch {
        // Ignore
      }
    }
  };

  const activeResume =
    resumes.find((r) => r.id === activeResumeId) ||
    resumes[0] ||
    INITIAL_RESUMES[0];

  const handleUpdateHeroResume = (
    updates: Partial<
      Pick<
        ResumeDocument,
        'themeColor' | 'fontFamily' | 'templateId' | 'fontSize' | 'pageSize'
      >
    >
  ) => {
    setDemoHeroResume((prev) => applyTemplateTheme(prev, updates));
  };

  const handleShuffleDemoPersona = () => {
    const nextIdx = (demoPersonaIdx + 1) % INITIAL_RESUMES.length;
    setDemoPersonaIdx(nextIdx);
    const nextSample = INITIAL_RESUMES[nextIdx];
    setDemoHeroResume((prev) => ({
      ...nextSample,
      themeColor: prev.themeColor,
      fontFamily: prev.fontFamily,
      templateId: prev.templateId,
      fontSize: prev.fontSize,
      pageSize: prev.pageSize,
    }));
  };

  const handleUpdateResume = (updated: ResumeDocument) => {
    const nextList = resumes.map((r) => (r.id === updated.id ? updated : r));
    persistResumes(nextList);
  };

  const handleCreateResume = (newDoc: ResumeDocument) => {
    const nextList = [newDoc, ...resumes];
    persistResumes(nextList);
    setActiveResumeId(newDoc.id);
  };

  const handleDeleteResume = (id: string) => {
    if (resumes.length <= 1) return;
    const nextList = resumes.filter((r) => r.id !== id);
    persistResumes(nextList);
    if (activeResumeId === id && nextList.length > 0) {
      setActiveResumeId(nextList[0].id);
    }
    if (user && !user.isAnonymous) {
      deleteResumeFromFirestore(user.uid, id);
    }
  };

  // Guarded actions: require authenticated user (no anonymous bypass)
  const handleProtectedAction = (
    action: () => void,
    reason = 'Please log in or create an account to access this feature.'
  ) => {
    if (!user || user.isAnonymous) {
      setAuthModal({ open: true, mode: 'login', notice: reason });
      return;
    }
    action();
  };

  const handleCreateWithTemplate = (templateId: TemplateId) => {
    handleProtectedAction(() => {
      const tplMeta = RESUME_TEMPLATES.find((t) => t.id === templateId);
      const base = resumes.find((r) => r.id === activeResumeId) || resumes[0];
      const cloned = cloneResumeDocument(
        base,
        `${base.personalInfo.fullName} — ${tplMeta?.name || templateId}`
      );
      const styled = applyTemplateTheme(cloned, { templateId });
      handleCreateResume(styled);
      setDashboardTab('editor');
      setViewMode('dashboard');
    }, 'Please log in or sign up to create a resume with this template.');
  };

  const handleOpenLinkedInImport = () => {
    handleProtectedAction(() => {
      setShowLinkedInModal(true);
    }, 'Please log in or sign up to import and parse LinkedIn profiles.');
  };

  const handleOpenDashboard = (tab: DashboardTab = 'overview') => {
    handleProtectedAction(() => {
      setDashboardTab(tab);
      setViewMode('dashboard');
    }, 'Authentication required. Please log in or sign up to enter your workspace.');
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem(STORAGE_KEY_RESUMES);
      localStorage.removeItem(STORAGE_KEY_COVER_LETTERS);
      localStorage.removeItem(STORAGE_KEY_JOBS);
      localStorage.removeItem(STORAGE_KEY_SHARES);
      await signOutUser();
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    setUser(null);
    setViewMode('landing');
    setResumes(INITIAL_RESUMES);
    setActiveResumeId(INITIAL_RESUMES[0].id);
    setCoverLetters(INITIAL_COVER_LETTERS);
    setJobApplications(INITIAL_JOB_APPLICATIONS);
    setShareLinks(INITIAL_SHARE_LINKS);
  };

  const handleDeleteAllUserData = () => {
    if (
      confirm(
        'Are you sure you want to delete all stored resumes and profile data? This action cannot be undone.'
      )
    ) {
      try {
        localStorage.removeItem(STORAGE_KEY_RESUMES);
        localStorage.removeItem(STORAGE_KEY_COVER_LETTERS);
        localStorage.removeItem(STORAGE_KEY_JOBS);
        localStorage.removeItem(STORAGE_KEY_SHARES);
        if (user) {
          localStorage.removeItem(`${STORAGE_KEY_RESUMES}_${user.uid}`);
          localStorage.removeItem(`${STORAGE_KEY_COVER_LETTERS}_${user.uid}`);
          localStorage.removeItem(`${STORAGE_KEY_JOBS}_${user.uid}`);
          localStorage.removeItem(`${STORAGE_KEY_SHARES}_${user.uid}`);
        }
      } catch {
        // ignore
      }
      setResumes(INITIAL_RESUMES);
      setCoverLetters(INITIAL_COVER_LETTERS);
      setJobApplications(INITIAL_JOB_APPLICATIONS);
      setShareLinks(INITIAL_SHARE_LINKS);
      setActiveResumeId(INITIAL_RESUMES[0].id);
      setViewMode('landing');
    }
  };

  const handleDeleteImportedData = () => {
    if (
      confirm(
        'Delete imported LinkedIn profile data and restore default starter profile?'
      )
    ) {
      setResumes(INITIAL_RESUMES);
      setActiveResumeId(INITIAL_RESUMES[0].id);
      setShowLinkedInModal(false);
    }
  };

  const handleOpenAtsScoreGenerator = (customJd?: string) => {
    setAtsModal({
      open: true,
      initialJdText: customJd,
    });
  };

  // Closed Loophole: Dashboard is strictly rendered ONLY if user is authenticated and not anonymous
  const isDashboardViewActive =
    viewMode === 'dashboard' && user !== null && !user.isAnonymous;

  return (
    <>
      {!isDashboardViewActive ? (
        <LandingView
          heroResume={demoHeroResume}
          uiTheme={uiTheme}
          onToggleUiTheme={handleToggleUiTheme}
          onUpdateHeroResume={handleUpdateHeroResume}
          onShuffleDemoPersona={handleShuffleDemoPersona}
          onOpenDashboard={handleOpenDashboard}
          onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
          onOpenLinkedInImport={handleOpenLinkedInImport}
          onOpenAtsScoreGenerator={() => handleOpenAtsScoreGenerator()}
          onCreateWithTemplate={handleCreateWithTemplate}
          user={user}
          onSignOut={handleSignOut}
        />
      ) : (
        <DashboardView
          user={{
            name: user.displayName,
            email: user.email,
            plan: user.plan,
          }}
          uiTheme={uiTheme}
          onToggleUiTheme={handleToggleUiTheme}
          activeTab={dashboardTab}
          onChangeTab={(tab) => setDashboardTab(tab)}
          resumes={resumes}
          activeResumeId={activeResumeId}
          onSelectResume={(id) => setActiveResumeId(id)}
          onUpdateResume={handleUpdateResume}
          onCreateResume={handleCreateResume}
          onDeleteResume={handleDeleteResume}
          coverLetters={coverLetters}
          onCreateCoverLetter={(cl) =>
            persistCoverLetters([cl, ...coverLetters])
          }
          onDeleteCoverLetter={(id) =>
            persistCoverLetters(coverLetters.filter((c) => c.id !== id))
          }
          jobApplications={jobApplications}
          onUpdateJobApplications={persistJobs}
          shareLinks={shareLinks}
          onUpdateShareLinks={persistShares}
          onOpenLinkedInImport={handleOpenLinkedInImport}
          onOpenAtsScoreGenerator={handleOpenAtsScoreGenerator}
          onDeleteAllUserData={handleDeleteAllUserData}
          onSignOut={handleSignOut}
          onBackToLanding={() => setViewMode('landing')}
        />
      )}

      {/* Secure Authentication Modal */}
      {authModal.open && (
        <AuthModalView
          initialMode={authModal.mode}
          securityNotice={authModal.notice}
          onAuthenticated={(authUser) => {
            setUser(authUser);
            setAuthModal({ open: false, mode: 'login' });
            setDashboardTab('overview');
            setViewMode('dashboard');
          }}
          onOpenLinkedInImport={handleOpenLinkedInImport}
          onClose={() => setAuthModal({ open: false, mode: 'login' })}
          allowClose={true}
        />
      )}

      {/* LinkedIn Import Modal (Only accessible when logged in) */}
      {showLinkedInModal && user && (
        <LinkedInImportModal
          existingResume={activeResume}
          onImportComplete={(importedDoc, mode) => {
            if (mode === 'replace') {
              handleUpdateResume(importedDoc);
              setActiveResumeId(importedDoc.id);
            } else {
              handleCreateResume(importedDoc);
            }
            setShowLinkedInModal(false);
            setDashboardTab('editor');
            setViewMode('dashboard');
          }}
          onDeleteImportedData={handleDeleteImportedData}
          onClose={() => setShowLinkedInModal(false)}
        />
      )}

      {/* ATS Score Generator & Match Optimizer Modal */}
      {atsModal.open && (
        <AtsScoreGeneratorModal
          open={atsModal.open}
          onClose={() => setAtsModal({ open: false })}
          resumes={resumes}
          activeResumeId={activeResumeId}
          onSelectResumeId={(id) => setActiveResumeId(id)}
          onUpdateResume={handleUpdateResume}
          initialJdText={atsModal.initialJdText}
          onOpenEditorTab={() => {
            setAtsModal({ open: false });
            setDashboardTab('editor');
            setViewMode('dashboard');
          }}
        />
      )}
    </>
  );
}
