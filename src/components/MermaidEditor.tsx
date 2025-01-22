import React, { useState, useEffect, useCallback } from 'react';
import { Save, Upload, RefreshCw } from 'lucide-react';
import mermaid from 'mermaid';
import { readFile, saveFile } from '../utils/fileHandlers';
import { getErrorMessage } from '../utils/errorHandlers';
import { processDiagramContent, detectDiagramType } from '../utils/fileConverters';
import { PreviewPanel } from './PreviewPanel';

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
});

const DEFAULT_DIAGRAM = `gantt
    title A Sample Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2024-01-01, 30d
    Another task     :after a1, 20d
    section Another
    Task in sec      :2024-01-12, 12d
    another task     :24d`;

export const MermaidEditor: React.FC = () => {
  const [code, setCode] = useState(DEFAULT_DIAGRAM);
  const [error, setError] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>('.mmd');
  const [convertedCode, setConvertedCode] = useState<string | null>(null);
  const [isReverse, setIsReverse] = useState(false);

  const renderDiagram = useCallback(async () => {
    try {
      const processedCode = processDiagramContent(code, isReverse);
      setConvertedCode(fileType === '.dot' ? processedCode : null);
      const { svg } = await mermaid.render('mermaid-diagram', processedCode);
      const container = document.getElementById('diagram-container');
      if (container) {
        container.innerHTML = svg;
      }
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [code, fileType, isReverse]);

  useEffect(() => {
    renderDiagram();
  }, [renderDiagram]);

  const handleCodeChange = (newCode: string) => {
    try {
      setCode(newCode);
      const detectedType = detectDiagramType(newCode);
      setFileType(detectedType);
    } catch (err) {
      console.warn('Could not detect diagram type:', err);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const content = await readFile(file);
        setCode(content);
        try {
          const detectedType = detectDiagramType(content);
          setFileType(detectedType);
        } catch {
          const extension = file.name.toLowerCase().endsWith('.dot') ? '.dot' : '.mmd';
          setFileType(extension);
        }
        setFilePath(file.name);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    }
  };

  const handleSave = async () => {
    try {
      const savedFileName = await saveFile(code, filePath || `diagram${fileType}`);
      if (savedFileName) {
        setFilePath(savedFileName);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-700">Diagram Editor</h2>
          <div className="flex space-x-2">
            <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Load File
              <input
                type="file"
                accept=".mmd,.dot,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
            <button
              onClick={renderDiagram}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
        {filePath && (
          <p className="text-sm text-gray-600 mt-2">Current file: {filePath}</p>
        )}
      </div>

      <div className="flex-1 p-4 flex flex-col space-y-4">
        {fileType === '.dot' && (
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="reverse"
              checked={isReverse}
              onChange={(e) => setIsReverse(e.target.checked)}
            />
            <label htmlFor="reverse">Reverse Graph</label>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 flex-1">
          <textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="h-full p-4 font-mono text-sm bg-white border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your diagram code here..."
          />
          {fileType === '.dot' ? (
            <PreviewPanel 
              title="Converted Mermaid Code" 
              content={convertedCode} 
            />
          ) : (
            <div className="h-full bg-gray-50 rounded-md flex items-center justify-center text-gray-500">
              Enter DOT syntax to see the converted Mermaid code
            </div>
          )}
        </div>
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="w-full">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Preview</h2>
          <div
            id="diagram-container"
            className="w-full bg-white rounded-md shadow-sm p-4 min-h-[400px] flex items-center justify-center"
          />
        </div>
      </div>
    </div>
  );
};