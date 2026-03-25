import { BookOpenText, Database } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'

export function Guide() {
  return (
    <Popover>
      <PopoverTrigger>Guide</PopoverTrigger>
      <PopoverContent className="w-80 sm:w-md text-sm text-pretty space-y-2">
        <p className="text-center font-semibold">
          Fantastic Builds and how to make them
        </p>
        <ul className="flex flex-col gap-1">
          <li>
            <span className="inline-block bg-support text-white px-2 font-semibold mr-1 rounded-xl">
              Core Priority
            </span>
            : Makes or breaks your build. These are the most important to get
            and upgrade.
            <img
              src="/ss-vestige/vestige_0.png"
              className="mx-1 inline-block h-5 w-auto"
            ></img>
            Pink Potentials are automatically in this priority type.
          </li>
          <li>
            <span className="inline-block bg-versatile text-white px-2 font-semibold mr-1 rounded-xl">
              Medium Priority
            </span>
            : Secondary goal. You may upgrade these up to their desirable levels
            if your Core priorities are close to max at the end of the run.
          </li>
          <li>
            <span className="inline-block bg-vanguard text-white px-2 font-semibold mr-1 rounded-xl">
              Optional Priority
            </span>
            : Your last resort. If you have undesirable potential choices from a
            stage, pick these, but ideally, never. Focus on Core and Medium as
            much as possible.
          </li>
          <li>
            Ultimately, Core and Medium priorities are essentially the same. For
            representation's sake, you may split the required potentials from
            your build into Core and Medium. Not all Ascension runs are made
            equal.
          </li>
          <li className="text-muted-foreground">
            <sup>*</sup>Everything is subject to change once we get better
            Monolith Difficulties.
          </li>
        </ul>
        <div>
          <p>Useful Links</p>
          <div className="space-y-2">
            <Button variant="link" asChild>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.google.com/spreadsheets/d/1otsS2C1RkXLaFSvp2SMOS-vtRBaEBpZlcgR361_fdAE/edit?gid=1265175955#gid=1265175955"
              >
                <BookOpenText />
                Mistique's Field Reports
              </a>
            </Button>
            <Button variant="link" asChild>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://stelladb.pages.dev"
              >
                <Database />
                StellaDB
              </a>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
