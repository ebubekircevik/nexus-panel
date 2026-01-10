import type { Product, User, ProductFormData, UserFormData } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const productApi = {
  getAll: async (search?: string, category?: string): Promise<Product[]> => {
    let url = '/products';
    const params = new URLSearchParams();

    if (category && category !== 'all') {
      params.append('category', category);
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    let products = await fetchAPI<Product[]>(url);

    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    return products.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getById: async (id: string): Promise<Product | null> => {
    try {
      return await fetchAPI<Product>(`/products/${id}`);
    } catch {
      return null;
    }
  },

  create: async (data: ProductFormData): Promise<Product> => {
    const newProduct: Product = {
      id: Date.now().toString(),
      ...data,
      image: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400',
      createdAt: new Date().toISOString(),
    };

    return await fetchAPI<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(newProduct),
    });
  },

  update: async (id: string, data: ProductFormData): Promise<Product> => {
    const existing = await productApi.getById(id);
    if (!existing) {
      throw new Error('Product not found');
    }

    const updatedProduct: Product = {
      ...existing,
      ...data,
    };

    return await fetchAPI<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedProduct),
    });
  },

  delete: async (id: string): Promise<void> => {
    await fetchAPI<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

export const userApi = {
  getAll: async (): Promise<User[]> => {
    const users = await fetchAPI<User[]>('/users');
    return users.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getById: async (id: string): Promise<User | null> => {
    try {
      return await fetchAPI<User>(`/users/${id}`);
    } catch {
      return null;
    }
  },

  create: async (data: UserFormData): Promise<User> => {
    const newUser: User = {
      id: Date.now().toString(),
      ...data,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      createdAt: new Date().toISOString(),
    };

    return await fetchAPI<User>('/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
    });
  },

  update: async (id: string, data: UserFormData): Promise<User> => {
    const existing = await userApi.getById(id);
    if (!existing) {
      throw new Error('User not found');
    }

    const updatedUser: User = {
      ...existing,
      ...data,
    };

    return await fetchAPI<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedUser),
    });
  },

  delete: async (id: string): Promise<void> => {
    await fetchAPI<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};
