import { Module } from '@/enum/moduleEnum';
import { checkLevel } from '@/utils/checkLevel';
import hasModuleAccess from '@/utils/hasModuleAccess';
import { useMemo } from 'react';
import { ROLE_MAP, RoleDepartment } from '@/enum/permissionEnum';

const MODULES_MAP = {
    admin: Module.ADMIN_PANEL,
    recruitment: Module.RECRUITMENT,
    supervision: Module.SUPERVISION,
    operational: Module.OPERATIONAL,
    support: Module.SUPPORT_PANEL,
    sales: Module.SALES,
    finance: Module.FINANCE,
    candidate: Module.CANDIDATE_AREA,
    compliance: Module.COMPLIANCE
};

/**
 * MAPEAMENTO DE DEPARTAMENTOS -> MÓDULOS
 * Aqui você diz quais departamentos do seu Enum têm "afinidade" com quais chaves do módulo.
 */
const DEPT_TO_MODULE_AFFINITY: Record<RoleDepartment, (keyof typeof MODULES_MAP)[]> = {
    [RoleDepartment.RECRUITMENT]: ['recruitment'],
    [RoleDepartment.FINANCE]: ['finance'],
    [RoleDepartment.ADMIN_PANEL]: ['admin', 'compliance'],
    [RoleDepartment.MANAGEMENT]: ['admin', 'recruitment', 'operational'], // Gestores veem quase tudo
    [RoleDepartment.SUPPORT_PANEL]: ['support'],
    [RoleDepartment.OPERATIONAL]: ['operational'],
    [RoleDepartment.HOSPITALITY]: ['operational'],
    [RoleDepartment.KITCHEN]: ['operational'],
    [RoleDepartment.BAR]: ['operational'],
    [RoleDepartment.CLEANING]: ['operational'],
    [RoleDepartment.MAINTENANCE]: ['operational'],
    [RoleDepartment.SALES]: ['sales'],
    [RoleDepartment.COMPLIANCE]: ['compliance'],
    [RoleDepartment.GENERAL]: ['candidate'],
    [RoleDepartment.DEV]: ['admin', 'support'], // Devs costumam ter acesso técnico
    [RoleDepartment.CS]: ['sales'],
    [RoleDepartment.OPS]: ['operational'],
    [RoleDepartment.TECH]: ['admin']
};

export const useUserPermissions = (userRole: string) => {
    return useMemo(() => {
        // 1. Sanitização
        const cleanRole = userRole?.replace(/['"]+/g, '').trim();
        const roleData = ROLE_MAP[cleanRole];

        // 2. Níveis Hierárquicos
        const levels = {
            veryLow: checkLevel("veryLow"),
            low: checkLevel("low"),
            mid: checkLevel("mid"),
            high: checkLevel("high"),
            veryHigh: checkLevel("veryHigh")
        };

        // 3. Processamento de Módulos
        const modules = (Object.entries(MODULES_MAP) as [keyof typeof MODULES_MAP, Module][]).reduce(
            (acc, [key, moduleEnum]) => {
                // A. O sistema permite acesso técnico a esse módulo para essa role?
                const hasTechnicalAccess = hasModuleAccess(cleanRole, moduleEnum);

                // B. O departamento desse cargo tem afinidade com esse módulo?
                // Se a role for SUPER_ADMIN ou se o departamento dela estiver mapeado para essa key
                const userDept = roleData?.department || RoleDepartment.GENERAL;
                const hasSectorAffinity = 
                    cleanRole === 'SUPER_ADMIN' || 
                    DEPT_TO_MODULE_AFFINITY[userDept]?.includes(key);

                acc[key] = !!hasTechnicalAccess && hasSectorAffinity;

                return acc;
            },
            {} as Record<keyof typeof MODULES_MAP, boolean>
        );

        return {
            ...levels,
            modules,
            userDept: roleData?.department || RoleDepartment.GENERAL,
            isSuperAdmin: cleanRole === 'SUPER_ADMIN' || (levels.high && modules.admin)
        };
    }, [userRole]);
};