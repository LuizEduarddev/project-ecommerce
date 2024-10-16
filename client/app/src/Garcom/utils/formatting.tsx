export const formatToReais = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const getUnformattedCpf = (userCpf: string) => userCpf.replace(/\D/g, '');