import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#f0f2f4] py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="size-6 text-primary">
                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fillRule="evenodd"></path>
                </svg>
              </div>
              <span className="font-bold text-lg">MatPort</span>
            </div>
            <p className="text-sm text-[#617289]">#1 în România pentru surplusuri de materiale de construcții.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-[#111418]">Magazin</h4>
            <a className="text-sm text-[#617289] hover:text-primary" href="#">Toate categoriile</a>
            <a className="text-sm text-[#617289] hover:text-primary" href="#">Noutăți</a>
            <a className="text-sm text-[#617289] hover:text-primary" href="#">Oferte recomandate</a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-[#111418]">Suport</h4>
            <a className="text-sm text-[#617289] hover:text-primary" href="#">Centru de ajutor</a>
            <a className="text-sm text-[#617289] hover:text-primary" href="#">Ghid de siguranță</a>
            <a className="text-sm text-[#617289] hover:text-primary" href="#">Contactează-ne</a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-[#111418]">Companie</h4>
            <a className="text-sm text-[#617289] hover:text-primary" href="#">Despre noi</a>
            <a className="text-sm text-[#617289] hover:text-primary" href="#">Pentru distribuitori</a>
            <a className="text-sm text-[#617289] hover:text-primary" href="#">Termeni și condiții</a>
          </div>
        </div>
        <div className="pt-8 border-t border-[#f0f2f4] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#617289]">© 2023 MatPort România. Toate drepturile rezervate.</p>
          <div className="flex gap-4">
            <a className="text-[#617289] hover:text-primary" href="#"><span className="material-symbols-outlined text-lg">public</span> RO</a>
            <a className="text-[#617289] hover:text-primary" href="#"><span className="material-symbols-outlined text-lg">social_leaderboard</span></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;