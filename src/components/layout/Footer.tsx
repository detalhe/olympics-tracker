import { Github, Globe } from "lucide-react";
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold italic lowercase">
              olympics-tracker
            </Link>
            <p className="text-gray-300">Stay updated with the latest Olympic events, medal counts, and athlete performances.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-blue-400 transition-colors">
                  Schedule
                </a>
              </li>
              <li>
                <a href="/medals" className="hover:text-blue-400 transition-colors">
                  Medals
                </a>
              </li>
              <li>
                <a href="/stats" className="hover:text-blue-400 transition-colors">
                  Stats
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <span>an app by</span>
            <a href="https://github.com/detalhe" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400 underline">
              Eduardo Monteiro
            </a>
            <a href="https://github.com/detalhe/olympics-tracker" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              <Github size={20} />
            </a>
            <a href="https://detalhe.uk" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              <Globe size={20} />
            </a>
          </div>
          <div className="mt-4 md:mt-0">
            <a href="https://docs.apis.codante.io/olympic-games" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2 rounded-md">
              powered by codante
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;