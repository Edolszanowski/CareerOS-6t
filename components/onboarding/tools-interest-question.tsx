'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Check } from 'lucide-react'
import { useOnboarding } from '@/contexts/onboarding-context'

interface ToolsInterestQuestionProps {
  onNext: () => void
  onPrev: () => void
}

const tools = [
  { id: 'chatgpt', name: 'ChatGPT', description: 'Conversational AI assistant' },
  { id: 'claude', name: 'Claude', description: 'Advanced AI for analysis and writing' },
  { id: 'midjourney', name: 'Midjourney', description: 'AI image generation' },
  { id: 'github-copilot', name: 'GitHub Copilot', description: 'AI coding assistant' },
  { id: 'notion-ai', name: 'Notion AI', description: 'AI-powered productivity' },
  { id: 'canva-ai', name: 'Canva AI', description: 'AI design tools' },
  { id: 'grammarly', name: 'Grammarly', description: 'AI writing assistant' },
  { id: 'other', name: 'Other tools', description: 'Different AI tools' },
]

export function ToolsInterestQuestion({ onNext, onPrev }: ToolsInterestQuestionProps) {
  const { updateUserData, userData } = useOnboarding()
  const [selected, setSelected] = useState<string[]>(userData.toolsInterest || [])

  const handleToggle = (toolId: string) => {
    const newSelected = selected.includes(toolId)
      ? selected.filter(id => id !== toolId)
      : [...selected, toolId]
    
    setSelected(newSelected)
    updateUserData({ toolsInterest: newSelected })
  }

  const handleContinue = () => {
    if (selected.length > 0) {
      onNext()
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onPrev} className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="text-sm font-medium text-gray-900">Your Interests</div>
            <div className="text-xs text-gray-500">Select all that apply</div>
          </div>
        </div>
        <div className="text-lg font-bold">CareerOS</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-xl font-bold text-gray-900">Which AI tools interest you?</h1>
            <p className="text-gray-600">
              Select any tools you're curious about or already using
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {tools.map((tool) => (
              <Card
                key={tool.id}
                className={`cursor-pointer transition-all border-2 hover:shadow-sm ${
                  selected.includes(tool.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleToggle(tool.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{tool.name}</h3>
                      <p className="text-sm text-gray-600">{tool.description}</p>
                    </div>
                    {selected.includes(tool.id) && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            onClick={handleContinue}
            disabled={selected.length === 0}
            className="w-full bg-black hover:bg-gray-800 text-white py-4 text-base font-medium disabled:opacity-50"
          >
            Continue ({selected.length} selected)
          </Button>
        </div>
      </div>
    </div>
  )
}
