// PagBrazil Doc Ref: https://pagbrasil.atlassian.net/wiki/spaces/PBDocs/pages/98666330/4.+Managing+a+payee#4.e

export const VALID_COUNTRY_ISO_FOR_KYC: null | string[] = ['BR']

export type IKycV3Status =
  | 'KYC_NOT_INITIATED'
  | 'KYC_PENDING'
  | 'KYC_COMPLETED'
  | 'KYC_FAILED'
// KYC_COMPLETED -> is KYC complete.. not Bank Details.. Bank Details are separate entity
// Kyc form -> not_initiated, pending, completed
// bank form -> null or Data only

// Need to check with BE
export type IKycV3StatusMessage =
  | 'BANK_ACCOUNT_REQUIRED'
  | 'KYC_NOT_INITIATED_MESSAGE'
  | 'IDWALL_VERIFICATION_PENDING'
  | 'KYC_VERIFICATION_PENDING'
  | 'IDWALL_VERIFICATION_REJECTED'

export interface IKycProfileApiResponse {
  kyc_status: IKycV3Status
  kyc_status_message: IKycV3StatusMessage
  documents: null | any[]
  kyc_profile_details: null | ITaxFormData
  bank_profile: null | IBankFormData
}

export interface ITaxFormData {
  name: string
  tax_id: string
  email: string
  phone_isd_code: string
  phone: string
  street: string
  zip: string
  city: string
  state: string
  country: string
}

export interface IBankFormData {
  payee_bank: string
  payee_branch: string
  payee_account: string // "******123", if we get form profile api
  payee_account_type: string
  approval_status?: '1' | '2' | '0'
  description?: string
}
// var (
// 	ApprovalStatusPending   ApprovalStatus = 0
// 	ApprovalStatusApproved  ApprovalStatus = 1
// 	ApprovalStatusRejected  ApprovalStatus = 2
// )
export enum IKycModalTypesEnum {
  KYC_PROMPT = 'KYC_PROMPT',
  KYC_TAX_RESIDENCY = 'KYC_TAX_RESIDENCY', // 1st Screen, Choose Tax Residency
  KYC_TAX_ID_FORM = 'KYC_TAX_ID_FORM', // 2nd Screen, Fill KYC / TaxID form
  KYC_IDWALL_COMPONENT = 'KYC_IDWALL_COMPONENT', // idwall image loading flow
  IDWALL_KYC_LOADING = 'IDWALL_KYC_LOADING', // idwall image loading flow

  // Bank form screen
  KYC_BANK_FORM = 'KYC_BANK_FORM', // 1st Screen, Fill Bank Details

  // Common Toast messages
  TOAST_ERROR = 'TOAST_ERROR',
  TOAST_PENDING = 'TOAST_PENDING',
  TOAST_KYC_SUCCESS = 'TOAST_KYC_SUCCESS',
  TOAST_BANK_SUCCESS = 'TOAST_BANK_SUCCESS',
  TOAST_KYC_ERROR = 'TOAST_KYC_ERROR',
  TOAST_BANK_ERROR = 'TOAST_BANK_ERROR',
  TOAST_WEBVIEW_BUILD = 'TOAST_WEBVIEW_BUILD',
}

export const HANDLE_PREV_CLICK: {
  [key: string]: string | undefined
} = {
  KYC_TAX_RESIDENCY: undefined,
  KYC_TAX_ID_FORM: 'KYC_TAX_RESIDENCY', // move back to Choose Tax Residency
  KYC_IDWALL_COMPONENT: 'KYC_TAX_ID_FORM', // move back to Fill Form
  //
  KYC_BANK_FORM: undefined, // close the modal, Since this is new Form, No back
} as const

export const BR_STATE_MAPPING = [
  { label: 'Acre', value: 'AC' },
  { label: 'Alagoas', value: 'AL' },
  { label: 'Amapá', value: 'AP' },
  { label: 'Amazonas', value: 'AM' },
  { label: 'Bahia', value: 'BA' },
  { label: 'Ceará', value: 'CE' },
  { label: 'Distrito Federal', value: 'DF' },
  { label: 'Espírito Santo', value: 'ES' },
  { label: 'Goiás', value: 'GO' },
  { label: 'Maranhão', value: 'MA' },
  { label: 'Mato Grosso', value: 'MT' },
  { label: 'Mato Grosso do Sul', value: 'MS' },
  { label: 'Minas Gerais', value: 'MG' },
  { label: 'Pará', value: 'PA' },
  { label: 'Paraíba', value: 'PB' },
  { label: 'Paraná', value: 'PR' },
  { label: 'Pernambuco', value: 'PE' },
  { label: 'Piauí', value: 'PI' },
  { label: 'Roraima', value: 'RR' },
  { label: 'Rondônia', value: 'RO' },
  { label: 'Rio de Janeiro', value: 'RJ' },
  { label: 'Rio Grande do Norte', value: 'RN' },
  { label: 'Rio Grande do Sul', value: 'RS' },
  { label: 'Santa Catarina', value: 'SC' },
  { label: 'São Paulo', value: 'SP' },
  { label: 'Sergipe', value: 'SE' },
  { label: 'Tocantins', value: 'TO' },
] as const

// Official Documentation: https://pagbrasil.atlassian.net/wiki/spaces/PBDocs/pages/98666330/4.+Managing+a+payee#4.e
// Type of the payee's account. "1" = Checking (conta corrente) or "2" = Savings (poupança).
export const BANK_ACCOUNT_TYPE_BR = [
  {
    label: 'kycV3Details.bank_details_dropdown.checking',
    value: '1',
  },
  {
    label: 'kycV3Details.bank_details_dropdown.saving',
    value: '2',
  },
] as const

// Official Documentation: https://www.bcb.gov.br/Fis/CODCOMPE/Tabela.pdf
// New updated Link: https://www2.nuclea.com.br/Monitoramento/Institui%C3%A7%C3%B5es%20Emissoras%20e%20Recebedoras%20de%20DOC%20e%20COB.pdf
export const BANK_ACCOUNT_NUMBERS_BR = [
  { value: '001', label: 'Banco do Brasil S.A.' },
  { value: '003', label: 'Banco da Amazônia S.A.' },
  { value: '004', label: 'Banco do Nordeste do Brasil S.A.' },
  { value: '007', label: 'Banco Nacional do Desenvolvimento Economico Social' },
  { value: '008', label: 'Banco do estado de São Paulo S.A.' },
  { value: '010', label: 'Credicoamo Crédito Rural Cooperativa' },
  {
    value: '011',
    label: 'Credit Suisse Hedging-Griffo Corretora de Valores S.A.',
  },
  { value: '012', label: 'Banco Standard de Investimentos S.A.' },
  {
    value: '013',
    label: 'Senso Corretora de Câmbio e Valores Mobiliários S.A.',
  },
  { value: '014', label: 'Natixis Brasil S.A. Banco Múltiplo' },
  {
    value: '015',
    label: 'UBS Brasil Corretora de Câmbio, Títulos e Valores Mobiliários S.A.',
  },
  {
    value: '016',
    label:
      'Coop de Créd. Mútuo dos Despachantes de Trânsito de SC e Região Metrop. de PA/RS',
  },
  { value: '017', label: 'BNY Mellon Banco S.A.' },
  { value: '018', label: 'Banco Tricury S.A.' },
  { value: '019', label: 'Banco Azteca do Brasil S.A.' },
  { value: '021', label: 'Banestes S.A. Banco do Estado do Espírito Santo' },
  { value: '024', label: 'Banco Bandepe S.A.' },
  { value: '025', label: 'Banco Alfa S.A.' },
  { value: '027', label: 'Banco do Estado de Santa Catarina S.A.' },
  { value: '028', label: 'Banco do Estado da Bahia' },
  { value: '029', label: 'Banco Itaú BMG Consignado S.A.' },
  { value: '030', label: 'Banco da Paraiba S.A.' },
  { value: '031', label: 'Banco BEG S.A.' },
  { value: '033', label: 'Banco Santander (Brasil) S.A.' },
  { value: '034', label: 'Banco BEA S.A.' },
  { value: '035', label: 'Banco BEC S.A.' },
  { value: '036', label: 'Banco Bradesco BBI S.A.' },
  { value: '037', label: 'Banco do Estado do Pará S.A.' },
  { value: '038', label: 'Banco Banestado S.A.' },
  { value: '039', label: 'Banco do Estado do Piaui S.A.' },
  { value: '040', label: 'Banco Cargill S.A.' },
  { value: '041', label: 'Banco do Estado do Rio Grande do Sul S.A.' },
  { value: '044', label: 'Banco BVA S.A.' },
  { value: '045', label: 'Banco Opportunity S.A.' },
  { value: '047', label: 'Banco do Estado de Sergipe S.A.' },
  { value: '048', label: 'Banco BEMGE S.A.' },
  { value: '060', label: 'Confidence Corretora de Câmbio S.A.' },
  { value: '061', label: 'Banco ABB S.A.' },
  { value: '062', label: 'Hipercard Banco Múltiplo S.A.' },
  { value: '063', label: 'Banco Bradescard S.A.' },
  { value: '064', label: 'Goldman Sachs do Brasil Banco Múltiplo S. A.' },
  { value: '065', label: 'Banco AndBank (Brasil) S.A.' },
  { value: '066', label: 'Banco Morgan Stanley S. A.' },
  { value: '067', label: 'Banco Baneb S.A.' },
  { value: '068', label: 'Banco BEA S.A.' },
  { value: '069', label: 'Banco Crefisa S.A.' },
  { value: '070', label: 'Banco de Brasília S.A.' },
  { value: '072', label: 'Banco Mais S.A.' },
  { value: '073', label: 'Banco Popular do Brasil S.A.' },
  { value: '074', label: 'Banco J. Safra S.A.' },
  { value: '075', label: 'Banco ABN AMRO S.A.' },
  { value: '076', label: 'Banco KDB do Brasil S.A.' },
  { value: '077', label: 'Banco Inter S.A.' },
  {
    value: '078',
    label: 'BES Investimento do Brasil S.A - Banco de Investimento',
  },
  { value: '079', label: 'Banco Original do Agronegócio S.A.' },
  { value: '080', label: 'BT Associados Corretora de Câmbio Ltda' },
  { value: '082', label: 'Banco Topázio S.A.' },
  { value: '083', label: 'Banco da China Brasil S.A.' },
  { value: '084', label: 'Sisprime do Brasil - Cooperativa de Crédito' },
  { value: '085', label: 'Cooperativa Central de Crédito - Ailos' },
  { value: '086', label: 'OBOE Credito, Financiamento e Investimento S.A.' },
  {
    value: '087',
    label:
      'Cooperativa Central de Economia e Crédito Mútuo das Unicred’s de Santa Catarina Ltda. - Unicred Central SC/PR',
  },
  { value: '088', label: 'Banco Randon S.A.' },
  { value: '089', label: 'Cooperativa de Crédito Rural da Região da Mogiana' },
  {
    value: '090',
    label: 'Cooperativa Central de Economia e Crédito Mútuo - Sicoob Unimais',
  },
  {
    value: '091',
    label:
      'Central de Cooperativas de Economia e Crédito Mútuo do Est RS - Unicred',
  },
  {
    value: '092',
    label: 'Brickell S.A. Crédito, Financiamento e Investimento',
  },
  {
    value: '093',
    label:
      'Polocred Sociedade de Crédito ao Microempreendedor e à Empresa de Pequeno Porte Ltda',
  },
  { value: '094', label: 'Banco Finaxis S.A.' },
  { value: '095', label: 'Travelex Banco de Câmbio S.A.' },
  {
    value: '096',
    label: 'Banco BMFBovespa de Serviços de Liquidação e Custódia S.A.',
  },
  { value: '097', label: 'Central de Cooperativas de Crédito Ltda' },
  { value: '098', label: 'Credialiança Cooperativa de Crédito Rural' },
  {
    value: '099',
    label:
      'Uniprime Central – Central Interestadual de Cooperativas de Crédito',
  },
  { value: '100', label: 'Planner Corretora de Valores S.A.' },
  {
    value: '101',
    label: 'Renascença Distribuidora de Títulos e Valores Mobiliários Ltda',
  },
  {
    value: '102',
    label:
      'XP Investimentos Corretora de Câmbio Títulos e Valores Mobiliários S.A.',
  },
  { value: '103', label: 'EBS Capital Corretora de Cambio S.A.' },
  { value: '104', label: 'Caixa Econômica Federal' },
  { value: '105', label: 'Lecca Crédito, Financiamento e Investimento S.A.' },
  { value: '106', label: 'Banco Itabanco S.A.' },
  { value: '107', label: 'Banco Bocom BBM S.A.' },
  {
    value: '108',
    label: 'PortoCred S.A. Crédito, Financiamento e Investimento',
  },
  { value: '109', label: 'Credibanco S.A.' },
  {
    value: '111',
    label: 'Oliveira Trust Distribuidora de Títulos e Valores Mobiliários S.A.',
  },
  {
    value: '112',
    label: 'Central das Cooperativas de Crédito do Brasil Central',
  },
  {
    value: '113',
    label: 'Magliano S.A. Corretora de Cambio e Valores Mobiliarios',
  },
  {
    value: '114',
    label:
      'Central das Cooperativas de Economia e Crédito Mútuo do Estado do Espírito Santo',
  },
  { value: '115', label: 'Rotula Credito, Financiamento e Investimentos S.A.' },
  { value: '116', label: 'Banco Unico S.A.' },
  { value: '117', label: 'Advanced Corretora de Câmbio Ltda' },
  {
    value: '118',
    label: 'Standard Chartered Bank (Brasil) S.A. Banco de Investimento',
  },
  { value: '119', label: 'Banco Western Union do Brasil S.A.' },
  { value: '120', label: 'Banco Rodobens S.A.' },
  { value: '121', label: 'Banco Agibank S.A.' },
  { value: '122', label: 'Banco Bradesco BERJ S.A.' },
  { value: '123', label: 'Agiplan Financeira S.A.' },
  { value: '124', label: 'Banco Woori Bank do Brasil S.A.' },
  { value: '125', label: 'Banco Genial S.A.' },
  { value: '126', label: 'BR Partners Banco de Investimento S.A.' },
  { value: '127', label: 'Codepe - Corretora de Valores S.A.' },
  {
    value: '130',
    label: 'Caruana S.A. Sociedade de Crédito, Financiamento e Investimento',
  },
  {
    value: '131',
    label: 'Tullett Prebon Brasil S.A. Corretora de Valores e Câmbio',
  },
  { value: '132', label: 'ICBC do Brasil Banco Múltiplo S.A.' },
  {
    value: '136',
    label:
      'Confederação Nacional das Cooperativas Centrais Unicred Ltda - Unicred do Brasil',
  },
  { value: '148', label: 'Bank of America Brasil S.A.' },
  { value: '151', label: 'Banco Nossa Caixa S.A.' },
  { value: '168', label: 'HSBC Investiment Bank Brasil S.A.' },
  { value: '174', label: 'Pefisa S.A.' },
  { value: '175', label: 'Banco Finasa S.A.' },
  { value: '182', label: 'Dacasa Financeira S.A.' },
  { value: '184', label: 'Banco Itaú BBA S.A.' },
  { value: '200', label: 'Banco Ficrisa Axelrud S.A.' },
  { value: '204', label: 'Banco Bradesco Cartões S.A.' },
  { value: '208', label: 'Banco BTG Pactual S.A.' },
  { value: '210', label: 'Dresdner Bank S.A.' },
  { value: '211', label: 'Banco Sistema S.A.' },
  { value: '212', label: 'Banco Original S.A.' },
  { value: '213', label: 'Banco Arbi S.A.' },
  { value: '214', label: 'Banco Dibens S.A.' },
  { value: '215', label: 'Banco Comercial de Investimento Sudameris S.A.' },
  { value: '216', label: 'Banco Regional Malcon S.A.' },
  { value: '217', label: 'Banco John Deere S.A.' },
  { value: '218', label: 'Banco BS2 S.A.' },
  { value: '219', label: 'Banco Zogbi S.A.' },
  { value: '222', label: 'Banco Credit Agrícole Brasil S.A.' },
  { value: '224', label: 'Banco Fibra S.A.' },
  { value: '225', label: 'Banco Brascan S.A.' },
  { value: '229', label: 'Banco Cruzeiro do Sul S.A.' },
  { value: '231', label: 'Banco Boavista Interatlantico S.A.' },
  { value: '233', label: 'Banco Cifra S.A.' },
  { value: '235', label: 'Bank of America Liberal S.A.' },
  { value: '237', label: 'Banco Bradesco S.A.' },
  { value: '240', label: 'Banco de Credito Real de Minas Gerais S.A.' },
  { value: '241', label: 'Banco Clássico S.A.' },
  { value: '242', label: 'Banco Euroinvest S.A.' },
  { value: '243', label: 'Banco Master S.A.' },
  { value: '244', label: 'Banco Cidade S.A.' },
  { value: '246', label: 'Banco ABC Brasil S.A.' },
  { value: '247', label: 'Banco UBS S.A.' },
  { value: '248', label: 'Banco Boavista Interatlântico S.A.' },
  { value: '249', label: 'Banco Investcred Unibanco S.A.' },
  { value: '250', label: 'BCV - Banco de Crédito e Varejo S.A.' },
  { value: '252', label: 'Banco Fininvest S.A.' },
  { value: '254', label: 'Parana Banco S.A.' },
  { value: '258', label: 'Banco Induscred S.A.' },
  { value: '260', label: 'NU Pagamentos S.A.' },
  { value: '262', label: 'Banco Boreal S.A.' },
  { value: '263', label: 'Banco Cacique S.A.' },
  { value: '265', label: 'Banco Fator S.A.' },
  { value: '266', label: 'Banco Cédula S.A.' },
  { value: '269', label: 'Banco HSBC S.A.' },
  { value: '275', label: 'Banco Real S.A.' },
  { value: '291', label: 'Banco BCN S.A.' },
  { value: '300', label: 'Banco de la Nacion Argentina' },
  { value: '318', label: 'Banco BMG S.A.' },
  { value: '320', label: 'Bank Of China (Brasil) Banco Múltiplo S/A' },
  {
    value: '330',
    label: 'Banco Barigui de Investimentos e Financiamentos S.A.',
  },
  { value: '341', label: 'Itaú Unibanco S.A.' },
  { value: '347', label: 'Banco Sudameris do Brasil S.A.' },
  { value: '351', label: 'Banco Santander S.A.' },
  { value: '353', label: 'Banco Santander Brasil S.A.' },
  { value: '356', label: 'Banco ABN Amro Real S.A.' },
  { value: '366', label: 'Banco Société Générale Brasil S.A.' },
  { value: '370', label: 'Banco Mizuho do Brasil S.A.' },
  { value: '376', label: 'Banco J. P. Morgan S.A.' },
  { value: '389', label: 'Banco Mercantil do Brasil S.A.' },
  { value: '392', label: 'Banco Mercantil de São Paulo S.A.' },
  { value: '394', label: 'Banco Bradesco Financiamentos S.A.' },
  { value: '399', label: 'Kirton Bank S.A. – Banco Múltiplo' },
  { value: '409', label: 'Unibanco-União de Bancos Brasileiros S.A.' },
  { value: '412', label: 'Social Bank Banco Múltiplo S.A' },
  { value: '415', label: 'Banco Nacional S.A.' },
  { value: '422', label: 'Banco Safra S.A.' },
  { value: '424', label: 'Banco Santander Noroeste S.A.' },
  { value: '453', label: 'Banco Rural S.A.' },
  { value: '456', label: 'Banco de Tokyo-Mitsubishi UFJ Brasil S.A.' },
  { value: '464', label: 'Banco Sumitomo Mitsui Brasileiro S.A.' },
  { value: '472', label: 'LLOYDS TSB Bank PLC' },
  { value: '473', label: 'Banco Caixa Geral - Brasil S.A.' },
  { value: '477', label: 'Citibank N.A.' },
  { value: '479', label: 'Banco ItauBank S.A.' },
  { value: '480', label: 'Banco Wachovia S.A.' },
  { value: '487', label: 'Deutsche Bank S.A.' },
  { value: '488', label: 'JPMorgan Chase Bank National Association' },
  { value: '492', label: 'ING Bank N.V.' },
  { value: '493', label: 'Banco Union Brasil S.A.' },
  { value: '494', label: 'Banco de La Republica Oriental del Uruguay' },
  { value: '495', label: 'Banco de La Provincia de Buenos Aires' },
  { value: '496', label: 'Banco Uno Brasil S.A.' },
  { value: '505', label: 'Banco Credit Suisse (Brasil) S.A.' },
  { value: '600', label: 'Banco Luso Brasileiro S.A.' },
  { value: '604', label: 'Banco Industrial do Brasil S.A.' },
  { value: '610', label: 'Banco VR S.A.' },
  { value: '611', label: 'Banco Paulista S.A.' },
  { value: '612', label: 'Banco Guanabara S.A.' },
  { value: '613', label: 'Banco Pecúnia S. A.' },
  { value: '623', label: 'Banco Pan S.A.' },
  { value: '630', label: 'Banco Letsbank S.A.' },
  { value: '633', label: 'Banco Rendimento S.A.' },
  { value: '634', label: 'Banco Triângulo S.A.' },
  { value: '637', label: 'Banco Sofisa S. A.' },
  { value: '638', label: 'Banco Prosper S.A.' },
  { value: '641', label: 'Banco Alvorada S.A.' },
  { value: '643', label: 'Banco Pine S.A.' },
  { value: '650', label: 'Banco PEBB S.A.' },
  { value: '652', label: 'Itaú Unibanco Holding S.A.' },
  { value: '653', label: 'Banco Voiter S. A.' },
  { value: '654', label: 'Banco Digimais S.A.' },
  { value: '655', label: 'Banco Votorantim S.A.' },
  { value: '702', label: 'Banco Santos S.A.' },
  { value: '707', label: 'Banco Daycoval S.A.' },
  { value: '719', label: 'Banif - Bco Internacional do Funchal (Brasil) S.A.' },
  { value: '721', label: 'Credibel Participações S.A.' },
  { value: '725', label: 'Banco Finansinos S.A.' },
  { value: '733', label: 'Banco das Nações S.A.' },
  { value: '734', label: 'Banco Gerdau S.A.' },
  { value: '735', label: 'Banco Neon S.A.' },
  { value: '738', label: 'Banco Morada S.A.' },
  { value: '740', label: 'Banco Barclays S.A.' },
  { value: '741', label: 'Banco Ribeirão Preto S.A.' },
  { value: '743', label: 'Banco Semear S.A.' },
  { value: '744', label: 'BankBoston S.A.' },
  { value: '745', label: 'Banco Citibank S.A.' },
  { value: '746', label: 'Banco Modal S.A.' },
  { value: '747', label: 'Banco Rabobank International Brasil S.A.' },
  { value: '748', label: 'Banco Cooperativo Sicredi S. A.' },
  { value: '749', label: 'Banco Simples S.A.' },
  { value: '751', label: 'Scotiabank Brasil S.A. Banco Múltiplo' },
  { value: '752', label: 'Banco BNP Paribas Brasil S.A.' },
  { value: '753', label: 'Novo Banco Continental S.A.' },
  { value: '755', label: 'Bank of America Merrill Lynch Banco Múltiplo S.A.' },
  { value: '756', label: 'Banco Cooperativo Sicoob S.A -Banco Sicoob' },
  { value: '757', label: 'Banco Keb Hana do Brasil S.A.' },
  { value: '169', label: 'Banco Olé Bonsucesso Consignado S.A.' },
  { value: '128', label: 'Braza Bank S.A. Banco de Câmbio' },
  { value: '299', label: 'Banco Afinz S.A. – Banco Múltiplo' },
  { value: '279', label: 'Cooperativa de Crédito Rural de Primavera do Leste' },
  {
    value: '133',
    label:
      'Confederação Nacional das Cooperativas Centrais de Crédito e Economia - Cresol',
  },
  { value: '336', label: 'Banco C6 S.A.' },
  {
    value: '159',
    label: 'Casa do Crédito S.A. Sociedade de Crédito ao Microempreendedor',
  },
  {
    value: '190',
    label:
      'Servicoop - Cooperativa de Crédito dos Servidores Públicos Estaduais e Municipais do Rio Grande do Sul',
  },
  { value: '323', label: 'MercadoPago.com Representações LTDA' },
  {
    value: '280',
    label: 'Will Financeira S.A. Credito Financiamento e Investimento',
  },
  { value: '301', label: 'Dock Instituição de Pagamento S.A.' },
  { value: '197', label: 'Stone Pagamentos S.A.' },
  {
    value: '274',
    label:
      'Money Plus Sociedade de Crédito ao Micro. e à Empresa de Pequeno Porte Ltda',
  },
  { value: '329', label: 'QI Sociedade de Crédito Direto S.A.' },
  { value: '364', label: 'Efí S.A.' },
  { value: '368', label: 'Banco CSF S.A.' },
  { value: '281', label: 'Cooperativa de Crédito Rural Coopavel' },
  {
    value: '322',
    label: 'Cooperativa de Crédito Rural de Abelardo Luz - Sulcredi/Crediluz',
  },
  { value: '383', label: 'Ebanx Instituição de Pagamentos Ltda' },
  { value: '332', label: 'Acesso Soluções de Pagamento S.A.' },
  { value: '387', label: 'Banco Toyota Do Brasil S.A.' },
  { value: '428', label: 'Cred-System Sociedade de Crédito Direto S.A.' },
  { value: '393', label: 'Banco Volkswagen S.A' },
  // { value: '012', label: 'Banco Inbursa S.A.' },
  { value: '326', label: 'Parati Crédito Financiamento e Investimento S/A' },
  { value: '359', label: 'Zema Crédito Financiamento e Investimento S.A.' },
  { value: '421', label: 'Lar Cooperativa de Crédito - Lar Credi' },
  {
    value: '411',
    label: 'Via Certa Financiadora S.A - Crédito, Financiamento e Investimento',
  },
  { value: '081', label: 'BancoSeguro S.A.' },
  { value: '450', label: 'Fitbank Instituição de Pagamentos Eletrônicos S.A' },
  { value: '413', label: 'Banco BV S.A.' },
  { value: '435', label: 'Delcred Sociedade de Crédito Direto' },
  { value: '406', label: 'Accredito Sociedade de Crédito Direto S.A.' },
  { value: '324', label: 'Cartos Sociedade de Crédito Direto S.A.' },
  { value: '460', label: 'Unavanti Sociedade de Crédito S.A.' },
  { value: '425', label: 'Socinal S.A.' },
  { value: '276', label: 'Banco Senff S.A' },
  { value: '401', label: 'Iugu Serviços da Internet' },
  { value: '380', label: 'Picpay Instituição de Pagamento S.A.' },
  { value: '481', label: 'Superlógica Sociedade de Crédito Direto S/A.' },
  { value: '457', label: 'UY3 Sociedade de Credito Direto S/A' },
  { value: '449', label: 'DM Sociedade de Crédito Direto S.A.' },
  {
    value: '461',
    label: 'ASAAS GESTÃO FINANCEIRA INSTITUIÇÃO DE PAGAMENTO S.A.',
  },
  { value: '439', label: 'ID CORRETORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A' },
  {
    value: '478',
    label: 'Gazincred S.A. Sociedade de Crédito, Financiamento e Investimento',
  },
  {
    value: '463',
    label: 'Azumi Dustribuidora de Títulos e Valores Mobiliários Ltda',
  },
  {
    value: '310',
    label: 'VÓRTX DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA',
  },
  { value: '511', label: 'MAGNUM - SOCIEDADE DE CRÉDITO DIRETO S.A' },
  { value: '509', label: 'Celcoin Instituião de Pagamento S.A' },
  { value: '475', label: 'Banco Yamaha Motor do Brasil S.A.' },
  {
    value: '403',
    label: 'Cora Sociedade de Crédito, Financiamento e Investimento S.A.',
  },
  { value: '530', label: 'Ser Finance Sociedade de Crédito Direto S.A.' },
  { value: '523', label: 'HR Digital Sociedade de Crédito Direto S.A.' },
  { value: '429', label: 'Crediare SA CFI' },
  // {
  //   value: '093',
  //   label:
  //     'POLOCRED – Sociedade de Crédito ao Microempreendedor e a Empresa de Pequeno Porte Ltda',
  // },
  { value: '529', label: 'Pinbank Brasil Instituição de Pagamentos S.A' },
  {
    value: '528',
    label: 'Reag Trust Distribuidora de Títulos e Valores Mobiliários S.A.',
  },
  { value: '594', label: 'ASA SOCIEDADE DE CRÉDITO DIRETO S.A.' },
  { value: '559', label: 'KANASTRA SOCIEDADE DE CREDITO DIRETO S.A.' },
  { value: '513', label: 'ATF Sociedade de Crédito Direto S.A' },
  { value: '348', label: 'BANCO XP S.A' },
  { value: '419', label: 'NUMBRS SOCIEDADE DE CREDITO DIRETO S A' },
  { value: '547', label: 'BNK DIGITAL SOCIEDADE DE CRÉDITO DIRETO S.A' },
  { value: '531', label: 'BMP SOCIEDADE DE CRÉDITO DIRETO S.A' },
  // { value: '531', label: 'HBI SOCIEDADE DE CRÉDITO DIRETO S/A.' },
  { value: '536', label: 'NEON PAGAMENTOS S.A' },
  // { value: '079', label: 'PICPAY BANK BANCO MULTIPLO S.A' },
  { value: '482', label: 'SBCASH SOCIEDADE DE CRÉDITO DIRETO S.A' },
  { value: '410', label: 'PLANNER SOCIEDADE DE CRÉDITO DIRETO S.A.' },
] as const
