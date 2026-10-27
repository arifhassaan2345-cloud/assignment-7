export const API_BASE_URL =
  "https://api.api-store.workers.dev/api/bazardor";

// সব পণ্যের তথ্য আনার ফাংশন
export async function getProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `পণ্যের তথ্য আনা যায়নি। Status: ${response.status}`
      );
    }

    const data = await response.json();

    console.log("Products API data:", data);

    return data;
  } catch (error) {
    console.error("Products API Error:", error);
    throw error;
  }
}

// সব ক্যাটাগরির তথ্য আনার ফাংশন
export async function getCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
       ` ক্যাটাগরির তথ্য আনা যায়নি। Status: ${response.status}`
      );
    }

    const data = await response.json();

    console.log("Categories API data:", data);

    return data;
  } catch (error) {
    console.error("Categories API Error:", error);
    throw error;
  }
}

// নির্দিষ্ট একটি পণ্যের তথ্য আনার ফাংশন
export async function getProductById(id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `পণ্যের তথ্য আনা যায়নি। Status: ${response.status}`
      );
    }

    const data = await response.json();

    console.log(`Product ${id} API data:`, data);
    console.log("Markets data:", data.product?.markets ?? data.data?.markets ?? data.markets);
    console.log("First market:", (data.product?.markets ?? data.data?.markets ?? data.markets)?.[0]);

    return data;
  } catch (error) {
    console.error(`Product ${id} API Error:`, error);
    throw error;
  }
}