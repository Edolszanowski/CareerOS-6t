import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Component() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-6">
          <h1 className="text-2xl font-medium text-orange-600">{"Let's confirm you are human"}</h1>

          <p className="text-gray-700 text-sm leading-relaxed max-w-xs mx-auto">
            Complete the security check before continuing. This step verifies that you are not a bot, which helps to
            protect your account and prevent spam.
          </p>

          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded">Begin {">"}</Button>
        </div>

        <div className="pt-8">
          <Select defaultValue="english">
            <SelectTrigger className="w-32 mx-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Español</SelectItem>
              <SelectItem value="french">Français</SelectItem>
              <SelectItem value="german">Deutsch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
