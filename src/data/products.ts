
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
  material?: string;
  threadType?: string;
  color?: string;
  region?: string;
  certification?: string;
}

export const products: Product[] = [
  // Joias de Titânio
  {
    id: 1,
    name: 'Argola Segmento Cravejado',
    description: 'Argola com segmento removível cravejada com zircônias',
    price: 89.90,
    supplier: 'Piercing Gold Brasil',
    category: 'joias-titanio',
    productType: 'argola',
    brand: 'Premium Line',
    size: '10mm',
    stock: 150,
    availability: 'pronta-entrega',
    image: '/placeholder.svg',
    sku: 'PGB-ARG001',
    technicalDescription: 'Titânio G23 ASTM F136. Zircônias cravadas à mão.',
    deliveryTime: '24-48h',
    material: 'Titânio',
    threadType: 'Externa',
    color: 'Natural',
    region: 'Norte',
    certification: 'G23 ASTM F136'
  },
  {
    id: 2,
    name: 'Labret Titânio PVD Gold',
    description: 'Labret com acabamento PVD dourado premium',
    price: 55.00,
    supplier: 'Top Piercing Suppliers',
    category: 'joias-titanio',
    productType: 'labret',
    brand: 'Gold Line',
    size: '8mm',
    stock: 200,
    availability: 'pronta-entrega',
    image: '/placeholder.svg',
    sku: 'TPS-LAB002',
    technicalDescription: 'Titânio G23 com revestimento PVD ouro 18k.',
    deliveryTime: '24-48h',
    material: 'Titânio',
    threadType: 'Interna',
    color: 'Dourado',
    region: 'Sudeste',
    certification: 'PVD GOLD'
  },
  {
    id: 3,
    name: 'Barbell Curvo Titânio',
    description: 'Barbell curvo em titânio grau cirúrgico',
    price: 45.00,
    supplier: 'Gemas e Piercings',
    category: 'joias-titanio',
    productType: 'barbell',
    brand: 'Surgical Grade',
    size: '12mm',
    stock: 180,
    availability: 'pronta-entrega',
    image: '/placeholder.svg',
    sku: 'GP-BAR003',
    technicalDescription: 'Curvatura anatômica. Rosca interna.',
    deliveryTime: '48-72h',
    material: 'Titânio',
    threadType: 'Interna',
    color: 'Natural',
    region: 'Centro-Oeste',
    certification: 'G23 ASTM F136'
  },
  // Joias de Ouro
  {
    id: 4,
    name: 'Esferas Rosca Interna Ouro 18k',
    description: 'Par de esferas em ouro 18k com rosca interna',
    price: 280.00,
    supplier: 'Elite Joias Pro',
    category: 'joias-ouro',
    productType: 'esferas',
    brand: 'Gold Premium',
    size: '4mm',
    stock: 50,
    availability: 'sob-encomenda',
    image: '/placeholder.svg',
    sku: 'EJP-ESF004',
    technicalDescription: 'Ouro 18k maciço. Rosca compatível com titânio.',
    deliveryTime: '7-10 dias',
    material: 'Ouro 18k',
    threadType: 'Interna',
    color: 'Dourado',
    region: 'Sudeste',
    certification: 'AU 750'
  },
  {
    id: 5,
    name: 'Argola Ouro Rosé 14k',
    description: 'Argola em ouro rosé 14k com fechamento suave',
    price: 450.00,
    supplier: 'Joias Premium Ltda',
    category: 'joias-ouro',
    productType: 'argola',
    brand: 'Rosé Collection',
    size: '12mm',
    stock: 25,
    availability: 'sob-encomenda',
    image: '/placeholder.svg',
    sku: 'JPL-ARG005',
    technicalDescription: 'Ouro 14k rosé. Polimento espelhado.',
    deliveryTime: '10-15 dias',
    material: 'Ouro 14k',
    threadType: 'Clicker',
    color: 'Rosé',
    region: 'Sul',
    certification: 'AU 585'
  },
  // Insumos Estéreis
  {
    id: 6,
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
    deliveryTime: '24-48h',
    region: 'Nacional'
  },
  {
    id: 7,
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
    deliveryTime: '24-48h',
    region: 'Nacional'
  },
  // Equipamentos
  {
    id: 8,
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
    deliveryTime: '7-10 dias',
    region: 'Nacional'
  },
  {
    id: 9,
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
    deliveryTime: '3-5 dias',
    region: 'Nacional'
  },
  {
    id: 10,
    name: 'Labret Ouro Branco 18k Premium',
    description: 'Labret em ouro branco 18k com acabamento premium',
    price: 380.00,
    supplier: 'Elite Joias Pro',
    category: 'joias-ouro',
    productType: 'labret',
    brand: 'White Gold Line',
    size: '6mm',
    stock: 30,
    availability: 'sob-encomenda',
    image: '/placeholder.svg',
    sku: 'EJP-LAB006',
    technicalDescription: 'Ouro branco 18k. Rosca interna premium.',
    deliveryTime: '7-12 dias',
    material: 'Ouro 18k',
    threadType: 'Interna',
    color: 'Branco',
    region: 'Sudeste',
    certification: 'AU 750'
  }
];

export const suppliers = [...new Set(products.map(p => p.supplier))];
export const categories = [...new Set(products.map(p => p.category))];
export const productTypes = [...new Set(products.map(p => p.productType))];
export const brands = [...new Set(products.map(p => p.brand))];
export const availabilities = [...new Set(products.map(p => p.availability))];
export const materials = [...new Set(products.map(p => p.material).filter(Boolean))];
export const threadTypes = [...new Set(products.map(p => p.threadType).filter(Boolean))];
export const colors = [...new Set(products.map(p => p.color).filter(Boolean))];
export const regions = [...new Set(products.map(p => p.region).filter(Boolean))];
