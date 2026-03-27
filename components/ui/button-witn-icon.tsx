import { ArrowUpRight } from "lucide-react"

const ButtonWithIcon = () => {
  return (
    <button className="group flex cursor-pointer items-center gap-0 rounded-full border-none bg-transparent px-0 py-5 shadow-none hover:bg-transparent">
      <span className="rounded-full bg-blue-500 px-6 py-3 text-white duration-500 ease-in-out group-hover:bg-blue-600 group-hover:transition-colors">
        联系我们
      </span>
      <div className="relative flex h-fit cursor-pointer items-center overflow-hidden rounded-full bg-blue-500 p-5 text-white">
        <ArrowUpRight className="h-5 w-5" />
      </div>
    </button>
  )
}

export default ButtonWithIcon
