"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2, Database } from "lucide-react"

interface ConnectionInfo {
  connected: boolean
  tablesExist: boolean
  message: string
}

export function ConnectionStatus() {
  const [status, setStatus] = useState<"loading" | "ready" | "setup-needed" | "error">("loading")
  const [info, setInfo] = useState<ConnectionInfo>({ connected: false, tablesExist: false, message: "" })

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch("/api/test-db")
        const result = await response.json()

        if (result.success) {
          if (result.tablesExist) {
            setStatus("ready")
            setInfo({ connected: true, tablesExist: true, message: "Database ready" })
          } else {
            setStatus("setup-needed")
            setInfo({ connected: true, tablesExist: false, message: "Tables need setup" })
          }
        } else {
          setStatus("error")
          setInfo({ connected: false, tablesExist: false, message: "Connection failed" })
        }
      } catch (error) {
        setStatus("error")
        setInfo({ connected: false, tablesExist: false, message: "Connection error" })
      }
    }

    checkConnection()
  }, [])

  const getStatusColor = () => {
    switch (status) {
      case "ready":
        return "text-green-700 bg-green-50 border-green-200"
      case "setup-needed":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      case "error":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-blue-700 bg-blue-50 border-blue-200"
    }
  }

  const getIcon = () => {
    switch (status) {
      case "ready":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "setup-needed":
        return <Database className="w-4 h-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
    }
  }

  return (
    <Card className={`fixed bottom-4 right-4 w-80 z-50 border ${getStatusColor()}`}>
      <CardContent className="p-3">
        <div className="flex items-center gap-2 text-sm">
          {getIcon()}
          <span>{info.message}</span>
        </div>
      </CardContent>
    </Card>
  )
}
