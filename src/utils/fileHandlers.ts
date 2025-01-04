export const readFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

export const saveFile = async (content: string, filename: string) => {
  try {
    // Try modern File System Access API first
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'Mermaid Diagram',
            accept: { 'text/plain': ['.mmd'] },
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        return handle.name;
      } catch (err) {
        if (err instanceof Error && err.name === 'SecurityError') {
          // Fall through to legacy method if security error
          console.log('Falling back to legacy save method');
        } else {
          throw err;
        }
      }
    }

    // Legacy fallback method
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return filename;
  } catch (err) {
    if (err instanceof Error && err.name !== 'AbortError') {
      throw new Error('Failed to save file: ' + err.message);
    }
    return null;
  }
};