
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  supplier: string;
  category: string;
  productType: string;
  brand: string;
  size?: string;
  stock: number;
  availability: 'pronta-entrega' | 'sob-encomenda';
  image: string;
  sku: string;
  technicalDescription?: string;
  deliveryTime?: string;
}

export const products: Product[] = [
  // Insumos Estéreis
  {
    id: 1,
    name: 'Luvas Nitrílicas Extra Fortes',
    description: 'Luvas nitrílicas sem pó, extra resistentes para procedimentos de body piercing',
    price: 89.90,
    supplier: 'BioSafe Hospitalar',
    category: 'insumos-estereis',
    productType: 'luvas',
    brand: 'MedProtect',
    size: 'P/M/G',
    stock: 500,
    availability: 'pronta-entrega',
    image: '/placeholder.svg',
    sku: 'BSH-LUV001',
    technicalDescription: 'Caixa com 100 unidades. Material: Nitrilo sintético. Livre de látex.',
    deliveryTime: '24-48h'
  },
  {
    id: 2,
    name: 'Máscaras Cirúrgicas Tripla Camada',
    description: 'Máscaras descartáveis com tripla camada de proteção bacteriológica',
    price: 45.00,
    supplier: 'BioSafe Hospitalar',
    category: 'insumos-estereis',
    productType: 'mascaras',
    brand: 'SafeMask',
    stock: 300,
    availability: 'pronta-entrega',
    image: '/placeholder.svg',
    sku: 'BSH-MSC002',
    technicalDescription: 'Caixa com 50 unidades. Filtração > 95%. Elástico macio.',
    deliveryTime: '24-48h'
  },
  {
    id: 3,
    name: 'Agulhas Cânula Estéreis 14G',
    description: 'Agulhas cânula descartáveis estéreis para body piercing profissional',
    price: 3.50,
    supplier: 'SafeNeedle',
    category: 'insumos-estereis',
    productType: 'agulhas',
    brand: 'PierceSharp',
    size: '14G',
    stock: 1000,
    availability: 'pronta-entrega',
    image: '/placeholder.svg',
    sku: 'SN-AG14G',
    technicalDescription: 'Unidade individual esterilizada. Aço cirúrgico 316L. Ponta tripla bisel.',
    deliveryTime: '24-48h'
  },
  {
    id: 4,
    name: 'Campo Cirúrgico Descartável',
    description: 'Campo cirúrgico estéril com abertura central para procedimentos',
    price: 12.90,
    supplier: 'Dermaclinic Distribuidora',
    category: 'insumos-estereis',
    productType: 'campos-cirurgicos',
    brand: 'SterileField',
    stock: 200,
    availability: 'pronta-entrega',
    image: '/placeholder.svg',
    sku: 'DD-CC001',
    technicalDescription: 'TNT 40g/m². Abertura 6cm. Adesivo hipoalergênico.',
    deliveryTime: '48-72h'
  },
  {
    id: 5,
    name: 'Sabonete Antisséptico Degermante',
    description: 'Sabonete líquido antisséptico com clorexidina para preparo da pele',
    price: 34.90,
    supplier: 'Dermaclinic Distribuidora',
    category: 'insumos-estereis',
    productType: 'antisepticos',
    brand: 'DermaClean',
    size: '500ml',
    stock: 150,
    availability: 'pronta-entrega',
    image: '/placeholder.svg',
    sku: 'DD-SAB500',
    technicalDescription: 'Clorexidina 2%. pH neutro. Frasco com bico dosador.',
    deliveryTime: '48-72h'
  },
  // Equipamentos
  {
    id: 6,
    name: 'Autoclave Digital 12L',
    description: 'Autoclave digital microprocessada para esterilização completa',
    price: 2890.00,
    supplier: 'PiercePro Equipamentos',
    category: 'equipamentos',
    productType: 'autoclaves',
    brand: 'SteriliMax',
    size: '12L',
    stock: 8,
    availability: 'sob-encomenda',
    image: '/placeholder.svg',
    sku: 'PPE-AUT12',
    technicalDescription: 'Câmara inox 316L. Ciclo rápido 15min. Display digital. Bivolt.',
    deliveryTime: '7-10 dias'
  },
  {
    id: 7,
    name: 'Cuba Ultrassônica Profissional',
    description: 'Cuba ultrassônica para limpeza e desinfecção de instrumentos',
    price: 890.00,
    supplier: 'PiercePro Equipamentos',
    category: 'equipamentos',
    productType: 'cubas-ultrassonicas',
    brand: 'UltraClean',
    size: '3L',
    stock: 15,
    availability: 'pronta-entrega',
    image: '/placeholder.svg',
    sku: 'PPE-CUB03',
    technicalDescription: 'Frequência 40kHz. Timer digital. Cesto inox incluso.',
    deliveryTime: '3-5 dias'
  },
  {
    id: 8,
    name: 'Maca Hidráulica Regulável',
    description: 'Maca hidráulica com regulagem de altura para procedimentos',
    price: 3450.00,
    supplier: 'MacaFlex',
    category: 'equipamentos',
    productType: 'macas',
    brand: 'FlexComfort',
    stock: 5,
    availability: 'sob-encomenda',
    image: '/placeholder.svg',
    sku: 'MF-MAC001',
    technicalDescription: 'Estrutura aço carbono. Estofado PVC antialérgico. Carga 150kg.',
    deliveryTime: '10-15 dias'
  },
  {
    id: 9,
    name: 'Seladora Térmica para Esterilização',
    description: 'Seladora térmica para embalagens de esterilização',
    price: 680.00,
    supplier: 'PiercePro Equipamentos',
    category: 'equipamentos',
    productType: 'seladoras',
    brand: 'SealPro',
    stock: 12,
    availability: 'pronta-entrega',
    image: '/placeholder.svg',
    sku: 'PPE-SEL001',
    technicalDescription: 'Largura 30cm. Temperatura regulável. Led indicador.',
    deliveryTime: '3-5 dias'
  },
  {
    id: 10,
    name: 'Swabs Estéreis Algodão',
    description: 'Hastes flexíveis com algodão estéril para limpeza',
    price: 18.90,
    supplier: 'Dermaclinic Distribuidora',
    category: 'insumos-estereis',
    productType: 'swabs',
    brand: 'CottonSafe',
    stock: 400,
    availability: 'pronta-entrega',
    image: '/placeholder.svg',
    sku: 'DD-SWB100',
    technicalDescription: 'Pacote 100 unidades. Haste plástica flexível. 100% algodão.',
    deliveryTime: '48-72h'
  }
];

export const suppliers = [...new Set(products.map(p => p.supplier))];
export const categories = [...new Set(products.map(p => p.category))];
export const productTypes = [...new Set(products.map(p => p.productType))];
export const brands = [...new Set(products.map(p => p.brand))];
export const availabilities = [...new Set(products.map(p => p.availability))];
