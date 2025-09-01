import { TbBrandMeta } from "react-icons/tb"
import { IoLogoInstagram } from "react-icons/io"
import { RiTwitterXLine } from "react-icons/ri"

const Topbar = () => {
  return (
    <div className="bg-green-200 text-green-900 w-full py-2">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        {/* Social Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="#" className="text-green-900 hover:text-green-600">
            <TbBrandMeta className="h-5 w-5" />
          </a>
          <a href="#" className="text-green-900 hover:text-green-600">
            <IoLogoInstagram className="h-5 w-5" />
          </a>
          <a href="#" className="text-green-900 hover:text-green-600">
            <RiTwitterXLine className="h-4 w-4" />
          </a>
        </div>

        {/* Promo Text */}
        <div className="text-sm text-center flex-grow">
          Buy clothes for the most reasonable price!
        </div>

        {/* Phone Number */}
        <div className="text-sm hidden md:block">
          <a href="tel:+1234567890" className="text-sm text-center flex-grow">
            +1-(234)-567-890
          </a>
        </div>
      </div>
    </div>
  )
}

export default Topbar