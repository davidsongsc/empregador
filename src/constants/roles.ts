export const ROLE_LABELS: Record<string, string> = {
    // CLIENTES
    'CLIENT_OPERATIONAL_INTERN': 'Operacional (Estagiário)',
    'CLIENT_OPERATIONAL_JR': 'Operacional (Júnior)',
    'CLIENT_OPERATIONAL_PL': 'Operacional (Pleno)',
    'CLIENT_OPERATIONAL_SR': 'Operacional (Sênior)',
    'CLIENT_FINANCE_JR': 'Financeiro (Júnior)',
    'CLIENT_FINANCE_PL': 'Financeiro (Pleno)',
    'CLIENT_FINANCE_SR': 'Financeiro (Sênior)',
    'CLIENT_MANAGER': 'Gerente da Unidade',
    'CLIENT_ADMIN': 'Administrador do Sistema',

    // CANDIDATOS
    'CANDIDATE_INTERN': 'Candidato (Estagiário)',
    'CANDIDATE_JR': 'Candidato (Júnior)',
    'CANDIDATE_PL': 'Candidato (Pleno)',
    'CANDIDATE_SR': 'Candidato (Sênior)',
    'CANDIDATE_VIP': 'Candidato Executivo/VIP',

    // SAAS INTERNO
    'FIN_INTERN': 'Financeiro Interno (Estagiário)',
    'FIN_JR': 'Analista Financeiro (Júnior)',
    'FIN_PL': 'Analista Financeiro (Pleno)',
    'FIN_SR': 'Analista Financeiro (Sênior)',
    'FIN_MANAGER': 'Gerente Financeiro / Controller',
    'RECRUITER_INTERN': 'Recrutador (Estagiário)',
    'RECRUITER_JR': 'Recrutador (Júnior)',
    'RECRUITER_PL': 'Recrutador (Pleno)',
    'RECRUITER_SR': 'Recrutador (Sênior)',
    'RECRUITER_LEAD': 'Head de Recrutamento',

    // TECNOLOGIA
    'DEV_SR': 'Desenvolvedor (Sênior)',
    'SUPER_ADMIN': 'Administrador Global',

    'CLIENT_COOK_JR': 'Cozinheiro (Júnior)',
    'CLIENT_COOK_PL': 'Cozinheiro (Pleno)',
    'CLIENT_COOK_SR': 'Cozinheiro (Sênior)',
    'CLIENT_KITCHEN_ASSISTANT_JR': 'Auxiliar de Cozinha (JR)',
    'CLIENT_CHEF_DE_CUISINE': 'Chefe de Cozinha',
    'CLIENT_RECEPTIONIST_JR': 'Recepcionista',
    'CLIENT_ATTENDANT_JR': 'Atendente',
    'CLIENT_BARTENDER_JR': 'Bartender',
    'CLIENT_CLEANING_ASSISTANT': 'Aux. Limpeza',
    'CLIENT_MAINTENANCE_ASSISTANT': 'Aux. Manutenção',
    'CLIENT_GRIDDLE_COOK_JR': 'Chapeiro',
};

export const ROLE_CATEGORIES = {
    OPERACIONAL: ['CLIENT_OPERATIONAL_INTERN', 'CLIENT_OPERATIONAL_JR', 'CLIENT_OPERATIONAL_PL', 'CLIENT_OPERATIONAL_SR'],
    FINANCEIRO: ['CLIENT_FINANCE_JR', 'CLIENT_FINANCE_PL', 'CLIENT_FINANCE_SR'],
    RECRUTAMENTO: ['RECRUITER_INTERN', 'RECRUITER_JR', 'RECRUITER_PL', 'RECRUITER_SR', 'RECRUITER_LEAD'],
    CANDIDATO: ['CANDIDATE_INTERN', 'CANDIDATE_JR', 'CANDIDATE_PL', 'CANDIDATE_SR', 'CANDIDATE_VIP'],
    SISTEMA: ['DEV_SR', 'SUPER_ADMIN', 'ADMIN_SAAS_N1', 'ADMIN_SAAS_N2']
};