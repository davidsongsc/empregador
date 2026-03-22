export const ROLE_LABELS: Record<string, string> = {
    // --- CLIENTES (GERAL & ADM) ---
    'CLIENT_OPERATIONAL_INTERN': 'Operacional (Estagiário)',
    'CLIENT_OPERATIONAL_JR': 'Operacional (Júnior)',
    'CLIENT_OPERATIONAL_PL': 'Operacional (Pleno)',
    'CLIENT_OPERATIONAL_SR': 'Operacional (Sênior)',
    'CLIENT_FINANCE_JR': 'Financeiro (Júnior)',
    'CLIENT_FINANCE_PL': 'Financeiro (Pleno)',
    'CLIENT_FINANCE_SR': 'Financeiro (Sênior)',
    'CLIENT_MANAGER': 'Gerente da Unidade',
    'CLIENT_ADMIN': 'Administrador do Sistema',
    'CLIENT_RECRUITER_INTERN': 'Recrutador (Estagiário)',
    'CLIENT_RECRUITER_JR': 'Recrutador (Júnior)',
    'CLIENT_RECRUITER_PL': 'Recrutador (Pleno)',
    'CLIENT_RECRUITER_SR': 'Recrutador (Sênior)',
    'CLIENT_RECRUITER_LEAD': 'Head de Recrutamento',

    // --- HOSPITALITY / KITCHEN (FREELACERTO CORE) ---
    'CLIENT_COOK_JR': 'Cozinheiro (Júnior)',
    'CLIENT_COOK_PL': 'Cozinheiro (Pleno)',
    'CLIENT_COOK_SR': 'Cozinheiro (Sênior)',
    'CLIENT_KITCHEN_ASSISTANT_JR': 'Auxiliar de Cozinha (Júnior)',
    'CLIENT_KITCHEN_ASSISTANT_PL': 'Auxiliar de Cozinha (Pleno)',
    'CLIENT_CHEF_DE_CUISINE': 'Chefe de Cozinha',
    'CLIENT_GRIDDLE_COOK_JR': 'Chapeiro (Júnior)',
    'CLIENT_RECEPTIONIST_JR': 'Recepcionista (Júnior)',
    'CLIENT_ATTENDANT_JR': 'Atendente (Júnior)',
    'CLIENT_BARTENDER_JR': 'Bartender (Júnior)',
    'CLIENT_BARTENDER_PL': 'Bartender (Pleno)',
    'CLIENT_CLEANING_ASSISTANT': 'Auxiliar de Limpeza',
    'CLIENT_MAINTENANCE_ASSISTANT': 'Auxiliar de Manutenção',

    // --- CANDIDATOS ---
    'CANDIDATE_INTERN': 'Candidato (Estagiário)',
    'CANDIDATE_JR': 'Candidato (Júnior)',
    'CANDIDATE_PL': 'Candidato (Pleno)',
    'CANDIDATE_SR': 'Candidato (Sênior)',
    'CANDIDATE_VIP': 'Candidato Executivo/VIP',

    // --- SAAS INTERNO (NEXUS TEAM) ---
    'FIN_INTERN': 'Financeiro Interno (Estagiário)',
    'FIN_JR': 'Analista Financeiro (Júnior)',
    'FIN_PL': 'Analista Financeiro (Pleno)',
    'FIN_SR': 'Analista Financeiro (Sênior)',
    'FIN_MANAGER': 'Gerente Financeiro / Controller',
    'SALES_INTERN': 'Comercial/SDR (Estagiário)',
    'SALES_JR': 'Executivo de Vendas (Júnior)',
    'SALES_PL': 'Executivo de Vendas (Pleno)',
    'SALES_SR': 'Executivo de Vendas (Sênior)',
    'SALES_DIRECTOR': 'Diretor Comercial',
    'RECRUITER_INTERN': 'Recrutador (Estagiário)',
    'RECRUITER_JR': 'Recrutador (Júnior)',
    'RECRUITER_PL': 'Recrutador (Pleno)',
    'RECRUITER_SR': 'Recrutador (Sênior)',
    'RECRUITER_LEAD': 'Head de Recrutamento',
    
    // --- TECNOLOGIA & SUPORTE ---
    'SUPPORT_INTERN': 'Suporte Técnico (Estagiário)',
    'SUPPORT_JR': 'Suporte Nível 1 (Júnior)',
    'SUPPORT_PL': 'Suporte Nível 2 (Pleno)',
    'SUPPORT_SR': 'Suporte Nível 3 (Sênior)',
    'DEV_INTERN': 'Desenvolvedor (Estagiário)',
    'DEV_JR': 'Desenvolvedor (Júnior)',
    'DEV_PL': 'Desenvolvedor (Pleno)',
    'DEV_SR': 'Desenvolvedor (Sênior)',
    'OPS_SAAS_JR': 'Analista Ops SaaS (Júnior)',
    'ADMIN_SAAS_N1': 'Admin Sistema N1',
    'ADMIN_SAAS_N2': 'Admin Sistema N2',
    'SUPER_ADMIN': 'Administrador Global',
};

export const ROLE_CATEGORIES = {
    // Categorias visíveis para Clientes (MaaS)
    HOSPITALIDADE: [
        'CLIENT_COOK_JR', 'CLIENT_COOK_PL', 'CLIENT_COOK_SR', 
        'CLIENT_CHEF_DE_CUISINE', 'CLIENT_KITCHEN_ASSISTANT_JR', 
        'CLIENT_KITCHEN_ASSISTANT_PL', 'CLIENT_GRIDDLE_COOK_JR',
        'CLIENT_BARTENDER_JR', 'CLIENT_BARTENDER_PL', 
        'CLIENT_RECEPTIONIST_JR', 'CLIENT_ATTENDANT_JR'
    ],
    FACILITIES: ['CLIENT_CLEANING_ASSISTANT', 'CLIENT_MAINTENANCE_ASSISTANT'],
    OPERACIONAL: ['CLIENT_OPERATIONAL_INTERN', 'CLIENT_OPERATIONAL_JR', 'CLIENT_OPERATIONAL_PL', 'CLIENT_OPERATIONAL_SR'],
    FINANCEIRO: ['CLIENT_FINANCE_JR', 'CLIENT_FINANCE_PL', 'CLIENT_FINANCE_SR', 'FIN_JR', 'FIN_PL', 'FIN_SR'],
    RECRUTAMENTO: [
        'RECRUITER_INTERN', 'RECRUITER_JR', 'RECRUITER_PL', 'RECRUITER_SR', 'RECRUITER_LEAD',
        'CLIENT_RECRUITER_INTERN', 'CLIENT_RECRUITER_JR', 'CLIENT_RECRUITER_PL', 'CLIENT_RECRUITER_SR'
    ],
    CANDIDATO: ['CANDIDATE_INTERN', 'CANDIDATE_JR', 'CANDIDATE_PL', 'CANDIDATE_SR', 'CANDIDATE_VIP'],
    SISTEMA: [
        'DEV_INTERN', 'DEV_JR', 'DEV_PL', 'DEV_SR', 
        'SUPER_ADMIN', 'ADMIN_SAAS_N1', 'ADMIN_SAAS_N2',
        'SUPPORT_JR', 'SUPPORT_PL', 'SUPPORT_SR'
    ]
};