export type StylistPost = {
  id: string;
  image: string;
};

export type StylistProfile = {
  id: string;
  name: string;
  title: string;
  bio: string;
  styleTags: string[];
  avatar: string;
  heroImage: string;
  relikedPeople: string[];
  posts: StylistPost[];
};

export const stylists: StylistProfile[] = [
  {
    id: "lea-moreau",
    name: "Lea Moreau",
    title: "Styliste Casual Chic",
    bio: "Je construis des silhouettes douces, elegantes et faciles a vivre. J'aime melanger de belles bases chic avec des pieces plus simples pour que mes clientes se sentent tout de suite mises en valeur.",
    styleTags: ["Casual", "Chic", "Minimaliste"],
    avatar: "/catalogue-sia/cardigan-vert-zara/05755903933-e2.jpg",
    heroImage: "/catalogue-sia/robe-hm/d5aa2b50cf5a7e871f9e2e43acba6114c0544471.jpg.avif",
    relikedPeople: ["Camille", "Sarah", "Nina", "Leonie"],
    posts: [
      {
        id: "lea-post-1",
        image: "/catalogue-sia/blazer-marron-hm/62db3001bbd5f1672ed3a5f8e1b8591d6895f072.jpg.avif",
      },
      {
        id: "lea-post-2",
        image: "/catalogue-sia/cardigan-vert-zara/05755903933-e3.jpg",
      },
      {
        id: "lea-post-3",
        image: "/catalogue-sia/robe-hm/404890db678b75ee725fa16eea0589b3d83e9de7.jpg.avif",
      },
      {
        id: "lea-post-4",
        image: "/catalogue-sia/blazer-marron-hm/1d47b1a675f0368e29a93086726607a64989d02e.jpg.avif",
      },
      {
        id: "lea-post-5",
        image: "/catalogue-sia/cardigan-vert-zara/05755903933-e1.jpg",
      },
      {
        id: "lea-post-6",
        image: "/catalogue-sia/robe-hm/ef4eecbd125ccfc23d9acf8bfeda19000ad1f019.jpg.avif",
      },
    ],
  },
  {
    id: "ines-belkacem",
    name: "Ines Belkacem",
    title: "Styliste Streetwear Moderne",
    bio: "Je travaille des looks urbains, nets et actuels, avec des proportions fortes et beaucoup d'assurance. Mon but, c'est de garder l'energie streetwear tout en donnant une vraie allure mode.",
    styleTags: ["Streetwear", "Casual", "Sport"],
    avatar: "/catalogue-sia/ensemble-jean-zara/07484045407-e1.jpg",
    heroImage: "/catalogue-sia/ensemble-jean-zara/01416035407-a2.jpg",
    relikedPeople: ["Aya", "Mina", "Lola", "Jade"],
    posts: [
      {
        id: "ines-post-1",
        image: "/catalogue-sia/ensemble-jean-zara/07484045407-e3.jpg",
      },
      {
        id: "ines-post-2",
        image: "/catalogue-sia/bermuda-noir-zara/02333570800-e3.jpg",
      },
      {
        id: "ines-post-3",
        image: "/catalogue-sia/ensemble-jean-zara/07484045407-e1.jpg",
      },
      {
        id: "ines-post-4",
        image: "/catalogue-sia/bermuda-noir-zara/02333570800-a1.jpg",
      },
      {
        id: "ines-post-5",
        image: "/catalogue-sia/ensemble-jean-zara/01416035407-p.jpg",
      },
      {
        id: "ines-post-6",
        image: "/catalogue-sia/bermuda-noir-zara/02333570800-p.jpg",
      },
    ],
  },
  {
    id: "zoe-lambert",
    name: "Zoe Lambert",
    title: "Styliste Statement & Evenement",
    bio: "Je cree des looks qui marquent les esprits pour les diners, les sorties et tous les moments ou l'on veut se sentir inoubliable. J'aime quand une tenue raconte quelque chose des la premiere seconde.",
    styleTags: ["Chic", "Statement", "Soiree"],
    avatar: "/catalogue-sia/blazer-marron-hm/cc8eed826b30240467d641e4b4e90e6530ec90a4.jpg.avif",
    heroImage: "/catalogue-sia/blazer-leopard-hm/a8f0ffd902fee566d5a2c5079a29e3e641828945.jpg.avif",
    relikedPeople: ["Clara", "Emma", "Sofia", "Yasmine"],
    posts: [
      {
        id: "zoe-post-1",
        image: "/catalogue-sia/blazer-leopard-hm/a8f0ffd902fee566d5a2c5079a29e3e641828945.jpg.avif",
      },
      {
        id: "zoe-post-2",
        image: "/catalogue-sia/robe-pois-hm/dc76edb7b8d9454ea08e359b455582c49042a3b0.jpg.avif",
      },
      {
        id: "zoe-post-3",
        image: "/catalogue-sia/blazer-leopard-hm/0221dceb950cc2cd13e81586151c3e2d8b46cd77.jpg.avif",
      },
      {
        id: "zoe-post-4",
        image: "/catalogue-sia/robe-pois-hm/ad3f16d4867ed7d533f2b57d2a00680d57c97f90.jpg.avif",
      },
      {
        id: "zoe-post-5",
        image: "/catalogue-sia/blazer-leopard-hm/5f08cf559f9e4123baa6e6862434a303da978d58.jpg.avif",
      },
      {
        id: "zoe-post-6",
        image: "/catalogue-sia/robe-pois-hm/34cb10b508820887087693b34e1c8fbb05e6788c.jpg.avif",
      },
    ],
  },
];

export function getStylistById(id: string) {
  return stylists.find((stylist) => stylist.id === id);
}
