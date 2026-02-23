import React from 'react'
import { HiSparkles } from 'react-icons/hi2'
import { FiGithub, FiTwitter, FiExternalLink } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="border-t border-stacks-gray mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <HiSparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display">
                  <span className="gradient-text">StacksYield</span>
                  <span className="text-white"> Pro</span>
                </h3>
              </div>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              Maximize your STX yields with auto-compounding vaults. Built on Stacks,
              secured by Bitcoin. Choose your strategy and watch your earnings grow.
            </p>
            <div className="flex space-x-4 mt-6">
              <a aria-label="GitHub (opens in new tab)"
                href="https://github.com/AdekunleBamz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-stacks-gray flex items-center justify-center hover:bg-stacks-purple/20 transition-colors focus:outline-none focus:ring-2 focus:ring-stacks-purple/50"
              >
                <FiGithub className="w-5 h-5" />
              </a>
              <a aria-label="Twitter (opens in new tab)"
                href="https://twitter.com/hrh_mckay"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-stacks-gray flex items-center justify-center hover:bg-stacks-purple/20 transition-colors focus:outline-none focus:ring-2 focus:ring-stacks-purple/50"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 id="footer-protocol" className="font-semibold mb-4">Protocol</h4>
            <ul className="space-y-2">
              <li>
                <a href="#vaults" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Vaults
                </a>
              </li>
              <li>
                <a href="#dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#referrals" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Referrals
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 id="footer-resources" className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://docs.stacks.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Stacks Documentation (opens in new tab)"
                  className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-stacks-purple/50 rounded px-1 -mx-1 text-sm flex items-center gap-1"
                >
                  Documentation <FiExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://explorer.stacks.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Stacks Explorer (opens in new tab)"
                  className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-stacks-purple/50 rounded px-1 -mx-1 text-sm flex items-center gap-1"
                >
                  Explorer <FiExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/AdekunleBamz/stacksyield-pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="StacksYield Pro GitHub Repository (opens in new tab)"
                  className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-stacks-purple/50 rounded px-1 -mx-1 text-sm flex items-center gap-1"
                >
                  GitHub <FiExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stacks-gray mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm">
            © 2025 StacksYield Pro. Built with WalletKit SDK.
          </p>
          <p className="text-gray-500 text-sm mt-2 md:mt-0">
            Powered by <span className="text-stacks-purple">Stacks</span> • Secured by <span className="text-stacks-orange">Bitcoin</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
