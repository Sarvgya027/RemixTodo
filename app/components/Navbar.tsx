import { Link, useNavigate } from "@remix-run/react"
import { useState } from "react"
import Logout from "./Logout";

export default function Navbar() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(true); 


  return (
    <nav className="bg-gradient-to-r from-purple-500 to-pink-600 backdrop:blur p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          Todo-Ist
        </Link>
        <div>
          {isLoggedIn ? (
            <Logout />
          ) : (
            <Link to="/login" className="text-white hover:text-gray-300">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
