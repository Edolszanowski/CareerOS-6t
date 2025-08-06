"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface OnboardingContextType {
  userId: number | null
  currentStep: number
  userData: any
  setUserId: (id: number) => void
  setCurrentStep: (step: number) => void
  setUserData: (data: any) => void
  nextStep: () => void
  prevStep: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<number | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [userData, setUserData] = useState({})

  const nextStep = () => setCurrentStep((prev) => prev + 1)
  const prevStep = () => setCurrentStep((prev) => Math.max(1, prev - 1))

  return (
    <OnboardingContext.Provider
      value={{
        userId,
        currentStep,
        userData,
        setUserId,
        setCurrentStep,
        setUserData,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider")
  }
  return context
}
