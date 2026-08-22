import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useLangStore } from '@/lib/store'

export function LangSwitcher() {
  const lang = useLangStore((s) => s.lang)
  const changeLang = useLangStore((s) => s.change)

  return (
    <div>
      <Select
        value={lang}
        onValueChange={(value) => {
          if (value == null) return
          changeLang(value)
        }}
      >
        <SelectTrigger
          size="sm"
          className="border-gray-500 bg-inherit min-w-8 flex items-center justify-center [&_svg]:hidden"
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
