require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
// Prisma client will be generated after you run `npx prisma generate`
const { PrismaClient } = require('@prisma/client');

const { searchPlaces } = require('./placesService');
const { categories } = require('./categoriesConfig');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Expose categories so the app can stay in sync with backend
app.get('/categories', (req, res) => {
  res.json(categories);
});

// Get all businesses (optionally filtered by category id)
app.get('/businesses', async (req, res) => {
  try {
    const { categoryId } = req.query;

    const businesses = await prisma.business.findMany({
      where: categoryId
        ? { category: { slug: String(categoryId) } }
        : {},
      include: {
        category: true,
      },
    });

    res.json(businesses);
  } catch (err) {
    console.error('Error fetching businesses', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Manual endpoint to trigger refresh (useful for testing without waiting for cron)
app.post('/businesses/refresh', async (req, res) => {
  try {
    await refreshBusinessesFromExternalApi();
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Error refreshing businesses', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function that actually syncs with Google Places and writes to DB
const refreshBusinessesFromExternalApi = async () => {
  for (const category of categories) {
    console.log(`[sync] Fetching places for category: ${category.id}`);

    const places = await searchPlaces(
      category.searchTerm,
      category.placeType,
    );

    for (const place of places) {
      const externalId = place.place_id;

      const lat = place.geometry?.location?.lat ?? null;
      const lng = place.geometry?.location?.lng ?? null;

      // Upsert category by slug (id)
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

      // Upsert business based on external place_id
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
};

// Daily job to refresh businesses from external maps API
cron.schedule('0 3 * * *', async () => {
  console.log('[cron] Refreshing businesses from external API...');

  try {
    await refreshBusinessesFromExternalApi();
  } catch (err) {
    console.error('[cron] Failed to refresh businesses', err);
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Backend API listening on port ${PORT}`);
});


