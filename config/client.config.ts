import type { ClientConfig } from '@/types'
import { PLACEHOLDER_IMAGES, TOUR_FRAMES } from './placeholders'

export const clientConfig: ClientConfig = {
  home: {
    sections: [
      {
        kind: 'hero',
        enabled: true,
        headline: 'Таны мөрөөдлийн орон сууц',
        sub: 'Доош гүйлгээд төслийг бүрэн мэдрээрэй',
        imageSrc: '/clients/five-star/Hero.webp',
        isSampleVisualization: false,
      },
      {
        kind: 'scrollVideo',
        enabled: false, // TODO: scroll-video clip pending — see REFERENCE.md §2
        videoSrc: '/assets/demo/tour-clip.mp4',
      },
      // Building exterior first — answers "what building is this?" immediately after the hero.
      {
        kind: 'dollhouseReveal',
        enabled: true,
        imageSrc: '/clients/five-star/unit-types/2br-44-dollhouse.png',
        depthSrc: '/clients/five-star/unit-types/2br-44-dollhouse-depth.png',
      },
      // Unit types + pricing early — seeker self-qualifies before committing to the full journey.
      {
        kind: 'residenceShowcase' as const,
        enabled: true,
        eyebrow: 'Орон сууцны төрлүүд',
        headingParts: [
          { text: 'Таван өөр зохиомж, ' },
          { text: 'нэг ижил', accent: 'italic' as const },
          { text: ' чанар.' },
        ],
        introBody:
          'Студиас гурван өрөө хүртэл — бүр тохиромжтой, хүн бүрт зориулсан орон зай.',
      },
      // 3D capability demo — shows developer what an interactive model looks like.
      {
        kind: 'showcaseApartment3D' as const,
        enabled: true,
        modelSrc: '/Clients/five-star/3d%20sample/the_hallwyl_museum_1st_floor_combined.glb',
      },
      // Brand statement lands now they've seen the building and the product.
      {
        kind: 'manifesto',
        enabled: true,
        lines: [
          'Архитектур амьдралтай уулзах цэг.',
          'Өрөө бүр тань зориулагдсан.',
          'Таны гэр энд эхэлнэ.',
        ],
      },
      {
        kind: 'featureSteps',
        enabled: true,
        label: 'Барилгын онцлог',
        steps: [
          {
            index: '01',
            title: 'Гэрэлд дурласан орон зай',
            body: 'Шалнаас тааз хүртэлх цонхнууд өдрийн гэрлийг өрөө бүрд урьж, агаар нэвт цэлмэг мэдрэмжийг төрүүлнэ.',
            image: '/assets/five-star-gallery-photos/Five-star/2br-44/living.jpg',
          },
          {
            index: '02',
            title: 'Байгалийн материал',
            body: 'Царс мод, чулуу, дулаахан өнгөний эвсэл — гар бүрд мэдрэгдэх чанарын нарийн ширийн.',
            image: '/assets/five-star-gallery-photos/Five-star/2br-56/bedroom.jpg',
          },
          {
            index: '03',
            title: 'Нээлттэй гал тогоо',
            body: 'Зочид хүлээн авах, амрах, хооллох орон зай нэгдэж, гэр бүлийн амьдрал чөлөөтэй урсана.',
            image: '/assets/five-star-gallery-photos/Five-star/3br-63/kitchen.jpg',
          },
          {
            index: '04',
            title: 'Хотын дээгүүрх амар амгалан',
            body: 'Хувийн тагт болон чимээгүй буланг хотын эргэлдээн дунд таны хувийн нөмөр болгон зориуджээ.',
            image: '/assets/five-star-gallery-photos/Five-star/2br-51/living.jpg',
          },
        ],
      },
      {
        kind: 'pinnedImage',
        enabled: true,
        image: '/assets/five-star-gallery-photos/Five-star/2br-44/living.jpg',
        states: [
          {
            heading: 'Өглөөний гэрэл',
            body: 'Зүүн зүгийн өргөн цонхоор нар таны өрөөг дулаахан гэрлээр дүүргэж, өдөр бүр сэргэг мэдрэмжээр эхэлнэ.',
            bg: '#FFFFFF',
            textColor: '#111111',
          },
          {
            heading: 'Үдшийн нам гүм',
            body: 'Дуу чимээ тусгаарласан хана таныг хотын шуугианаас хол, амар амгалан орон зайд байлгана.',
            bg: '#1A1A1A',
            textColor: '#FFFFFF',
          },
          {
            heading: 'Ногоон амьсгал',
            body: 'Орон сууц бүр байгальтай ойр — хувийн тагт, ногоон зай, цэвэр агаар таны өдөр тутмын хэсэг.',
            bg: '#1E2B1E',
            textColor: '#FFFFFF',
          },
        ],
      },
      {
        kind: 'interiorPhoto',
        enabled: true,
        image: '/assets/five-star-gallery-photos/Five-star/2br-44/living.jpg',
        caption: 'Амьдрал эхлэх орон зай.',
      },
      {
        kind: 'statsBand' as const,
        enabled: true,
        eyebrow: 'Тоон үзүүлэлт',
        headingParts: [
          { text: 'Шилдэг чанар, ' },
          { text: 'батлагдсан', accent: 'italic' as const },
          { text: ' үр дүн.' },
        ],
        stats: [
          { value: '12', label: 'Жилийн туршлага', suffix: '+' },
          { value: '1685', label: 'Амьдарч буй гэр бүл', suffix: '+' },
          { value: '2026', label: 'Хүлээлгэн өгөх он' },
        ],
      },
      {
        kind: 'finalCta' as const,
        enabled: true,
        eyebrow: 'Үзлэг захиалах',
        headingParts: [
          { text: 'Таны гэр ' },
          { text: 'энд', accent: 'italic' as const },
          { text: ' эхэлнэ.' },
        ],
        primaryLabel: 'Үзлэг захиалах',
        primaryHref: '/contact',
        secondaryLabel: 'Орон сууцнууд',
        secondaryHref: '/residences',
      },
    ],
  },
  slug: 'demo',
  buildingName: 'Шинэ Улаанбаатар',
  tagline: 'Таны шинэ гэр',
  logo: '/clients/five-star/Logo.png',
  heroImage: '/clients/five-star/Hero.png',
  theme: {
    oak: '#B8946A',
    sage: '#97A988',
  },
  contact: {
    address: 'Сүхбаатар дүүрэг, Улаанбаатар',
    phone: '+976 9900 0000',
    email: 'info@demo.mn',
  },
  tourFrames: TOUR_FRAMES,
  // AI sample interior frame sequence. Flip to true in a real pitch to disclose.
  tourIsSampleVisualization: false,
  // Config-driven disclosure label (rendered by SampleVizCaption).
  sampleVisualizationLabel: 'Жишиг дүрслэл',
  unitTypes: [
    {
      id: 'studio',
      name: 'Студи',
      rooms: 0,
      sizeRange: [40, 46],
      priceFrom: 120_000_000,
      floorPlanImage: '/clients/five-star/unit-types/2br-43-dollhouse.png',
      floorPlanDepthMap: '/clients/five-star/unit-types/2br-43-dollhouse-depth.png',
      dollhouseImage: '/clients/five-star/unit-types/2br-43-dollhouse.png',
      gallery: [PLACEHOLDER_IMAGES.gallery[0]!],
      features: ['Нээлттэй төлөвлөлт', 'Модон шал', 'Хойд харсан цонх'],
      blurb: 'Ганцаараа буюу хосоороо амьдрахад тохиромжтой.',
    },
    {
      id: '1br',
      name: '1 өрөө',
      rooms: 1,
      sizeRange: [48, 54],
      priceFrom: 180_000_000,
      floorPlanImage: '/clients/five-star/unit-types/2br-51-dollhouse.png',
      floorPlanDepthMap: '/clients/five-star/unit-types/2br-51-dollhouse-depth.png',
      dollhouseImage: '/clients/five-star/unit-types/2br-51-dollhouse.png',
      gallery: [
        '/assets/five-star-gallery-photos/Five-star/2br-51/living.jpg',
        PLACEHOLDER_IMAGES.gallery[1]!,
      ],
      features: ['Тусдаа унтлагын өрөө', 'Том цонх', 'Нарны гэрэл сайтай'],
      blurb: 'Хос буюу залуу гэр бүлд зориулсан.',
    },
    {
      id: '2br',
      name: '2 өрөө',
      rooms: 2,
      sizeRange: [44, 46],
      priceFrom: 260_000_000,
      floorPlanImage: '/clients/five-star/unit-types/2br-44-dollhouse.png',
      floorPlanDepthMap: '/clients/five-star/unit-types/2br-44-dollhouse-depth.png',
      dollhouseImage: '/clients/five-star/unit-types/2br-44-dollhouse.png',
      gallery: [
        '/assets/five-star-gallery-photos/Five-star/2br-44/living.jpg',
        '/assets/five-star-gallery-photos/Five-star/2br-44/bedroom.jpg',
        '/assets/five-star-gallery-photos/Five-star/2br-44/kitchen.jpg',
        '/assets/five-star-gallery-photos/Five-star/2br-44/bathroom.jpg',
      ],
      features: ['2 унтлагын өрөө', 'Уужим зочны өрөө', '2 угаалгын өрөө'],
      blurb: 'Гэр бүлд тохирсон оновчтой зохион байгуулалт.',
    },
    {
      id: '2br-large',
      name: '2 өрөө том',
      rooms: 2,
      sizeRange: [54, 58],
      priceFrom: 310_000_000,
      floorPlanImage: '/clients/five-star/unit-types/2br-56-dollhouse.png',
      floorPlanDepthMap: '/clients/five-star/unit-types/2br-56-dollhouse-depth.png',
      dollhouseImage: '/clients/five-star/unit-types/2br-56-dollhouse.png',
      gallery: [
        '/assets/five-star-gallery-photos/Five-star/2br-56/living.jpg',
        '/assets/five-star-gallery-photos/Five-star/2br-56/bedroom.jpg',
      ],
      features: ['2 унтлагын өрөө', 'Уужим зочны өрөө', 'Өргөн балкон'],
      blurb: 'Илүү уужим зохион байгуулалттай, балконтой 2 өрөөт орон сууц.',
    },
    {
      id: '3br',
      name: '3 өрөө',
      rooms: 3,
      sizeRange: [63, 63],
      priceFrom: 380_000_000,
      floorPlanImage: '/clients/five-star/unit-types/3br-63-dollhouse.png',
      floorPlanDepthMap: '/clients/five-star/unit-types/3br-63-dollhouse-depth.png',
      dollhouseImage: '/clients/five-star/unit-types/3br-63-dollhouse.png',
      gallery: [
        '/assets/five-star-gallery-photos/Five-star/3br-63/living.jpg',
        '/assets/five-star-gallery-photos/Five-star/3br-63/bedroom.jpg',
        '/assets/five-star-gallery-photos/Five-star/3br-63/kitchen.jpg',
        '/assets/five-star-gallery-photos/Five-star/3br-63/bathroom.jpg',
      ],
      features: ['3 унтлагын өрөө', 'Уужим зочны өрөө', 'Гал тогооны арал'],
      blurb: 'Том гэр бүлд зориулсан хамгийн уужим орон зай.',
    },
  ],
  units: [
    { id: 'u001', typeId: 'studio', floor: 3,  sizeM2: 30,  orientation: 'north',      price: 120_000_000, status: 'available' },
    { id: 'u002', typeId: 'studio', floor: 5,  sizeM2: 32,  orientation: 'south',      price: 128_000_000, status: 'available' },
    { id: 'u003', typeId: '1br',    floor: 4,  sizeM2: 48,  orientation: 'east',       price: 185_000_000, status: 'available' },
    { id: 'u004', typeId: '1br',    floor: 7,  sizeM2: 52,  orientation: 'south',      price: 198_000_000, status: 'reserved'  },
    { id: 'u005', typeId: '2br',       floor: 6,  sizeM2: 44,  orientation: 'south',      price: 268_000_000, status: 'available' },
    { id: 'u006', typeId: '2br',       floor: 8,  sizeM2: 46,  orientation: 'east',       price: 280_000_000, status: 'sold'      },
    { id: 'u009', typeId: '2br-large', floor: 5,  sizeM2: 56,  orientation: 'south',      price: 315_000_000, status: 'available' },
    { id: 'u010', typeId: '2br-large', floor: 9,  sizeM2: 58,  orientation: 'east',       price: 328_000_000, status: 'reserved'  },
    { id: 'u007', typeId: '3br',    floor: 9,  sizeM2: 98,  orientation: 'south',      price: 385_000_000, status: 'available' },
    { id: 'u008', typeId: '3br',    floor: 10, sizeM2: 115, orientation: 'north-east', price: 420_000_000, status: 'reserved'  },
  ],
}
