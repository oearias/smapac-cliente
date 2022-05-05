export interface ResContrato {
    total: number;
    contratos: Contrato[];
}

export interface Contrato{
    id:        number;
    contrato:  number;
    nombre:    string;
    direccion: string;
    tarifa:    string;
    giro:      string;
    adeuda:    number;
    region:    number;
}