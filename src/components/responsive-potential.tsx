import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

interface Props {
  size?: string // e.g. "w-32", "w-16", "w-full"
  className?: string
  bgSrc: string
  iconSrc: string
  name: string
  desc?: string
}

export default function ResponsivePotential({
  size = 'w-24',
  className = '',
  bgSrc,
  iconSrc,
  name,
  desc = '',
}: Props) {
  if (!desc)
    return (
      <div
        className={`relative ${size} h-fit aspect-[0.7851] bg-contain bg-center bg-no-repeat ${className} border rounded-sm`}
        style={{ backgroundImage: `url(${bgSrc})` }}
      >
        <img
          src={iconSrc}
          alt="Icon"
          className="absolute inset-0 -top-5 w-full h-auto m-auto"
        />
        <div className="absolute bottom-1 px-1 left-1/2 -translate-x-1/2 text-xxs drop-shadow-md w-full text-black text-center">
          {name}
        </div>
      </div>
    )

  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className={`relative ${size} h-fit aspect-[0.7851] bg-contain bg-center bg-no-repeat ${className} border rounded-sm`}
          style={{ backgroundImage: `url(${bgSrc})` }}
        >
          <img
            src={iconSrc}
            alt="Icon"
            className="absolute inset-0 -top-5 w-full h-auto m-auto"
          />
          <div className="absolute bottom-1 px-1 left-1/2 -translate-x-1/2 text-xxs drop-shadow-md w-full text-black text-center">
            {name}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-[300px]">{desc}</TooltipContent>
    </Tooltip>
  )
}
