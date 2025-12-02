import React, { useEffect, useRef, useState } from 'react'

export const AutoFitText: React.FC<{ text: string }> = ({ text }) => {
  const textRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState(9)

  useEffect(() => {
    const fitText = () => {
      if (!textRef.current) return

      const textEl = textRef.current
      const parentWidth = textEl.parentElement?.clientWidth || 80

      let currentSize = 9 // base font size
      const maxHeight = 20 // maximum height in pixels

      textEl.style.fontSize = `${currentSize}px`

      // Reduce font size if text is too tall or wraps too much
      while (
        (textEl.scrollHeight > maxHeight || textEl.scrollWidth > parentWidth) &&
        currentSize > 8
      ) {
        currentSize -= 0.9
        textEl.style.fontSize = `${currentSize}px`
      }

      setFontSize(currentSize)
    }

    fitText()
    window.addEventListener('resize', fitText)
    return () => window.removeEventListener('resize', fitText)
  }, [text])

  return (
    <div
      ref={textRef}
      className="text-center"
      style={{
        fontSize: `${fontSize}px`,
        wordBreak: 'break-word',

        lineHeight: '1.1',
      }}
    >
      {text}
    </div>
  )
}
