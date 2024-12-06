import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Key, AlignJustify } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TextSummarizer = () => {
  const [inputText, setInputText] = useState('');
  const [fileName, setFileName] = useState('');
  const [summaryType, setSummaryType] = useState('lines');
  const [numLines, setNumLines] = useState(3);
  const [keywords, setKeywords] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const summarizeText = () => {
    if (!inputText.trim()) {
      setError('Please enter or upload some text to summarize');
      return;
    }

    const sentences = inputText
      .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
      .split("|")
      .filter(sentence => sentence.trim().length > 0);

    if (summaryType === 'lines') {
      const selectedSentences = sentences.slice(0, Math.min(numLines, sentences.length));
      setSummary(selectedSentences.join(' '));
    } else {
      const keywordList = keywords.toLowerCase().split(',').map(k => k.trim());
      const relevantSentences = sentences.filter(sentence =>
        keywordList.some(keyword => 
          sentence.toLowerCase().includes(keyword)
        )
      );
      setSummary(relevantSentences.join(' ') || 'No sentences found matching the given keywords.');
    }
    setError('');
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 p-8">
      <Card className="w-full max-w-3xl bg-white shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">Text Summarizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="paste" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Paste Text
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <div className="flex items-center gap-4 p-4 border-2 border-dashed rounded-lg">
                <input
                  type="file"
                  accept=".txt"
                  className="hidden"
                  id="file-upload"
                />
                <Button asChild variant="outline">
                  <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Choose File
                  </label>
                </Button>
                <span className="text-sm text-gray-500">{fileName || 'No file chosen'}</span>
              </div>
            </TabsContent>

            <TabsContent value="paste">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your text here..."
                className="w-full h-40 p-3 border rounded-lg resize-y"
              />
            </TabsContent>

            <div className="space-y-4 mt-6">
              <div className="flex flex-wrap gap-4">
                <Button
                  variant={summaryType === 'lines' ? 'default' : 'outline'}
                  onClick={() => setSummaryType('lines')}
                  className="flex-1"
                >
                  <AlignJustify className="w-4 h-4 mr-2" />
                  Summarize by Lines
                </Button>
                <Button
                  variant={summaryType === 'keywords' ? 'default' : 'outline'}
                  onClick={() => setSummaryType('keywords')}
                  className="flex-1"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Summarize by Keywords
                </Button>
              </div>

              {summaryType === 'lines' ? (
                <div className="flex items-center gap-4">
                  <label className="font-medium">Number of lines:</label>
                  <input
                    type="number"
                    min="1"
                    value={numLines}
                    onChange={(e) => setNumLines(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 p-2 border rounded-md"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="font-medium">Keywords (comma-separated):</label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Enter keywords..."
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              )}

              <Button onClick={summarizeText} className="w-full">
                Summarize Text
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {summary && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Summary:</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    {summary}
                  </div>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextSummarizer;
