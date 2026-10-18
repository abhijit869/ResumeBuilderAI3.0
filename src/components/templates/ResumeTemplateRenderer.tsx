import React from 'react';
import { ResumeData } from '@/types/resume';
import { HothTemplate } from './HothTemplate';
import { BasicTemplate } from './BasicTemplate';
import { EuropeTemplate } from './EuropeTemplate';
import { VeganTemplate } from './VeganTemplate';
import { ModernTemplate } from './ModernTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { TechTemplate } from './TechTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { ProfessionalTemplate } from './ProfessionalTemplate';

interface ResumeTemplateRendererProps {
  data: ResumeData;
  className?: string;
}

export const ResumeTemplateRenderer: React.FC<ResumeTemplateRendererProps> = ({ data, className = '' }) => {
  const templateId = (data.templateId || 'hoth').toLowerCase();

  const renderTemplate = () => {
    switch (templateId) {
      case 'hoth':
        return <HothTemplate data={data} />;
      case 'basic':
        return <BasicTemplate data={data} />;
      case 'europe':
        return <EuropeTemplate data={data} />;
      case 'vegan':
        return <VeganTemplate data={data} />;
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
      case 'executive':
        return <ExecutiveTemplate data={data} />;
      case 'tech':
        return <TechTemplate data={data} />;
      case 'minimal':
        return <MinimalTemplate data={data} />;
      case 'professional':
        return <ProfessionalTemplate data={data} />;
      default:
        return <HothTemplate data={data} />;
    }
  };

  return (
    <div className={`resume-renderer-wrapper ${className}`}>
      {renderTemplate()}
    </div>
  );
};
