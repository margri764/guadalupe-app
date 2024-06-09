
export class User {


    constructor(
        public iduser: number, 
        public name: string,
        public lastName: string,
        public Nome_Completo: string,
        public Email: string,
        public emailCongregatio: string,
        public Data_Nascimento: string, 
        public Nome_da_sede:string,
        public Cidade_da_sede: string,
        public Pais_da_sede: string,
        public Telefone1: string,
        public Ordem: string,
        public validateEmail: string,
        public password: string,
        public status: number,
        public role: string,
        public Pais_Nascimento: string,
        public Cidade_Nascimento: string,
        public Nacionalidade: string,
        public Residencia_atual: string,
        public linkCongregatio: any,
        public active: any,
        public webAccess: any,
        public Ruta_Imagen : string,
        public Habito_sem_capuz: string,
        public Habito_com_capuz: string,
        public observation: string,
        public Historico_Sedes? : string,
        public Encarregado_Com_Capuz ? : string,
        public Encarregado_Sem_Capuz ? : string,
        public Data_Habito_Com_Capuz? : string,
        public Data_Habito_Sem_Capuz? : string,
        public idpropulsao? : any,
        public propulsao_name? : any,
        )
        {}
  
  }