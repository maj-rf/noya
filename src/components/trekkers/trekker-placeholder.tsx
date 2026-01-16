import { SSTrekker } from './ss-trekker'
import { useTrekkerStore } from '@/lib/store'

export const TrekkerPlaceholder = () => {
  const trekkers = useTrekkerStore((s) => s.trekkers)
  return (
    <div className="flex gap-2">
      <div className="h-[125px] w-[100px] md:h-[150px] md:w-[120px] aspect-[0.8] bg-accent border rounded-sm shadow-sm flex items-center justify-center active:scale-[0.98] active:shadow-inner duration-150 ease-in-out">
        {trekkers.main ? (
          <SSTrekker id={trekkers.main} />
        ) : (
          <span className="text-rose-500">Main</span>
        )}
      </div>
      <div className="h-[125px] w-[100px] md:h-[150px] md:w-[120px] aspect-[0.8] bg-accent border rounded-sm shadow-sm flex items-center justify-center active:scale-[0.98] active:shadow-inner duration-150 ease-in-out">
        {trekkers.sub1 ? (
          <SSTrekker id={trekkers.sub1} />
        ) : (
          <span className="text-indigo-500">Support</span>
        )}
      </div>
      <div className="h-[125px] w-[100px] md:h-[150px] md:w-[120px] aspect-[0.8] bg-accent border rounded-sm shadow-sm flex items-center justify-center active:scale-[0.98] active:shadow-inner duration-150 ease-in-out">
        {trekkers.sub2 ? (
          <SSTrekker id={trekkers.sub2} />
        ) : (
          <span className="text-indigo-500">Support</span>
        )}
      </div>
    </div>
  )
}
