export interface SponsorshipTier {
  name: string;
  price: string;
  benefits: string[];
  color: string;
  tierId: string;
}

export const sponsorshipTiers: SponsorshipTier[] = [
  {
    name: "Diamond",
    price: "$50,000",
    benefits: [
      "All Benefits of Sapphire Tier",
      "Custom T3 Bucket Hat",
      "Name Season Robot",
      "Logo and Name on All Branding",
    ],
    color: "text-cyan-400",
    tierId: "diamond",
  },
  {
    name: "Sapphire",
    price: "$35,000",
    benefits: [
      "All Benefits of Platinum Tier",
      "Logo On Competition Buttons",
      "Logo on Competition Bucket Hat",
    ],
    color: "text-blue-500",
    tierId: "sapphire",
  },
  {
    name: "Platinum",
    price: "$10,000",
    benefits: [
      "All Benefits of Gold Tier",
      "Logo On Competition Buttons",
      "Logo on Competition Bucket Hat",
    ],
    color: "text-slate-400",
    tierId: "platinum",
  },
  {
    name: "Gold",
    price: "$5,000",
    benefits: [
      "All benefits of Silver Tier",
      "Dedicated Instagram Story",
    ],
    color: "text-yellow-500",
    tierId: "gold",
  },
  {
    name: "Silver",
    price: "$1,000",
    benefits: [
      "All benefits of Bronze Tier",
      "Logo on Competition Robot",
      "Logo on Banner",
    ],
    color: "text-gray-500",
    tierId: "silver",
  },
  {
    name: "Bronze",
    price: "$500",
    benefits: [
      "Shoutout on T3 Social Media",
      "Logo on Offseason Shirt",
      "Logo on Competition Shirt",
      "Thank You Letter",
    ],
    color: "text-orange-700",
    tierId: "bronze",
  },
];