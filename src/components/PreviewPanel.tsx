import React from 'react';

interface PreviewPanelProps {
  title: string;
  content: string | null;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ title, content }) => {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
      <div className="flex-1 bg-white rounded-md shadow-sm p-4 overflow-auto">
        <pre className="font-mono text-sm whitespace-pre-wrap">{content}</pre>
      </div>
    </div>
  );
};