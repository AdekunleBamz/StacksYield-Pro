import React from 'react'
import { HiSparkles } from 'react-icons/hi2'
import { FiGithub, FiTwitter, FiExternalLink } from 'react-icons/fi'

export const Footer = () => {
  return (
    <footer className="border-t border-stacks-gray mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-4 mb-6 group cursor-default">
              <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-stacks-purple/20 logo-shimmer group-hover:scale-110 transition-transform duration-500">
                <HiSparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black font-display tracking-tight leading-none">
                  <span className="gradient-text">StacksYield</span>
                  <span className="text-white"> Pro</span>
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mt-1">Yield Optimization</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm max-w-md font-bold leading-relaxed opacity-60">
              Maximize your STX yields with auto-compounding vaults. Built on Stacks,
              secured by Bitcoin. Choose your strategy and watch your earnings grow.
            </p>
            <div className="flex space-x-4 mt-8">
              <a aria-label="GitHub (opens in new tab)"
                href="https://github.com/AdekunleBamz"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden transition-all active:scale-90"
              >
                <div className="absolute inset-0 bg-stacks-purple translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <FiGithub className="relative z-10 w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
              <a aria-label="Twitter (opens in new tab)"
                href="https://twitter.com/hrh_mckay"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden transition-all active:scale-90"
              >
                <div className="absolute inset-0 bg-stacks-purple translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <FiTwitter className="relative z-10 w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Links */}
          <nav aria-labelledby="footer-protocol">
            <h4 id="footer-protocol" className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-6 opacity-40">Protocol</h4>
            <ul className="space-y-3">
              <li>
                <a href="#vaults" className="text-gray-500 hover:text-white transition-colors text-sm font-bold">
                  Vaults
                </a>
              </li>
              <li>
                <a href="#dashboard" className="text-gray-500 hover:text-white transition-colors text-sm font-bold">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#referrals" className="text-gray-500 hover:text-white transition-colors text-sm font-bold">
                  Referrals
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-resources">
            <h4 id="footer-resources" className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-6 opacity-40">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://docs.stacks.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors text-sm font-bold flex items-center gap-1.5"
                >
                  Documentation <FiExternalLink className="w-3 h-3 opacity-40" />
                </a>
              </li>
              <li>
                <a
                  href="https://explorer.stacks.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors text-sm font-bold flex items-center gap-1.5"
                >
                  Explorer <FiExternalLink className="w-3 h-3 opacity-40" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/AdekunleBamz/stacksyield-pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors text-sm font-bold flex items-center gap-1.5"
                >
                  Source Code <FiExternalLink className="w-3 h-3 opacity-40" />
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <section className="border-t border-white/5 mt-16 pt-10 flex flex-col md:flex-row items-center justify-between opacity-40">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
            © 2025 StacksYield Pro • Open Source
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Powered by <span className="text-white">Stacks</span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Secured by <span className="text-white">Bitcoin</span>
            </span>
          </div>
        </section>
      </div>
    </footer>
  )
}

