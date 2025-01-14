import axios from 'axios';


export const fetchAllPosts = async () => {
    try {
        const response = await axios.get('https://dummyjson.com/posts');
        return response.data.posts;
    } catch (error) {
        console.error('API Hatası:', error);
        return [];
    }
};

// Pagination destekli postları çeken fonksiyon
export const fetchPostsPaginated = async (page = 1, limit = 10) => {
    try {
        const response = await axios.get('https://dummyjson.com/posts', {
            params: { skip: (page - 1) * limit, limit },
        });
        return response.data;
    } catch (error) {
        console.error('API Hatası:', error);
        return { posts: [], total: 0 };
    }
};


export const fetchAllUsers = async () => {
    try {
        const response = await axios.get('https://dummyjson.com/users');
        return response.data.users;
    } catch (error) {
        console.error('API Hatası:', error);
        return [];
    }
};

export const fetchAllComments = async () => {
    try {
        const response = await axios.get("https://dummyjson.com/comments");
        return response.data.comments;
    } catch (error) {
        console.error("API Hatası:", error);
        return [];
    }
};

export const fetchTags = async (): Promise<string[]> => {
    try {
        const response = await axios.get('https://dummyjson.com/posts');
        const posts = response.data.posts as { tags: string[] }[];

        const uniqueTags = Array.from(
            new Set(posts.flatMap((post) => post.tags))
        );

        return uniqueTags;
    } catch (error) {
        console.error('API Hatası:', error);
        return [];
    }
};

