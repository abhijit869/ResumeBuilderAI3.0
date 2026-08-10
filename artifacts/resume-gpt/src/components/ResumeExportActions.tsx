import { useEffect, useRef, useState } from 'react';
import { Check, Download, FileImage, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadResumeFile, type ResumeExportFormat } from '@/lib/resume-export';
import type { ResumeData } from '@/store';

export function ResumeExportActions({
  data,
  accent,
  compact = false,
}: {
  data: ResumeData;
  accent?: string;
  compact?: boolean;
}) {
  const [exporting, setExporting] = useState<ResumeExportFormat | null>(null);
  const [downloaded, setDownloaded] = useState<ResumeExportFormat | null>(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const exportFile = async (format: ResumeExportFormat) => {
    setExporting(format);
    setDownloaded(null);
    setError('');
    try {
      await downloadResumeFile(data, format, accent);
      setDownloaded(format);
      window.setTimeout(() => setDownloaded(null), 1800);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The file could not be downloaded.');
    } finally {
      setExporting(null);
    }
  };

  const label = exporting ? 'Preparing…' : downloaded ? 'Downloaded' : 'Download resume';

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="relative" ref={dropdownRef}>
          <Button size={compact ? 'sm' : 'default'} onClick={() => void exportFile('pdf')} className="gap-2 pr-10 shadow-lg shadow-primary/20" disabled={Boolean(exporting)}>
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : downloaded ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
            {label}
          </Button>
          {!exporting && <button type="button" aria-label="Choose download format" onClick={() => setOpen(value => !value)} className="absolute inset-y-0 right-0 w-9 rounded-r-md border-l border-primary-foreground/20 text-primary-foreground/80 hover:bg-black/10">⌄</button>}
          {open && (
            <div className="absolute right-0 top-11 z-50 w-52 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg">
              <button type="button" onClick={() => { setOpen(false); void exportFile('pdf'); }} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"><FileText className="h-4 w-4" /> PDF document <span className="ml-auto text-[10px] text-muted-foreground">.pdf</span></button>
              <button type="button" onClick={() => { setOpen(false); void exportFile('docx'); }} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"><FileText className="h-4 w-4" /> Word document <span className="ml-auto text-[10px] text-muted-foreground">.docx</span></button>
              <button type="button" onClick={() => { setOpen(false); void exportFile('png'); }} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"><FileImage className="h-4 w-4" /> PNG image <span className="ml-auto text-[10px] text-muted-foreground">.png</span></button>
              <button type="button" onClick={() => { setOpen(false); void exportFile('jpg'); }} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"><FileImage className="h-4 w-4" /> JPG image <span className="ml-auto text-[10px] text-muted-foreground">.jpg</span></button>
            </div>
          )}
      </div>
      {error && <p className="max-w-56 text-right text-[11px] text-destructive">{error}</p>}
    </div>
  );
}