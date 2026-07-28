import React, { useState } from 'react'
import { Eye, FileText, Image as ImageIcon, Sparkles } from 'lucide-react'
import { FileDrop } from '../Shared/FileDrop'
import { TTSButton } from '../Shared/TTSButton'
import { LoadingAgent } from '../Shared/LoadingAgent'
import { visionAPI } from '../../services/api'

/**
 * VisionAgent Component
 * 
 * Image analysis interface for OCR text extraction and scene description.
 * Upload image → Analyze → Display results (OCR text, description, detected items)
 * 
 * Uses Gemini 1.5 Flash Vision via /api/vision/analyze endpoint.
 */
const VisionAgent = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  /**
   * Handle file selection
   */
  const handleFileSelect = (file) => {
    setSelectedFile(file)
    setResults(null) // Clear previous results
    setError(null)
  }

  /**
   * Analyze image
   */
  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image first')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const data = await visionAPI.analyzeImage(selectedFile)
      setResults(data)
    } catch (err) {
      console.error('Vision analysis error:', err)
      setError(err.message || 'Failed to analyze image. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  /**
   * Clear and start over
   */
  const handleClear = () => {
    setSelectedFile(null)
    setResults(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Eye size={32} className="text-orange-500" aria-hidden="true" />
            <h1 className="text-3xl font-bold text-white">Vision Agent</h1>
          </div>
          <p className="text-zinc-400">
            Extract text from images, get scene descriptions, and identify objects using AI vision analysis.
          </p>
        </div>

        {/* File Upload Section */}
        {!results && (
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Upload Image
            </h2>
            
            <FileDrop 
              onFileSelect={handleFileSelect}
              acceptedTypes="image/jpeg,image/png"
              maxSizeMB={4}
            />

            {selectedFile && !isAnalyzing && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleAnalyze}
                  className="
                    flex-1 flex items-center justify-center gap-2 px-6 py-3
                    bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900
                  "
                  aria-label="Analyze image"
                >
                  <Sparkles size={20} aria-hidden="true" />
                  <span>Analyze Image</span>
                </button>

                <button
                  onClick={handleClear}
                  className="
                    px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900
                  "
                  aria-label="Clear and upload new image"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="bg-slate-800 rounded-lg p-12">
            <LoadingAgent agentName="Vision Agent" message="Vision Agent is analyzing your image" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div role="alert" className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400 font-medium mb-1">Analysis Failed</p>
            <p className="text-red-300 text-sm">{error}</p>
            <button
              onClick={handleClear}
              className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            {/* Success Badge */}
            <div className="flex items-center justify-between bg-green-500/10 border border-green-500 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Eye size={20} className="text-white" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-green-400 font-medium">Analysis Complete</p>
                  <p className="text-green-300 text-sm">
                    Confidence: {Math.round((results.confidence || 0.9) * 100)}%
                  </p>
                </div>
              </div>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                aria-label="Analyze another image"
              >
                Analyze Another
              </button>
            </div>

            {/* OCR Text Section */}
            {results.ocr_text && (
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText size={24} className="text-orange-500" aria-hidden="true" />
                    <h2 className="text-xl font-semibold text-white">
                      Extracted Text (OCR)
                    </h2>
                  </div>
                  <TTSButton text={results.ocr_text} label="Read extracted text aloud" />
                </div>
                
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <p className="text-zinc-200 whitespace-pre-wrap leading-relaxed">
                    {results.ocr_text || 'No text detected in image'}
                  </p>
                </div>
              </div>
            )}

            {/* Scene Description Section */}
            {results.description && (
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={24} className="text-orange-500" aria-hidden="true" />
                    <h2 className="text-xl font-semibold text-white">
                      Scene Description
                    </h2>
                  </div>
                  <TTSButton text={results.description} label="Read scene description aloud" />
                </div>
                
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <p className="text-zinc-200 leading-relaxed">
                    {results.description || 'No description available'}
                  </p>
                </div>
              </div>
            )}

            {/* Detected Items Section */}
            {results.detected_items && results.detected_items.length > 0 && (
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={24} className="text-orange-500" aria-hidden="true" />
                  <h2 className="text-xl font-semibold text-white">
                    Detected Objects
                  </h2>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {results.detected_items.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Read All Button */}
            <div className="flex justify-center">
              <TTSButton 
                text={`
                  Extracted text: ${results.ocr_text || 'None'}. 
                  Scene description: ${results.description || 'None'}. 
                  Detected objects: ${results.detected_items?.join(', ') || 'None'}.
                `}
                label="Read complete analysis aloud"
                className="px-8 py-3 text-base"
              />
            </div>
          </div>
        )}

        {/* Instructions */}
        {!selectedFile && !results && (
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <h3 className="text-white font-medium mb-3">How to use:</h3>
            <ol className="space-y-2 text-zinc-400 text-sm list-decimal list-inside">
              <li>Upload an image containing text, signs, or objects you want to identify</li>
              <li>Click "Analyze Image" to process with AI vision</li>
              <li>Review extracted text, scene description, and detected objects</li>
              <li>Use "Read Aloud" buttons to hear results via text-to-speech</li>
            </ol>
            
            <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <p className="text-orange-400 text-sm">
                <strong>💡 Tip:</strong> For best OCR results, ensure text is clear and well-lit. 
                Works with signboards, documents, medicine labels, and more.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { VisionAgent }
export default VisionAgent
export { VisionAgent }
