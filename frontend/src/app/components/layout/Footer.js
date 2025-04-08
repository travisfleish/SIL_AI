import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-500 text-white py-8 flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-8 mt-10 mb-10">
        <a
          href="https://www.twinbrain.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center"
        >
          <Image
            src="/logo.png"
            alt="TwinBrain Logo"
            width={150}
            height={10}
          />
        </a>
        <span className="text-gray-300 font-bold text-2xl">×</span>
        <a
          href="https://www.sportsinnovationlab.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center"
        >
          <Image
            src="/sil-logo.png"
            alt="Sports Innovation Lab Logo"
            width={200}
            height={100}
          />
        </a>
      </div>
      <p className="text-xs text-gray-300 mt-10">
        &copy; {new Date().getFullYear()} | A collaboration between TwinBrain AI & Sports Innovation Lab
      </p>
    </footer>
  );
};

export default Footer;