import { displayLoading, hideLoading } from "../script.js";

const BASE_URL = "https://61924d4daeab5c0017105f1a.mockapi.io/credo/v1/news";

export const getAllNews = async () => {
  const endpoint = `${BASE_URL}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const getPaginatedNews = async (pageNumber, limit) => {
  const endpoint = `${BASE_URL}?page=${pageNumber}&limit=${limit}`;
  displayLoading();
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data = await response.json();
    hideLoading();
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const getNewsById = async (id) => {
  const endpoint = `${BASE_URL}/${id}`;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const createNews = async (payload) => {
  const endpoint = `${BASE_URL}`;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

export const updateNews = async (id, payload) => {
  const endpoint = `${BASE_URL}/${id}`;
  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

export const deleteNews = async (id) => {
  const endpoint = `${BASE_URL}/${id}`;
  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
    });
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error.message);
  }
}

export const getUserComments = async (id) => {
  const endpoint = `${BASE_URL}/${id}/comments`;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

export const postComment = async (id, comment) => {
  const endpoint = `${BASE_URL}/${id}/comments`;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    });
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

export const deleteComment = async (newsId, commentId) => {
  const endpoint = `${BASE_URL}/${newsId}/comments/${commentId}`;
  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
    });
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

export const updateComment = async(newsId, id, payload) => {
  const endpoint = `${BASE_URL}/${newsId}/comments/${id}`;
  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
}