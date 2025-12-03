const BASE_URL = 'http://localhost:4000';

const handleResponse = async (response) => {
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Backend error ${response.status}: ${text || response.statusText}`);
  }
  return response.json();
};

export const fetchCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories`);
  return handleResponse(res);
};

export const fetchBusinesses = async (categoryId) => {
  const url = `${BASE_URL}/businesses?categoryId=${encodeURIComponent(categoryId)}`;
  const res = await fetch(url);
  return handleResponse(res);
};


