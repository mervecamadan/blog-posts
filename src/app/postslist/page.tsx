'use client';

import React, { useState, useEffect } from 'react';
import { fetchPostsPaginated, fetchAllUsers, fetchTags } from '../lib/api';
import Header from '../components/Header';
import Link from 'next/link';
import { FaFilter } from 'react-icons/fa';

type Post = {
    id: number;
    title: string;
    body: string;
    tags: string[];
};

type User = {
    id: number;
    firstName: string;
    lastName: string;
    image: string;
};

const PostsList = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPosts] = useState(30);
    const [tags, setTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const postsPerPage = 6;

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const { posts: postsData } = await fetchPostsPaginated(currentPage, postsPerPage);
                console.log("API Response:", postsData);
                const usersData = await fetchAllUsers();
                const tagsData = await fetchTags();
                setPosts(postsData);
                setFilteredPosts(postsData);
                setUsers(usersData);
                setTags(tagsData);
            } catch (error) {
                console.error('Veri yükleme hatası:', error);
            }
        };

        loadInitialData();
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const findUserImage = (postId: number) => {
        const user = users.find((user) => user.id === postId);
        return user?.image || '';
    };

    const handleTagChange = (tag: string) => {
        setSelectedTags((prevTags) =>
            prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
        );
    };

    useEffect(() => {
        if (selectedTags.length === 0) {
            setFilteredPosts(posts);
        } else {
            setFilteredPosts(
                posts.filter((post) => selectedTags.some((tag) => post.tags.includes(tag)))
            );
        }
    }, [selectedTags, posts]);

    const totalPages = Math.ceil(totalPosts / postsPerPage);

    return (
        <>
            <Header />

            <div className="bg-gray-100 min-h-screen text-black pt-20">
                <div className="container mx-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-black flex-grow text-center">
                            Recently Posts
                        </h1>
                        <button
                            onClick={() => setIsFilterVisible(!isFilterVisible)}
                            className="text-2xl text-gray-700 hover:text-black"
                        >
                            <FaFilter />
                        </button>
                    </div>

                    {/* Filtre */}
                    {isFilterVisible && (
                        <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
                            <h2 className="flex justify-center items-center text-lg font-semibold text-black mb-4">Filter by Tags</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {tags.map((tag) => (
                                    <label key={tag} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            value={tag}
                                            checked={selectedTags.includes(tag)}
                                            onChange={() => handleTagChange(tag)}
                                            className="mr-2"
                                        />
                                        <span className="text-gray-700">{tag}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Post Listeleme */}
                    {filteredPosts.length === 0 ? (
                        <p className="text-center text-gray-500">No posts match the selected tags.</p>
                    ) : (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
                                {filteredPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                                    >
                                        <div className="flex justify-center mb-4 mt-8">
                                            <img
                                                src={findUserImage(post.id)}
                                                alt={`User ${post.id}`}
                                                className="w-24 h-24 rounded-full shadow-md"
                                            />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-800 text-center">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-600 mt-3 px-8">
                                            {post.body.split('. ').slice(0, 2).join('. ')}...
                                        </p>
                                        <div className="flex justify-end mt-4">
                                            <Link
                                                href={`/posts/${post.id}`}
                                                className="text-sm font-bold text-white bg-black px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                            >
                                                Read More
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-center mt-8 space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-lg ${currentPage === 1
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-black text-white hover:bg-gray-500'
                                        }`}
                                >
                                    Previous
                                </button>
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(index + 1)}
                                        className={`px-4 py-2 rounded-lg ${currentPage === index + 1
                                            ? 'bg-black text-white'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 rounded-lg ${currentPage === totalPages
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-black text-white hover:bg-gray-500'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PostsList;
