import { Book, Author, Category, PromoSlide } from "@/types";

export const promoSlides: PromoSlide[] = [
  {
    id: "1",
    titlePrefix: "The Bookworm Editors'",
    titleHighlighted: "February",
    titleSuffix: "Featured Books of the",
    subtitle: "Featured Books of the",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-12.png",
    actionUrl: "#"
  },
  {
    id: "2",
    titlePrefix: "The Bookworm Editors'",
    titleHighlighted: "February",
    titleSuffix: "Featured Books of the",
    subtitle: "Featured Books of the",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-13.png",
    actionUrl: "#"
  },
  {
    id: "3",
    titlePrefix: "The Bookworm Editors'",
    titleHighlighted: "February",
    titleSuffix: "Featured Books of the",
    subtitle: "Featured Books of the",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-22.png",
    actionUrl: "#"
  },
  {
    id: "4",
    titlePrefix: "The Bookworm Editors'",
    titleHighlighted: "February",
    titleSuffix: "Featured Books of the",
    subtitle: "Featured Books of the",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-14.png",
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
    title: "Angry God (All Saints High Book 3)",
    author: "L.J. Shen",
    price: 1.30,
    originalPrice: 1.75,
    category: "Kindle Edition",
    format: "KINDLE",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-17.png"
  },
  {
    id: "bs2",
    title: "Dark in Death: An Eve Dallas Novel (In Dea...",
    author: "J. D. Robb",
    price: 14.20,
    category: "Hard Cover",
    format: "HARDCOVER",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-18.png"
  },
  {
    id: "bs3",
    title: "The Last Sister (Columbia River Book 1)",
    author: "Conn Iggulden",
    price: 29.59,
    priceRange: "$29.59 - $59.99",
    category: "Hard Cover",
    format: "HARDCOVER, KINDLE, PAPE...",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-16.png"
  },
  {
    id: "bs4",
    title: "The Last Sister (Columbia River Book 1)",
    author: "Jessica Simpson, Max L...",
    price: 16.59,
    category: "Hard Cover",
    format: "HARDCOVER",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-19.png"
  },
  {
    id: "bs5",
    title: "Think Like a Monk: Train Your Mind for...",
    author: "Luanne Rice",
    price: 1.75,
    category: "Kindle Edition",
    format: "KINDLE",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-11.png"
  },
  {
    id: "bs6",
    title: "Atomic Habits: An Easy & Proven Way",
    author: "James Clear",
    price: 22.00,
    category: "Paperback",
    format: "PAPERBACK",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-20.png"
  },
  {
    id: "bs7",
    title: "Becoming",
    author: "Michelle Obama",
    price: 25.00,
    category: "Hard Cover",
    format: "HARDCOVER",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-16.png"
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
      title: "All You Can Ever Know: A Memoir",
      author: "Nicole Chung",
      price: 29.59,
      priceRange: "$29.59 - $59.95",
      category: "Hardcover, Kindle, Paperback",
      format: "HARDCOVER, KINDLE, ...",
      imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-17.png"
    },
    {
      id: "f2",
      title: "Dark in Death: An Eve Dallas Novel",
      author: "J. D. Robb",
      price: 14.20,
      category: "Hardcover",
      format: "HARDCOVER",
      imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-18.png"
    },
    {
      id: "f3",
      title: "Ask Again, Yes: A Novel",
      author: "Mary Beth Keane",
      price: 11.51,
      category: "Paperback",
      format: "PAPERBACK",
      imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-12.png"
    },
    {
      id: "f4",
      title: "Broken Faith: Inside the Word of God...",
      author: "Edward Lee",
      price: 10.29,
      category: "Paperback",
      format: "PAPERBACK",
      imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-16.png"
    },
    {
      id: "f5",
      title: "Think Like a Monk: Train Your Mind for Peace and Purpose Everyday",
      author: "Jay Shetty",
      price: 29.00,
      category: "Paperback",
      format: "PAPERBACK",
      imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-12.png"
    },
    {
      id: "f6",
      title: "Eternity Springs: The McBrides of...",
      author: "Emily March",
      price: 6.99,
      category: "Paperback",
      format: "PAPERBACK",
      imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-19.png"
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
      imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-19.png"
    },
    {
      id: "o2",
      title: "Educated: A Memoir",
      author: "Tara Westover",
      price: 12,
      originalPrice: 18,
      category: "Paperback",
      format: "Paperback",
      imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-18.png"
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
      imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-12.png"
    },
    {
      id: "m2",
      title: "Atomic Habits: An Easy & Proven Way to Build Good Habits",
      author: "James Clear",
      price: 22,
      category: "Paperback",
      format: "Paperback",
      imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-20.png"
    }
  ]
};

export const dealsOfWeekBooks: Book[] = [
  {
    id: "d1",
    title: "When We Believed in Mermaids: A Novel",
    author: "Barbara O'Neal",
    price: 2.00,
    category: "Paperback",
    format: "PAPERBACK",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/1.jpg"
  },
  {
    id: "d2",
    title: "Angry God (All Saints High Book 3)",
    author: "L.J. Shen",
    price: 1.30,
    originalPrice: 1.75,
    category: "Kindle Edition",
    format: "KINDLE",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/22.jpg"
  },
  {
    id: "d3",
    title: "Last Day",
    author: "Luanne Rice",
    price: 1.75,
    category: "Kindle Edition",
    format: "KINDLE",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/3.jpg"
  },
  {
    id: "d4",
    title: "Winter Garden",
    author: "Kristin Hannah",
    price: 11.99,
    category: "Paperback",
    format: "PAPERBACK",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/4.jpg"
  },
  {
    id: "d5",
    title: "The Last Sister (Columbia River Book 1)",
    author: "Kendra Elliot",
    price: 14.95,
    category: "Hard Cover",
    format: "HARDCOVER",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/5.jpg"
  },
  {
    id: "d6",
    title: "Think Like a Monk: Train Your Mind for Peace and Purpose Every Day",
    author: "Jay Shetty",
    price: 16.50,
    category: "Hard Cover",
    format: "HARDCOVER",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/6.jpg"
  },
  {
    id: "d7",
    title: "The Guest List",
    author: "Lucy Foley",
    price: 12.99,
    originalPrice: 16.99,
    category: "Paperback",
    format: "PAPERBACK",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/7.jpg"
  },
  {
    id: "d8",
    title: "The Book of Lost Names",
    author: "Kristin Harmel",
    price: 1.99,
    category: "Kindle Edition",
    format: "KINDLE",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/8.jpg"
  },
  {
    id: "d9",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: 8.99,
    originalPrice: 15.99,
    category: "Paperback",
    format: "PAPERBACK",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/9.jpg"
  },
  {
    id: "d10",
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    price: 9.99,
    category: "Hard Cover",
    format: "HARDCOVER",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/10.jpg"
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
      imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-19.png"
    },
    {
      id: "nr_h2",
      title: "Educated: A Memoir",
      author: "Tara Westover",
      price: 18,
      category: "Paperback",
      format: "Paperback",
      imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-18.png"
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
      imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-12.png"
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
      imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-15.png"
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
      imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-14.png"
    }
  ]
};

export const biographiesBooks: Book[] = [
  {
    id: "bio1",
    title: "The Rural Diaries: Love, Livestock, and Big Life Lessons Down on Mischief Farm",
    author: "Hilarie Burton",
    price: 15,
    category: "Hard Cover",
    format: "Hard Cover",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-15.png"
  },
  {
    id: "bio2",
    title: "The Ride of a Lifetime: Lessons Learned from 15 Years as CEO",
    author: "Robert Iger",
    price: 15,
    category: "Hard Cover",
    format: "Hard Cover",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-19.png"
  },
  {
    id: "bio3",
    title: "Think Like a Monk: Train Your Mind for Peace and Purpose Everyday",
    author: "Jay Shetty",
    price: 29,
    category: "Paperback",
    format: "Paperback",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-12.png"
  }
];

export const favoriteAuthors: Author[] = [
  {
    id: "auth1",
    name: "Barbara O'Neil",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/1.jpg",
    booksCount: 25
  },
  {
    id: "auth2",
    name: "Stephen King",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/3.jpg",
    booksCount: 25
  },
  {
    id: "auth3",
    name: "David Walliams",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/4.jpg",
    booksCount: 25
  },
  {
    id: "auth4",
    name: "Joe Wicks",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/5.jpg",
    booksCount: 25
  },
  {
    id: "auth5",
    name: "Jessica Simpson",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/6.jpg",
    booksCount: 25
  }
];

const baseShopBooks: Book[] = [
  {
    id: "shop1",
    title: "All You Can Ever Know: A Memoir",
    author: "Nicole Chung",
    price: 13.29,
    category: "Biographies & Memoirs",
    format: "PAPERBACK",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-17.png",
    rating: 5
  },
  {
    id: "shop2",
    title: "Dark in Death: An Eve Dallas Novel",
    author: "J. D. Robb",
    price: 14.20,
    category: "Mystery & Thriller",
    format: "HARDCOVER",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-18.png",
    rating: 4
  },
  {
    id: "shop3",
    title: "Broken Faith: Inside the Word of God...",
    author: "Edward Lee",
    price: 10.29,
    category: "Biographies & Memoirs",
    format: "PAPERBACK",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-16.png",
    rating: 4
  },
  {
    id: "shop4",
    title: "The Ride of a Lifetime: Lessons Learned from 15 Years as CEO",
    author: "Robert Iger",
    price: 15.00,
    category: "Biographies & Memoirs",
    format: "HARDCOVER",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-19.png",
    rating: 5
  },
  {
    id: "shop5",
    title: "Beliefs with Dublin: A Story of Learning...",
    author: "Patrick Taylor",
    price: 12.59,
    category: "Literature & Fiction",
    format: "PAPERBACK",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-13.png",
    rating: 3
  },
  {
    id: "shop6",
    title: "Angry God (All Saints High Book 3)",
    author: "L.J. Shen",
    price: 1.30,
    originalPrice: 1.75,
    category: "Romance",
    format: "KINDLE",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-17.png",
    rating: 5
  },
  {
    id: "shop7",
    title: "Ask Again, Yes: A Novel",
    author: "Mary Beth Keane",
    price: 11.51,
    category: "Paperback",
    format: "PAPERBACK",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-12.png",
    rating: 4
  },
  {
    id: "shop8",
    title: "Beneath a Scarlet Sky: A Novel",
    author: "Conn Iggulden",
    price: 2.00,
    originalPrice: 14.00,
    category: "Mystery & Thriller",
    format: "KINDLE EDITION",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-13.png",
    rating: 4
  },
  {
    id: "shop9",
    title: "Beneath a Scarlet Sky: A Novel",
    author: "James Patterson",
    price: 12.99,
    originalPrice: 14.00,
    category: "Mystery & Thriller",
    format: "KINDLE",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-14.png",
    rating: 5
  },
  {
    id: "shop10",
    title: "The Rural Diaries: Love, Livestock, and Big Life Lessons Down on Mischief Farm",
    author: "Hilarie Burton",
    price: 15.00,
    category: "History",
    format: "HARDCOVER",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-15.png",
    rating: 5
  },
  {
    id: "shop11",
    title: "Broken Faith: Inside the Word of God...",
    author: "Edward Lee",
    price: 10.29,
    category: "History",
    format: "HARDCOVER",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-16.png",
    rating: 5
  },
  {
    id: "shop12",
    title: "All You Can Ever Know: A Memoir",
    author: "Nicole Chung",
    price: 13.29,
    category: "History",
    format: "PAPERBACK",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-17.png",
    rating: 4
  },
  {
    id: "shop13",
    title: "Beliefs with Dublin: A Story of Learning...",
    author: "Luanne Rice",
    price: 10.29,
    category: "Literature & Fiction",
    format: "PAPERBACK",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-18.png",
    rating: 3
  },
  {
    id: "shop14",
    title: "By Invitation Only: A Novel",
    author: "Dorothea Benton F...",
    price: 16.79,
    category: "Romance",
    format: "PAPERBACK",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-19.png",
    rating: 4
  },
  {
    id: "shop15",
    title: "Call Me by Your Name",
    author: "Andre Aciman",
    price: 20.95,
    priceRange: "$20.95 - $53.35",
    category: "Romance",
    format: "HARDCOVER, KINDLE, PAPE...",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-20.png",
    rating: 3
  },
  {
    id: "shop16",
    title: "Carrier Minds",
    author: "John Grisham",
    price: 12.99,
    originalPrice: 17.99,
    category: "Sci-Fi & Fantasy",
    format: "PAPERBACK",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-21.png",
    rating: 4
  },
  {
    id: "shop17",
    title: "Conqueror",
    author: "Conn Iggulden",
    price: 25.88,
    category: "History",
    format: "HARDCOVER",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-22.png",
    rating: 5
  },
  {
    id: "shop18",
    title: "Think Like a Monk: Train Your Mind for Peace and Purpose Everyday",
    author: "Jay Shetty",
    price: 29.00,
    category: "Mystery & Thriller",
    format: "HARDCOVER",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-12.png",
    rating: 4
  },
  {
    id: "shop19",
    title: "Beneath a Scarlet Sky: A Novel",
    author: "Conn Iggulden",
    price: 14.00,
    category: "Mystery & Thriller",
    format: "HARDCOVER",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-13.png",
    rating: 4
  },
  {
    id: "shop20",
    title: "Becoming",
    author: "Michelle Obama",
    price: 25.00,
    category: "Mystery & Thriller",
    format: "KINDLE",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-14.png",
    rating: 5
  },
  {
    id: "shop21",
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    price: 19.99,
    category: "Sci-Fi & Fantasy",
    format: "HARDCOVER",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-13.png",
    rating: 5
  },
  {
    id: "shop22",
    title: "The Institute: A Novel",
    author: "Stephen King",
    price: 14.99,
    category: "Mystery & Thriller",
    format: "HARDCOVER",
    imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-12.png",
    rating: 5
  }
];

export const shopBooks: Book[] = [];
for (let i = 0; i < 4; i++) {
  baseShopBooks.forEach((book, idx) => {
    shopBooks.push({
      ...book,
      id: `shop${i * baseShopBooks.length + idx + 1}`
    });
  });
}

