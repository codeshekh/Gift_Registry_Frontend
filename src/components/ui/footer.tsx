import Link from 'next/link'
import { Facebook, Twitter, Instagram, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-blue-200 text-gray-600 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">PresentPal</h2>
            <p className="mb-4">Making gift-giving easier and more thoughtful.</p>
          </div>
          <div>
  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
  <ul className="flex space-x-4">
    <li>
      <Link href="/dashboard" className="hover:text-gray-800 transition-colors">
        Home
      </Link>
    </li>
    <li>
      <Link href="/about" className="hover:text-gray-800 transition-colors">
        About
      </Link>
    </li>
    <li>
      <Link href="/features" className="hover:text-gray-800 transition-colors">
        Features
      </Link>
    </li>
    <li>
      <Link href="/contact" className="hover:text-gray-800 transition-colors">
        Contact
      </Link>
    </li>
  </ul>
</div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800 transition-colors">
                <Facebook size={24} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800 transition-colors">
                <Twitter size={24} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800 transition-colors">
                <Instagram size={24} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800 transition-colors">
                <Github size={24} />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p>&copy; {new Date().getFullYear()} PresentPal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}