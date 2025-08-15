export interface Sponsor {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  amount: number;
  notes?: string;
}

export const sponsorsData: Sponsor[] = [
  {
    id: 1,
    name: "Generator Supercenter",
    imageUrl: "/GeneratorSupercenter.webp",
    description: "Thank you for your incredible support!",
    amount: 20000,
  },
  {
    id: 2,
    name: "Burns McDonnell",
    imageUrl: "/BMD.png",
    description: "Fueling our passion for robotics.",
    amount: 5000,
    notes: "2024-2025 Season Sponsor",
  },
  {
    id: 3,
    name: "FIRST Robotics / Bechtel Grant",
    imageUrl: "/Bechtel.png",
    description: "Your support helps us innovate.",
    amount: 1500,
  },
  {
    id: 4,
    name: "JB Metal Fabricators",
    imageUrl: "/JB.jpg",
    description: "A key part of our team's success.",
    amount: 500,
    notes: "Donated services",
  },
  {
    id: 5,
    name: "Chick-fil-A Cypress Rosehill",
    imageUrl: "/cfa.png",
    description: "Helping us build the future.",
    amount: 500,
    notes: "Food donation",
  },
  {
    id: 6,
    name: "Costco",
    imageUrl: "/placeholder.svg",
    description: "Thank you for your generous contribution.",
    amount: 300,
  },
  {
    id: 7,
    name: "Takeda Pharmaceuticals",
    imageUrl: "/placeholder.svg",
    description: "Supporting STEM education in our community.",
    amount: 150,
  },
  {
    id: 8,
    name: "Chick-fil-A Tomball",
    imageUrl: "/placeholder.svg",
    description: "Thank you for supporting our spirit night.",
    amount: 125,
  },
];