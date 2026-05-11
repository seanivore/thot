// Thot - File System Operations

export async function openFile(setContentCallback: (content: string) => void): Promise<void> {
  try {
    if ('showOpenFilePicker' in window) {
      // Desktop Chrome/Edge
      const [fileHandle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: 'Text Files',
            accept: {
              'text/plain': ['.txt', '.md', '.markdown'],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      });
      const file = await fileHandle.getFile();
      const content = await file.text();
      setContentCallback(content);

      // Store handle for future saving if needed (out of scope for now to keep simple)
      document.title = file.name;
    } else {
      // Fallback for Safari/iOS
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.md,.txt,.markdown';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setContentCallback(content);
          document.title = file.name;
        };
        reader.readAsText(file);
      };
      input.click();
    }
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      console.error('Error opening file:', err);
    }
  }
}

export async function saveFileAs(content: string, suggestedName: string = 'thots.md'): Promise<void> {
  try {
    if ('showSaveFilePicker' in window) {
      // Desktop Chrome/Edge
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName,
        types: [
          {
            description: 'Markdown File',
            accept: { 'text/markdown': ['.md'] },
          },
        ],
      });
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
      document.title = fileHandle.name;
    } else {
      // Fallback for Safari/iOS
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = suggestedName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
    }
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      console.error('Error saving file:', err);
    }
  }
}

export function newWindow() {
  const url = new URL(window.location.href)
  // Spawn a temporary, isolated scratchpad so it doesn't collide with 'main'
  url.searchParams.set('id', 'temp-' + Math.random().toString(36).substring(2, 8))
  window.open(url.href, '_blank', 'noopener,noreferrer')
}

export async function shareDocument(content: string): Promise<void> {
  if (navigator.share) {
    try {
      // Try to extract a title from the first heading
      const match = content.match(/^#{1,6}\s+(.+)$/m);
      const title = match ? match[1] : 'Thot Note';

      await navigator.share({
        title: title,
        text: content,
      });
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  } else {
    alert('Sharing is not supported on this browser.');
  }
}
