require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const { PrismaClient } = require('@prisma/client');
const { categories } = require('../categoriesConfig');
const { searchPlaces } = require('../placesService');

const prisma = new PrismaClient();

async function main() {
  console.log('[seed] Starting database seed with categories and businesses...');

  for (const category of categories) {
    console.log(`[seed] Processing category: ${category.id}`);

    // Upsert category first
    const dbCategory = await prisma.category.upsert({
      where: { slug: category.id },
      update: {
        name: category.title,
      },
      create: {
        name: category.title,
        slug: category.id,
      },
    });

    // Fetch places from Google Places API for this category
    const places = await searchPlaces(category.searchTerm, category.placeType);

    console.log(`[seed] Found ${places.length} places for category ${category.id}`);

    for (const place of places) {
      const externalId = place.place_id;
      const lat = place.geometry?.location?.lat ?? null;
      const lng = place.geometry?.location?.lng ?? null;

      await prisma.business.upsert({
        where: { externalId },
        update: {
          name: place.name,
          address: place.formatted_address || null,
          lat,
          lng,
          rating: place.rating ?? null,
          categoryId: dbCategory.id,
        },
        create: {
          externalId,
          name: place.name,
          address: place.formatted_address || null,
          lat,
          lng,
          rating: place.rating ?? null,
          categoryId: dbCategory.id,
        },
      });
    }
  }

  console.log('[seed] Database seed completed.');
}

main()
  .catch((e) => {
    console.error('[seed] Error during seed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


