const calculateFontSize = (t: string): number => {
  const baseSize = 9
  const length = t.length
  if (length <= 15) return baseSize // Short text stays at base size
  return 8
}

export const AutoFitText: React.FC<{ text: string }> = ({ text }) => {
  const fontSize = calculateFontSize(text)

  return (
    <div
      className="text-center"
      style={{
        fontSize: `${fontSize}px`,
        wordBreak: 'break-word',
        lineHeight: '0.9',
      }}
    >
      {text}
    </div>
  )
}
