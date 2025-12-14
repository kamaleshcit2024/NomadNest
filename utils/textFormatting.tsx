import React from 'react';

export const formatText = (text: string) => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  let tableBuffer: string[] = [];
  let inTable = false;

  const renderTable = (buffer: string[], keyPrefix: string) => {
    // Basic markdown table parser
    if (buffer.length < 3) return null; // Header, Separator, Body
    
    // Parse rows, handling standard markdown table syntax
    const cleanRows = buffer.map(row => {
       // Remove leading/trailing pipes if they exist, then split
       const content = row.trim().replace(/^\||\|$/g, '');
       return content.split('|').map(c => c.trim());
    });

    const header = cleanRows[0];
    // Skip index 1 (separator line |---|---|)
    const bodyRows = cleanRows.slice(2); 

    return (
      <div key={`${keyPrefix}-table`} className="my-6 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {header.map((h, i) => (
                <th key={i} className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {bodyRows.map((row, rIdx) => (
              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap font-medium">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Table Detection
    if (line.startsWith('|')) {
      inTable = true;
      tableBuffer.push(line);
      
      // If it's the last line, flush
      if (i === lines.length - 1) {
         elements.push(renderTable(tableBuffer, `line-${i}`));
      }
      continue;
    } else if (inTable) {
      // Table ended
      elements.push(renderTable(tableBuffer, `line-${i}`));
      tableBuffer = [];
      inTable = false;
    }

    if (!line) {
        elements.push(<div key={`spacer-${i}`} className="h-4" />);
        continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(<h3 key={`h3-${i}`} className="text-lg font-bold text-slate-800 mt-6 mb-3 flex items-center gap-2">{line.replace('### ', '')}</h3>);
    }
    else if (line.startsWith('## ')) {
      elements.push(<h2 key={`h2-${i}`} className="text-xl font-bold text-indigo-700 mt-8 mb-4 border-b border-indigo-100 pb-2">{line.replace('## ', '')}</h2>);
    }
    else if (line.startsWith('# ')) {
      elements.push(<h1 key={`h1-${i}`} className="text-2xl font-bold text-slate-900 mt-6 mb-4">{line.replace('# ', '')}</h1>);
    }
    // List items
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      const content = line.substring(2);
      const parts = content.split(/(\*\*.*?\*\*)/g);
      elements.push(
        <div key={`list-${i}`} className="flex items-start gap-3 mb-2 ml-1 group">
          <span className="text-indigo-500 mt-1.5 opacity-60 group-hover:opacity-100 transition-opacity">•</span>
          <span className="text-slate-700 leading-relaxed">
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={pIdx} className="text-slate-900 font-semibold">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </span>
        </div>
      );
    }
    // Numbered lists
    else if (/^\d+\./.test(line)) {
       const dotIndex = line.indexOf('.');
       const number = line.substring(0, dotIndex + 1);
       const content = line.substring(dotIndex + 1).trim();
       const parts = content.split(/(\*\*.*?\*\*)/g);
       
       elements.push(
        <div key={`num-${i}`} className="flex items-start gap-3 mb-2 ml-1">
           <span className="text-indigo-600 font-bold min-w-[20px] text-right">{number}</span>
           <span className="text-slate-700 leading-relaxed">
              {parts.map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={pIdx} className="text-slate-900 font-semibold">{part.slice(2, -2)}</strong>;
                }
                return part;
              })}
           </span>
        </div>
       );
    }
    // Standard Paragraph
    else {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        elements.push(
          <p key={`p-${i}`} className="text-slate-600 leading-relaxed mb-2">
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={pIdx} className="text-slate-900 font-semibold">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
    }
  }

  return elements;
};