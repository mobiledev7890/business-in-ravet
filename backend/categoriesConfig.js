// Backend copy of your categories so we can drive scheduled syncs and API responses.
// Later, these can move into the database if you want them fully dynamic.

const categories = [
  {
    id: 'grocery',
    title: 'Grocery Shops',
    icon: 'shopping-cart',
    searchTerm: 'grocery store ravet pune',
    placeType: 'grocery_or_supermarket',
  },
  {
    id: 'salon',
    title: 'Salons',
    icon: 'cut',
    searchTerm: 'salon ravet pune',
    placeType: 'beauty_salon',
  },
  {
    id: 'hardware',
    title: 'Hardware Shops',
    icon: 'tools',
    searchTerm: 'hardware store ravet pune',
    placeType: 'hardware_store',
  },
  {
    id: 'restaurant',
    title: 'Restaurants',
    icon: 'utensils',
    searchTerm: 'restaurant ravet pune',
    placeType: 'restaurant',
  },
];

module.exports = {
  categories,
};


