export interface InitiativeLink {
  text: string;
  url: string;
}

export interface UnitybotInitiative {
  title: string;
  description: string;
  imageUrl?: string;
  links: InitiativeLink[];
}

export const resources: UnitybotInitiative[] = [
  {
    title: "Impact API",
    description: "The Ultimate Guide to Outreach in FIRST",
    links: [
      {
        text: "Google Docs Version",
        url: "https://docs.google.com/document/d/1uyzSZY_2WyuSjGspmcLuWeysLUXTqhjyYWG8UjnGSBI/edit?usp=sharing",
      },
      {
        text: "PDF Version",
        url: "https://d2a4a7ee-d80f-4d48-95f6-e5dc181b5a95.filesusr.com/ugd/ca5509_ea71204d0d8a49e7b482b783574bb4ab.pdf",
      },
    ],
  },
  {
    title: "The Resource Hub",
    description: "Find materials to help your team in all aspects of FIRST Robotics",
    links: [
      {
        text: "Resource Hub",
        url: "https://docs.google.com/document/d/1xwzwQz-n-UQXW-1ZCF2B0OhAn0w5G7o1PafIbu6iRNc/edit?usp=sharing",
      },
    ],
  },
];

export const initiatives: UnitybotInitiative[] = [
  {
    title: "FIRST Alliances",
    description: "Combines the impact of the 600,000+ students in FIRST, reaching greater heights and inspire more people than ever before",
    imageUrl: "/FirstAlliances.avif",
    links: [
      {
        text: "More Information",
        url: "https://firstalliances.org/",
      },
    ],
  },
  {
    title: "FIRST Like a Girl",
    description: "Improve STEM by posting and spreading awareness of the experiences of women in FIRST",
    imageUrl: "/FirstLikeAGirl.avif",
    links: [
      {
        text: "More Information",
        url: "https://firstlikeagirl.com/",
      },
    ],
  },
  {
    title: "M.E.+FIRST",
    description: "Advocate for women in STEM by creating safe spaces for networking and communication",
    imageUrl: "/ME.avif",
    links: [
      {
        text: "More Information",
        url: "https://frc.spacecookies.org/menstrual-equity",
      },
    ],
  },
  {
    title: "Girls Get Together",
    description: "An international community of FIRST teams who support and promote gender inclusion in FIRST robotics",
    imageUrl: "/GGT.avif",
    links: [
      {
        text: "More Information",
        url: "https://gearboxgirls.weebly.com/girls-get-together.html",
      },
    ],
  },
  {
    title: "First Ladies",
    description: "Support and promote women in FIRST robotics",
    imageUrl: "/FIRSTLadies.avif",
    links: [
      {
        text: "More Information",
        url: "http://www.ladiesinfirst.com/about.html",
      },
    ],
  },
];