import { useRouter } from '@tanstack/react-router'
import { SelectValue } from '@radix-ui/react-select'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select'

export function LangSwitcher() {
  const router = useRouter()
  const [language, setLanguage] = useState(localStorage.getItem('lang') ?? 'EN')
  const switchLang = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem('lang', lang)
    router.invalidate()
  }

  return (
    <div>
      <Select value={language} onValueChange={switchLang}>
        <SelectTrigger
          size="sm"
          className="border-gray-500 min-w-8 flex items-center justify-center [&_svg]:hidden"
        >
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="EN">ENG</SelectItem>
          <SelectItem value="JP">日本語</SelectItem>
          <SelectItem value="KR">한국어</SelectItem>
          <SelectItem value="TW">繁體中文</SelectItem>
          <SelectItem value="CN">简体中文</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
