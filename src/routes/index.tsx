import { createFileRoute } from '@tanstack/react-router'
import characters from '../character.json'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-3 max-w-md mx-auto gap-2">
        {[0, 1, 2].map((n) => (
          <div key={n} className="h-[150px] w-full border"></div>
        ))}
      </div>
      <div className="grid grid-cols-5 max-w-xl mx-auto gap-1">
        {Object.entries(characters).map(([id, char]) => (
          <div key={id} className="h-[110px] border-5">
            <img
              className="block h-full w-full object-cover object-top rounded-lg"
              src={`https://res.cloudinary.com/dafqr01it/image/upload/v1762945238/ss/avatar/head_${id}01_XL.png`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
