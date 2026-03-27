import { ArrowUpRight } from "lucide-react"

const ArrowButton = ({ children }) => {
  return (
    <button className="group flex cursor-pointer items-center gap-0 rounded-full border-none bg-transparent px-0 py-0 shadow-none hover:bg-transparent">
      <span className="rounded-full font-semibold text-white duration-500 ease-in-out transition-colors shadow-md z-10 flex items-center bg-blue-600 group-hover:bg-slate-900 px-8 py-4 text-base">
        {children}
      </span>
      <div className="relative flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full text-white duration-500 ease-in-out transition-colors shadow-md -ml-3 bg-blue-600 group-hover:bg-slate-900 h-12 w-12">
        <ArrowUpRight className="absolute h-5 w-5 -translate-x-1/2 transition-all duration-500 ease-in-out group-hover:translate-x-10" />
        <ArrowUpRight className="absolute h-5 w-5 -translate-x-10 transition-all duration-500 ease-in-out group-hover:-translate-x-1/2" />
      </div>
    </button>
  )
}

export default ArrowButton
