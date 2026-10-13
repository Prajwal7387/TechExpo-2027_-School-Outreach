import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Download, AlertTriangle } from 'lucide-react';

export const CsvImportModal = ({ isOpen, onClose }) => {
  const { importSchoolsFromCsv, addToast } = useApp();
  const [csvData, setCsvData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [parseError, setParseError] = useState('');

  if (!isOpen) return null;

  const downloadSampleTemplate = () => {
    const csvContent =
      'name,city,board,student_strength,principal_name,principal_phone,principal_email,coordinator_name,coordinator_phone,coordinator_email,categories,outreach_status\n' +
      '"Adani Vidya Mandir","Ahmedabad","CBSE",1100,"Dr. Sharmila Patel","+91 79 2555 1234","principal@avm.edu","Kunal Shah","+91 98980 12345","kunal@avm.edu","Technology-Ready;Locally Famous","Not Contacted"\n' +
      '"Bright Day School","Vadodara","GSEB",1500,"Mr. Alok Trivedi","+91 265 244 5678","alok@bds.org","Neeraj Joshi","+91 97234 56789","neeraj@bds.org","Good to Connect With;Recent Events","Contacted"';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'techexpo_schools_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setParseError('');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          setParseError('The uploaded CSV file is empty or missing data rows.');
          return;
        }

        // Parse headers
        const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
        const rows = [];

        for (let i = 1; i < lines.length; i++) {
          // Simple CSV line parser handling quotes
          const rawLine = lines[i];
          const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
          const matches = [];
          let match;
          while ((match = regex.exec(rawLine)) !== null) {
            if (match.index === regex.lastIndex) regex.lastIndex++;
            if (match[1] !== undefined) {
              matches.push(match[1].replace(/^"|"$/g, '').replace(/""/g, '"').trim());
            }
          }

          if (matches.length > 0) {
            const rowObj = {};
            headers.forEach((h, idx) => {
              rowObj[h] = matches[idx] || '';
            });

            if (rowObj.name) {
              const cats = rowObj.categories
                ? rowObj.categories.split(/[;,]/).map((c) => c.trim()).filter(Boolean)
                : ['Good to Connect With'];

              rows.push({
                name: rowObj.name,
                city: rowObj.city || 'Ahmedabad',
                board: rowObj.board || 'CBSE',
                student_strength: Number(rowObj.student_strength) || 800,
                principal_name: rowObj.principal_name || 'School Principal',
                principal_phone: rowObj.principal_phone || '',
                principal_email: rowObj.principal_email || '',
                coordinator_name: rowObj.coordinator_name || 'Science Incharge',
                coordinator_phone: rowObj.coordinator_phone || '',
                coordinator_email: rowObj.coordinator_email || '',
                categories: cats,
                outreach_status: rowObj.outreach_status || 'Not Contacted',
              });
            }
          }
        }

        if (rows.length === 0) {
          setParseError('Could not find valid school records. Make sure "name" and "city" columns exist.');
        } else {
          setCsvData(rows);
        }
      } catch (err) {
        setParseError('Failed to parse CSV file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (csvData.length === 0) return;
    importSchoolsFromCsv(csvData);
    onClose();
    setCsvData([]);
    setFileName('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Import School Records via CSV</h3>
              <p className="text-xs text-slate-500">Bulk upload educational institutions into the system</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="text-xs text-slate-600">
              Need the standard column schema?
            </div>
            <button
              onClick={downloadSampleTemplate}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Template</span>
            </button>
          </div>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-6 text-center transition-colors">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-file-input"
            />
            <label htmlFor="csv-file-input" className="cursor-pointer block">
              <Upload className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <span className="text-xs font-semibold text-indigo-600 block">
                {fileName ? fileName : 'Click to select or drop CSV file'}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Supports .csv files with headers: name, city, board, principal, coordinator, categories
              </span>
            </label>
          </div>

          {parseError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {/* Preview Table */}
          {csvData.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Preview Parsed Records ({csvData.length} schools found):</span>
              </div>
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="py-2 px-3">School Name</th>
                      <th className="py-2 px-3">City</th>
                      <th className="py-2 px-3">Board</th>
                      <th className="py-2 px-3">Principal</th>
                      <th className="py-2 px-3">Categories</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {csvData.slice(0, 10).map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-1.5 px-3 font-medium text-slate-900 truncate max-w-[150px]">{row.name}</td>
                        <td className="py-1.5 px-3 text-slate-600">{row.city}</td>
                        <td className="py-1.5 px-3 text-slate-600">{row.board}</td>
                        <td className="py-1.5 px-3 text-slate-600 truncate max-w-[120px]">{row.principal_name}</td>
                        <td className="py-1.5 px-3 text-slate-500 text-[11px]">{row.categories.join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {csvData.length > 10 && (
                <p className="text-[11px] text-slate-500 text-right">Showing first 10 of {csvData.length} records</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors shadow-2xs"
          >
            Cancel
          </button>
          <button
            disabled={csvData.length === 0}
            onClick={handleConfirmImport}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Import {csvData.length > 0 ? `${csvData.length} Schools` : ''}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
