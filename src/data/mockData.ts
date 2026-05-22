import { Book, Author, Category, PromoSlide } from "@/types";

export const promoSlides: PromoSlide[] = [
  {
    id: "1",
    titlePrefix: "The Bookworm Editors'",
    titleHighlighted: "February",
    titleSuffix: "Featured Books of the",
    subtitle: "Featured Books of the",
    imageUrl: "https://placehold.it/800x420",
    actionUrl: "#"
  },
  {
    id: "2",
    titlePrefix: "The Bookworm Editors'",
    titleHighlighted: "February",
    titleSuffix: "Featured Books of the",
    subtitle: "Featured Books of the",
    imageUrl: "https://placehold.it/800x420",
    actionUrl: "#"
  },
  {
    id: "3",
    titlePrefix: "The Bookworm Editors'",
    titleHighlighted: "February",
    titleSuffix: "Featured Books of the",
    subtitle: "Featured Books of the",
    imageUrl: "https://placehold.it/800x420",
    actionUrl: "#"
  },
  {
    id: "4",
    titlePrefix: "The Bookworm Editors'",
    titleHighlighted: "February",
    titleSuffix: "Featured Books of the",
    subtitle: "Featured Books of the",
    imageUrl: "https://placehold.it/800x420",
    actionUrl: "#"
  }
];

export const featuredCategories: Category[] = [
  {
    id: "arts",
    name: "Arts & Photography",
    iconClass: "flaticon-gallery",
    booksCount: 120
  },
  {
    id: "food",
    name: "Food & Drink",
    iconClass: "flaticon-cook",
    booksCount: 85
  },
  {
    id: "romance",
    name: "Romance",
    iconClass: "flaticon-like",
    booksCount: 140
  },
  {
    id: "health",
    name: "Health",
    iconClass: "flaticon-doctor",
    booksCount: 95
  },
  {
    id: "biography",
    name: "Biography",
    iconClass: "flaticon-resume",
    booksCount: 110
  }
];

export const bestsellingBooks: Book[] = [
  {
    id: "bs1",
    title: "Think Like a Monk: Train Your Mind for Peace and Purpose Everyday",
    author: "Jay Shetty",
    price: 29,
    category: "Paperback",
    format: "Paperback",
    imageUrl: "https://placehold.it/150x226"
  },
  {
    id: "bs2",
    title: "The Subtle Art of Not Giving a F*ck: A Counterintuitive Approach",
    author: "Mark Manson",
    price: 20,
    category: "Paperback",
    format: "Paperback",
    imageUrl: "https://placehold.it/150x226"
  },
  {
    id: "bs3",
    title: "Becoming",
    author: "Michelle Obama",
    price: 25,
    category: "Hard Cover",
    format: "Hard Cover",
    imageUrl: "https://placehold.it/150x226"
  },
  {
    id: "bs4",
    title: "Atomic Habits: An Easy & Proven Way to Build Good Habits",
    author: "James Clear",
    price: 22,
    category: "Paperback",
    format: "Paperback",
    imageUrl: "https://placehold.it/150x226"
  },
  {
    id: "bs5",
    title: "Educated: A Memoir",
    author: "Tara Westover",
    price: 18,
    category: "Paperback",
    format: "Paperback",
    imageUrl: "https://placehold.it/150x226"
  }
];

export const featuredBooks: {
  featured: Book[];
  onsale: Book[];
  mostviewed: Book[];
} = {
  featured: [
    {
      id: "f1",
      title: "Think Like a Monk: Train Your Mind for Peace and Purpose Everyday",
      author: "Jay Shetty",
      price: 29,
      category: "Paperback",
      format: "Paperback",
      imageUrl: "https://placehold.it/120x180"
    },
    {
      id: "f2",
      title: "The Ride of a Lifetime: Lessons Learned from 15 Years as CEO",
      author: "Robert Iger",
      price: 15,
      originalPrice: 20,
      category: "Hard Cover",
      format: "Hard Cover",
      imageUrl: "https://placehold.it/120x180"
    },
    {
      id: "f3",
      title: "The Rural Diaries: Love, Livestock, and Big Life Lessons",
      author: "Hilarie Burton",
      price: 15,
      category: "Hard Cover",
      format: "Hard Cover",
      imageUrl: "https://placehold.it/120x180"
    },
    {
      id: "f4",
      title: "The Subtle Art of Not Giving a F*ck: A Counterintuitive Approach",
      author: "Mark Manson",
      price: 20,
      category: "Paperback",
      format: "Paperback",
      imageUrl: "https://placehold.it/120x180"
    },
    {
      id: "f5",
      title: "Becoming",
      author: "Michelle Obama",
      price: 25,
      category: "Hard Cover",
      format: "Hard Cover",
      imageUrl: "https://placehold.it/120x180"
    },
    {
      id: "f6",
      title: "Atomic Habits: An Easy & Proven Way to Build Good Habits",
      author: "James Clear",
      price: 22,
      category: "Paperback",
      format: "Paperback",
      imageUrl: "https://placehold.it/120x180"
    }
  ],
  onsale: [
    {
      id: "o1",
      title: "The Ride of a Lifetime: Lessons Learned from 15 Years as CEO",
      author: "Robert Iger",
      price: 15,
      originalPrice: 20,
      category: "Hard Cover",
      format: "Hard Cover",
      imageUrl: "https://placehold.it/120x180"
    },
    {
      id: "o2",
      title: "Educated: A Memoir",
      author: "Tara Westover",
      price: 12,
      originalPrice: 18,
      category: "Paperback",
      format: "Paperback",
      imageUrl: "https://placehold.it/120x180"
    }
  ],
  mostviewed: [
    {
      id: "m1",
      title: "Think Like a Monk: Train Your Mind for Peace and Purpose Everyday",
      author: "Jay Shetty",
      price: 29,
      category: "Paperback",
      format: "Paperback",
      imageUrl: "https://placehold.it/120x180"
    },
    {
      id: "m2",
      title: "Atomic Habits: An Easy & Proven Way to Build Good Habits",
      author: "James Clear",
      price: 22,
      category: "Paperback",
      format: "Paperback",
      imageUrl: "https://placehold.it/120x180"
    }
  ]
};

export const dealsOfWeekBooks: Book[] = [
  {
    id: "d1",
    title: "Think Like a Monk: Train Your Mind for Peace and Purpose Everyday",
    author: "Jay Shetty",
    price: 29,
    originalPrice: 35,
    category: "Kindle Edition",
    format: "Kindle Edition",
    imageUrl: "https://placehold.it/200x327"
  },
  {
    id: "d2",
    title: "Becoming",
    author: "Michelle Obama",
    price: 25,
    originalPrice: 30,
    category: "Hard Cover",
    format: "Hard Cover",
    imageUrl: "https://placehold.it/200x327"
  }
];

export const newReleasesBooks: {
  history: Book[];
  science: Book[];
  romance: Book[];
  travel: Book[];
} = {
  history: [
    {
      id: "nr_h1",
      title: "The Ride of a Lifetime: Lessons Learned from 15 Years as CEO",
      author: "Robert Iger",
      price: 15,
      category: "Hard Cover",
      format: "Hard Cover",
      imageUrl: "https://placehold.it/120x180"
    },
    {
      id: "nr_h2",
      title: "Educated: A Memoir",
      author: "Tara Westover",
      price: 18,
      category: "Paperback",
      format: "Paperback",
      imageUrl: "https://placehold.it/120x180"
    }
  ],
  science: [
    {
      id: "nr_s1",
      title: "Think Like a Monk: Train Your Mind for Peace and Purpose Everyday",
      author: "Jay Shetty",
      price: 29,
      category: "Paperback",
      format: "Paperback",
      imageUrl: "https://placehold.it/120x180"
    }
  ],
  romance: [
    {
      id: "nr_r1",
      title: "The Rural Diaries: Love, Livestock, and Big Life Lessons",
      author: "Hilarie Burton",
      price: 15,
      category: "Hard Cover",
      format: "Hard Cover",
      imageUrl: "https://placehold.it/120x180"
    }
  ],
  travel: [
    {
      id: "nr_t1",
      title: "Becoming",
      author: "Michelle Obama",
      price: 25,
      category: "Hard Cover",
      format: "Hard Cover",
      imageUrl: "https://placehold.it/120x180"
    }
  ]
};

export const biographiesBooks: Book[] = [
  {
    id: "bio1",
    title: "The Rural Diaries: Love, Livestock, and Big Life Lessons Down on Mischief Farm",
    author: "Hillary Burton",
    price: 15,
    category: "Hard Cover",
    format: "Hard Cover",
    imageUrl: "https://placehold.it/120x183"
  },
  {
    id: "bio2",
    title: "The Ride of a Lifetime: Lessons Learned from 15 Years as CEO...",
    author: "Hillary Burton",
    price: 15,
    category: "Hard Cover",
    format: "Hard Cover",
    imageUrl: "https://placehold.it/120x183"
  },
  {
    id: "bio3",
    title: "Think Like a Monk: Train Your Mind for Peace and Purpose Everyday",
    author: "Jay Shetty",
    price: 29,
    category: "Paperback",
    format: "Paperback",
    imageUrl: "https://placehold.it/120x183"
  }
];

export const favoriteAuthors: Author[] = [
  {
    id: "auth1",
    name: "Barbara O'Neil",
    imageUrl: "https://placehold.it/142x142",
    booksCount: 25
  },
  {
    id: "auth2",
    name: "Stephen King",
    imageUrl: "https://placehold.it/142x142",
    booksCount: 25
  },
  {
    id: "auth3",
    name: "David Walliams",
    imageUrl: "https://placehold.it/142x142",
    booksCount: 25
  },
  {
    id: "auth4",
    name: "Joe Wicks",
    imageUrl: "https://placehold.it/142x142",
    booksCount: 25
  },
  {
    id: "auth5",
    name: "Jessica Simpson",
    imageUrl: "https://placehold.it/142x142",
    booksCount: 25
  }
];
