import { createContext, useContext } from 'react'

const ChecklistContext = createContext(null)

export function ChecklistProvider({ children, value }) {
  return (
    <ChecklistContext.Provider value={value}>
      {children}
    </ChecklistContext.Provider>
  )
}

export function useChecklistContext() {
  const ctx = useContext(ChecklistContext)
  if (!ctx) {
    throw new Error('useChecklistContext must be used within a ChecklistProvider')
  }
  return ctx
}
