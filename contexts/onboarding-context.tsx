"use client"

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

interface UserData {
  userType?: string
  firstName?: string
  lastName?: string
  email?: string
  jobTitle?: string
  company?: string
  aiJourney?: string
  industry?: string
  role?: string
  function?: string
  aiUnderstanding?: string
  workAssistancePercentage?: number
  superpower?: string
  learningStyle?: string
  vision?: string
  assessmentId?: string
  aiReadinessScore?: number
  insights?: any
}

interface OnboardingState {
  currentStep: number
  userData: UserData
  isLoading: boolean
}

type OnboardingAction = 
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_USER_DATA'; payload: Partial<UserData> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET' }

const initialState: OnboardingState = {
  currentStep: 0,
  userData: {},
  isLoading: false
}

function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload }
    case 'UPDATE_USER_DATA':
      return { 
        ...state, 
        userData: { ...state.userData, ...action.payload }
      }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

interface OnboardingContextType {
  state: OnboardingState
  userData: UserData
  updateUserData: (data: Partial<UserData>) => void
  setCurrentStep: (step: number) => void
  setLoading: (loading: boolean) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState)

  const updateUserData = (data: Partial<UserData>) => {
    dispatch({ type: 'UPDATE_USER_DATA', payload: data })
  }

  const setCurrentStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step })
  }

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }

  const nextStep = () => {
    dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 })
  }

  const prevStep = () => {
    dispatch({ type: 'SET_STEP', payload: Math.max(0, state.currentStep - 1) })
  }

  const reset = () => {
    dispatch({ type: 'RESET' })
  }

  const value: OnboardingContextType = {
    state,
    userData: state.userData,
    updateUserData,
    setCurrentStep,
    setLoading,
    nextStep,
    prevStep,
    reset
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}
