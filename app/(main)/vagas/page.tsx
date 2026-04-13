"use client";

import React, {  useEffect } from 'react';

import { useRouter } from 'next/navigation';
const VagasPage = () => {
  const router = useRouter();
  useEffect(() => {
    // Redireciona para a rota de categorias ao acessar /vagas
    router.replace('/');
  }, []);
  
  return null;
   
};


export default React.memo(VagasPage);
