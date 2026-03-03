export interface BrandCTA {
  label: string
  href: string
  variant: 'primary' | 'secondary'
}

export interface Brand {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  longDescription: string
  email: string
  image: string | null
  icon: string
  color: string
  ctaButtons: BrandCTA[]
  featured: boolean
  category: string
}

const brands: Brand[] = [
  {
    id: 'antrias-academy',
    slug: 'antrias-academy',
    name: "Antria's Academy",
    tagline: 'Custom Kids Songs & Music',
    description:
      'AI-powered custom children\u2019s song creation\u2014educational, fun, and made just for your little ones. Listen on YouTube & Spotify.',
    longDescription:
      "Antria's Academy creates custom children\u2019s songs powered by AI that educate, inspire, and bring joy to little ones everywhere. Every song is designed with love, learning, and creativity in mind. Follow us on YouTube and Spotify to hear our latest releases and create your own personalized kids song today.",
    email: 'AntriasAcademy@CyberAdSpace.com',
    image: null,
    icon: 'Sparkles',
    color: 'from-pink-500/20 to-purple-500/20',
    ctaButtons: [
      { label: 'Create a Kids Song', href: '/kids-song', variant: 'primary' },
          { label: 'Listen on YouTube', href: 'https://www.youtube.com/@antriasacademy', variant: 'secondary' },
        ],
        featured: true,
        category: 'Music & Education',
  },
  {
    id: 'bam-casas',
    slug: 'bam-casas',
    name: 'BAM Casas',
    tagline: 'Property Management & Maintenance',
    description:
      'Your trusted local partner for property management, maintenance, and real estate services across Florida.',
    longDescription:
      'BAM Casas is the backbone of property care in Florida. From routine maintenance and emergency repairs to full property management, we handle it all so you don\u2019t have to. Our team is local, reliable, and just a message away. Whether you own one rental or a portfolio, BAM Casas keeps your properties running smooth.',
    email: 'BAMCasas@CyberAdSpace.com',
    image: null,
    icon: 'Home',
    color: 'from-blue-500/20 to-cyan-500/20',
    ctaButtons: [
      { label: 'Request Service', href: '/request-service', variant: 'primary' },
      { label: 'Property Management', href: '/brands/bam-casas', variant: 'secondary' },
    ],
    featured: true,
    category: 'Property & Services',
  },
  {
    id: 'elevated-remedies',
    slug: 'elevated-remedies',
    name: 'Elevated Remedies',
    tagline: 'Record Label & AI Song Creation',
    description:
      'The creator engine\u2014AI-powered music creation, custom songs marketplace, and worldwide distribution.',
    longDescription:
      'Elevated Remedies is where music meets technology. As a record label powered by AI, we help artists and fans create custom songs and distribute them worldwide. Whether you want a personalized track for a loved one, a beat for your brand, or to launch your music career, Elevated Remedies is your sound, elevated.',
    email: 'ElevatedRemedies@CyberAdSpace.com',
    image: null,
    icon: 'Music',
    color: 'from-violet-500/20 to-indigo-500/20',
    ctaButtons: [
      { label: 'Create a Custom Song', href: '/create-song', variant: 'primary' },
          { label: 'Listen on YouTube', href: 'https://www.youtube.com/@elevatedremedies', variant: 'secondary' },
        ],
        featured: true,
        category: 'Music & Entertainment',
  },
  {
    id: 'florida-garage-sales',
    slug: 'florida-garage-sales',
    name: 'Florida Garage Sales',
    tagline: 'Local Discovery & Resale',
    description:
      'Daily deals, impulse finds, and hidden gems. The marketplace content driver for local discovery and resale across Florida.',
    longDescription:
      'Florida Garage Sales is your digital treasure map. We scour garage sales, estate sales, and liquidation events across the Sunshine State to bring you amazing new and used products at unbeatable prices. New finds drop daily\u2014browse, discover, and grab deals before they\u2019re gone. It\u2019s the thrill of the hunt, delivered to your screen.',
    email: 'FloridaGarageSales@CyberAdSpace.com',
    image: null,
    icon: 'ShoppingCart',
    color: 'from-orange-500/20 to-amber-500/20',
    ctaButtons: [
      { label: 'Shop Deals', href: '/brands/florida-garage-sales', variant: 'primary' },
    ],
    featured: true,
    category: 'Shopping & Deals',
  },
  {
    id: 'hemp-cookies',
    slug: 'hemp-cookies',
    name: 'The Hemp Cookies',
    tagline: 'Healing Snacks & Infused Treats',
    description:
      'Delicious cookies made with milk, hemp protein, and hemp seeds\u2014with optional infused cannabinoid options for wellness.',
    longDescription:
      'Hemp Cookies are the feel-good snack you didn\u2019t know you needed. Baked with wholesome ingredients like milk, hemp protein, and hemp seeds, every cookie delivers nutrition and flavor. For those looking for something extra, our infused cannabinoid options bring a wellness twist to your snack time. Healing never tasted this good.',
    email: 'TheHempCookies@CyberAdSpace.com',
    image: null,
    icon: 'Cookie',
    color: 'from-green-500/20 to-emerald-500/20',
    ctaButtons: [
      { label: 'Shop Cookies', href: '/brands/hemp-cookies', variant: 'primary' },
    ],
    featured: true,
    category: 'Food & Wellness',
  },
  {
    id: 'canamo-cafe',
    slug: 'canamo-cafe',
    name: 'C\u00e1\u00f1amo Caf\u00e9',
    tagline: 'Premium Colombian Coffee & Hemp',
    description:
      'Lifestyle flagship brand serving premium Colombian coffee with premium hemp-infused options. Bold flavor, elevated experience.',
    longDescription:
      'C\u00e1\u00f1amo Caf\u00e9 is where Colombian coffee tradition meets modern hemp wellness. We source the finest beans from Colombia and blend them with premium hemp options for a coffee experience like no other. Whether you prefer your cup classic or infused, every sip is crafted for those who demand quality and flavor.',
    email: 'CanamoCafe@CyberAdSpace.com',
    image: null,
    icon: 'Coffee',
    color: 'from-amber-500/20 to-yellow-500/20',
    ctaButtons: [
      { label: 'Shop Coffee', href: '/brands/canamo-cafe', variant: 'primary' },
      { label: 'Visit Caf\u00e9', href: '/brands/canamo-cafe', variant: 'secondary' },
    ],
    featured: true,
    category: 'Coffee & Lifestyle',
  },
]

export function getBrandBySlug(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug)
}

export function getAllBrands(): Brand[] {
  return brands
}

export function getFeaturedBrands(): Brand[] {
  return brands.filter((b) => b.featured)
}

export function searchBrands(query: string): Brand[] {
  const q = query.toLowerCase()
  return brands.filter(
    (b) =>
      b.name.toLowerCase().includes(q) ||
      b.tagline.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
  )
}

export default brands
