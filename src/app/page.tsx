'use client';

import React from 'react';
import Link from 'next/link';

const Home = () => {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center text-center bg-cover bg-center"
      style={{ backgroundImage: 'url("/tasarımm.png")' }}
    >
      <div className="container mx-auto p-6 text-gray-300 font-poppins">
        <h1 className="text-4xl font-bold mb-8">Welcome to Blog Site</h1>
        <p className="text-base mb-16">
          Explore the latest posts and get insights on various topics.
        </p>

        <Link href="/postslist" passHref>
          <button
            className="bg-black text-white px-8 py-2 rounded-lg text-lg hover:bg-gray-800"
          >
            START
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
