import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const genreData = [
    { name: 'Fiction', slug: 'fiction' },
    { name: 'Science Fiction', slug: 'science-fiction' },
    { name: 'History', slug: 'history' },
    { name: 'Technology', slug: 'technology' },
    { name: 'Biography', slug: 'biography' },
  ];

  const genres: Record<string, number> = {};
  for (const g of genreData) {
    const genre = await prisma.genre.upsert({
      where: { slug: g.slug },
      update: {},
      create: g,
    });
    genres[g.slug] = genre.id;
  }

  const books = [
    // Fiction
    { title: 'Things Fall Apart', author: 'Chinua Achebe', isbn: '9780385474542', genre: 'fiction' },
    { title: 'Half of a Yellow Sun', author: 'Chimamanda Ngozi Adichie', isbn: '9781400095209', genre: 'fiction' },
    { title: 'Cry, the Beloved Country', author: 'Alan Paton', isbn: '9780743262163', genre: 'fiction' },
    { title: 'Americanah', author: 'Chimamanda Ngozi Adichie', isbn: '9780307455925', genre: 'fiction' },
    // Science Fiction
    { title: 'Dune', author: 'Frank Herbert', isbn: '9780441013593', genre: 'science-fiction' },
    { title: 'Binti', author: 'Nnedi Okorafor', isbn: '9780765385253', genre: 'science-fiction' },
    { title: 'Neuromancer', author: 'William Gibson', isbn: '9780441569595', genre: 'science-fiction' },
    { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', isbn: '9780441478125', genre: 'science-fiction' },
    // History
    { title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '9780062316110', genre: 'history' },
    { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', isbn: '9780393317558', genre: 'history' },
    { title: 'The Scramble for Africa', author: 'Thomas Pakenham', isbn: '9780349104492', genre: 'history' },
    { title: 'A History of South Africa', author: 'Frank Welsh', isbn: '9780007338696', genre: 'history' },
    // Technology
    { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', genre: 'technology' },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '9780135957059', genre: 'technology' },
    { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', isbn: '9781449373320', genre: 'technology' },
    { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', isbn: '9781593279509', genre: 'technology' },
    // Biography
    { title: 'Long Walk to Freedom', author: 'Nelson Mandela', isbn: '9780316548182', genre: 'biography' },
    { title: 'Born a Crime', author: 'Trevor Noah', isbn: '9780399588174', genre: 'biography' },
    { title: 'The Boy Who Harnessed the Wind', author: 'William Kamkwamba', isbn: '9780061730337', genre: 'biography' },
    { title: 'Wangari Maathai: Unbowed', author: 'Wangari Maathai', isbn: '9780307277756', genre: 'biography' },
  ];

  for (const b of books) {
    await prisma.book.upsert({
      where: { isbn: b.isbn },
      update: {},
      create: {
        title: b.title,
        author: b.author,
        isbn: b.isbn,
        totalCopies: 3,
        availableCopies: 3,
        genreId: genres[b.genre],
      },
    });
  }

  console.log('Seeded 5 genres and 20 books');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });