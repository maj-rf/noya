const calculateFontSize = (t: string): number => {
  const baseSize = 9
  const length = t.length
  if (length <= 15) return baseSize // Short text stays at base size
  return 8.5
}

export const AutoFitText: React.FC<{ text: string }> = ({ text }) => {
  const fontSize = calculateFontSize(text)

  return (
    <div
      className="text-center leading-[0.95]"
      style={{
        fontSize: `${fontSize}px`,
      }}
    >
      {text}
    </div>
  )
}
