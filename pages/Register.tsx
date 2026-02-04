import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  const [accountType, setAccountType] = useState<'buyer' | 'seller'>('buyer');

  return (
    <div className="min-h-screen flex bg-white">
       {/* Left Side - Image */}
      <div className="hidden lg:block w-1/2 bg-cover bg-center relative" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCLDpZWai-yXSJQwvCVD2AQv3q8AcRUF6q377hH2P9kNVI6xT-j4KVJWbc4rdj87yF243XohLo3_9XCJU7z30RElTtPdhIY7wG4TqhbRPxO_KuPxAxlPvNFTZ3D-dQ1X4Ju57Pz_-AgGkzNPuBirJk2l8QaxjPL6HD9cIBL8fBnp6PtxwMOzQFW8Wg_YPmckY8QKD5X0d1KVKXPdPw9d0ruDsWNOFYwewm3P_92EJ7BdkxstYwngnqhMLa8i75j_7OaAHnlJXk9YUuY")'}}>
        <div className="absolute inset-0 bg-background-dark/40 mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 p-12 text-white">
          <h2 className="text-4xl font-black mb-4">Alătură-te comunității.</h2>
          <p className="text-lg opacity-90">Creează-ți cont gratuit și descoperă cele mai bune oferte de materiale de construcții.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="flex items-center gap-2 mb-10 text-primary">
            <svg className="size-8" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fillRule="evenodd"></path>
            </svg>
             <span className="font-display font-bold text-2xl text-[#111418] tracking-tight">MatPort</span>
          </Link>

          <h1 className="text-3xl font-bold text-[#111418] mb-2">Creează cont nou</h1>
          <p className="text-[#617289] mb-8">Completează formularul de mai jos pentru a începe.</p>

          <form className="space-y-5">
            <div className="p-1 bg-[#f0f2f4] rounded-lg flex mb-6">
                <button 
                    type="button"
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${accountType === 'buyer' ? 'bg-white text-primary shadow-sm' : 'text-[#617289] hover:text-[#111418]'}`}
                    onClick={() => setAccountType('buyer')}
                >
                    Cumpărător
                </button>
                <button 
                    type="button"
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${accountType === 'seller' ? 'bg-white text-primary shadow-sm' : 'text-[#617289] hover:text-[#111418]'}`}
                    onClick={() => setAccountType('seller')}
                >
                    Vânzător (Distribuitor)
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-bold text-[#111418] mb-2" htmlFor="firstName">Prenume</label>
                <input 
                    className="w-full h-12 px-4 rounded-lg border border-[#e2e8f0] text-[#111418] placeholder:text-[#617289] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                    id="firstName" 
                    type="text" 
                    placeholder="Ion"
                />
                </div>
                <div>
                <label className="block text-sm font-bold text-[#111418] mb-2" htmlFor="lastName">Nume</label>
                <input 
                    className="w-full h-12 px-4 rounded-lg border border-[#e2e8f0] text-[#111418] placeholder:text-[#617289] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                    id="lastName" 
                    type="text" 
                    placeholder="Popescu"
                />
                </div>
            </div>

            {accountType === 'seller' && (
                 <div>
                 <label className="block text-sm font-bold text-[#111418] mb-2" htmlFor="company">Nume Companie</label>
                 <input 
                     className="w-full h-12 px-4 rounded-lg border border-[#e2e8f0] text-[#111418] placeholder:text-[#617289] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                     id="company" 
                     type="text" 
                     placeholder="Construct S.R.L."
                 />
                 </div>
            )}

            <div>
              <label className="block text-sm font-bold text-[#111418] mb-2" htmlFor="email">Email</label>
              <input 
                className="w-full h-12 px-4 rounded-lg border border-[#e2e8f0] text-[#111418] placeholder:text-[#617289] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                id="email" 
                type="email" 
                placeholder="nume@exemplu.ro"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#111418] mb-2" htmlFor="password">Parolă</label>
              <input 
                className="w-full h-12 px-4 rounded-lg border border-[#e2e8f0] text-[#111418] placeholder:text-[#617289] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                id="password" 
                type="password" 
                placeholder="••••••••"
              />
               <p className="text-xs text-[#617289] mt-1">Minim 8 caractere, o literă mare și un număr.</p>
            </div>

            <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 rounded border-gray-300 text-primary focus:ring-primary" id="terms" />
                <label htmlFor="terms" className="text-sm text-[#617289]">
                    Sunt de acord cu <a href="#" className="text-primary hover:underline">Termenii și Condițiile</a> și <a href="#" className="text-primary hover:underline">Politica de Confidențialitate</a> MatPort.
                </label>
            </div>

            <button className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
              Creează Cont
            </button>
          </form>

          <p className="mt-8 text-center text-[#617289]">
            Ai deja un cont? <Link to="/login" className="font-bold text-primary hover:underline">Autentifică-te</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;