export interface HomePageData {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  aboutPreview: {
    title: string;
    description: string;
    imageUrl: string;
  };
  eventsPreview: {
    title: string;
    description: string;
  };
  sponsorsPreview: {
    title: string;
    description: string;
  };
}

export const homePageData: HomePageData = {
  hero: {
    title: "Tomball T3 Robotics",
    subtitle: "FIRST Robotics Competition Team 7312",
    backgroundImage: "/indexcollage.jpg",
  },
  aboutPreview: {
    title: "Who We Are",
    description:
      "Tomball T3 Robotics, FRC Team 7312, is a high school robotics team dedicated to fostering interest in STEM fields. We design, build, and program robots to compete in the FIRST Robotics Competition, learning valuable skills in engineering, teamwork, and leadership.",
    imageUrl: "/placeholder.svg",
  },
  eventsPreview: {
    title: "Our Journey",
    description:
      "From local districts to the world stage, follow our competitive journey and see our achievements.",
  },
  sponsorsPreview: {
    title: "Our Valued Sponsors",
    description:
      "Our success is driven by the generous support of our sponsors. Their contributions empower us to innovate and inspire.",
  },
};