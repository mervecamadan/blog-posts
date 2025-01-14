"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { FaUser } from "react-icons/fa6";
import { fetchAllPosts } from "../lib/api";

// Debounce fonksiyonu
const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: Parameters<T>): void => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

const Header: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const debounceSearch = useCallback(
        debounce(async (query: string) => {
            if (query.trim()) {
                try {
                    const posts = await fetchAllPosts();
                    const filteredPosts = posts.filter((post: any) =>
                        post.title.toLowerCase().includes(query.toLowerCase())
                    );
                    setSearchResults(filteredPosts);
                } catch (error) {
                    console.error("Arama hatası:", error);
                    setSearchResults([]);
                }
            } else {
                setSearchResults([]);
            }
        }, 400),
        []
    );

    useEffect(() => {
        debounceSearch(searchTerm);
    }, [searchTerm, debounceSearch]);

    return (
        <div className="bg-black text-[#F5F3F0] px-8 py-4 flex justify-between items-center z-20 fixed top-0 left-0 w-full">
            <div className="text-xl font-bold">
                <Link href="/">Posts - Docs</Link>
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 rounded-lg text-black text-sm w-48"
                    />
                    {searchResults.length > 0 && (
                        <ul className="absolute mt-2 bg-white text-black rounded-lg shadow-lg w-56 max-h-60 overflow-y-auto top-full">
                            {searchResults.map((result: any) => (
                                <li key={result.id} className="px-4 py-2 hover:bg-gray-200 text-base">
                                    <Link href={`/posts/${result.id}`}>{result.title}</Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Header;
