import Header from '../../components/Header';
import { fetchAllPosts, fetchAllUsers, fetchAllComments } from '../../lib/api';
import { FaUser } from "react-icons/fa6";
import { IoIosStarOutline } from "react-icons/io";
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { FaHashtag } from "react-icons/fa";
import { MdOutlineAddReaction } from "react-icons/md";
import { PiCursorClick } from "react-icons/pi";

type Post = {
    id: number;
    title: string;
    body: string;
    tags: string[];
    reactions: {
        likes: number;
        dislikes: number;
    };
    views: number;
};

type User = {
    id: number;
    firstName: string;
    lastName: string;
    image: string;
};

type Comment = {
    id: number;
    body: string;
    likes: number;
    user: {
        username: string;
        fullName: string;
    };
};

type Props = {
    params: { id: string };
};

const PostDetail = async ({ params }: Props) => {
    const posts: Post[] = await fetchAllPosts();
    const users: User[] = await fetchAllUsers();
    const comments: Comment[] = await fetchAllComments();

    const post = posts.find((p) => p.id === Number(params.id));
    const user = users.find((u) => u.id === Number(params.id));
    const comment = comments.find((c) => c.id === Number(params.id)); // Post ID ile aynı ID'ye sahip yorumu bul

    if (!post) {
        return <div className="text-center text-red-500">Post not found.</div>;
    }

    return (
        <>
            <Header />

            <div className="container mx-auto px-56 mt-8 bg-gray-100 min-h-screen pt-20">
                {user && (
                    <div className="mb-6 flex justify-center">
                        <img
                            src={user.image}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-32 h-32 rounded-full shadow-md"
                        />
                    </div>
                )}

                <h1 className="text-xl font-bold text-center text-black mb-6">{post.title}</h1>
                <p className="text-gray-900 text-base mb-24">{post.body}</p>


                <div className="bg-gray-100 mb-12">
                    {comment ? (
                        <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg text-center font-bold mb-4 text-gray-800">Comments</h2>
                            <p className="mb-2 text-gray-700 flex items-center">
                                {Array(comment.likes).fill(null).map((_, index) => (
                                    <IoIosStarOutline key={index} className="text-yellow-500 text-xl mr-2 mb-2" />
                                ))}
                            </p>
                            <p className="mb-2 text-gray-700 flex items-center text-sm"><FaUser className='mr-2' /><strong>{comment.user.username} - {comment.user.fullName}</strong></p>
                            <p className="mb-2 text-gray-700">{comment.body}</p>
                        </div>
                    ) : (
                        <div className="mt-10 bg-gray-200 p-6 rounded-lg shadow-md">
                            <p className="text-gray-600 text-center">No comments available for this post.</p>
                        </div>
                    )}
                </div>

                <div className="mb-4 mt-3 text-black flex items-center text-xs">
                    <FaHashtag className='font-bold mr-2' />
                    {post.tags.length > 0 ? (
                        post.tags.map((tag, index) => (
                            <span key={index} className="bg-green-400 text-black px-2 py-1 rounded-lg mr-2">
                                {tag}
                            </span>
                        ))
                    ) : (
                        <span>No tags available</span>
                    )}
                </div>

                <div className="mb-4 text-black flex items-center">
                    <span className="mr-6 flex items-center text-sm"><BiLike className='mr-2' />{post.reactions.likes}</span>
                    <span className="mr-6 flex items-center text-sm"><BiDislike className='mr-2' /> {post.reactions.dislikes}</span>
                </div>

                <div className="text-black flex items-center pb-8">
                    <PiCursorClick className='font-bold mr-2' />
                    <span className='text-sm'>{post.views}</span>
                </div>
            </div>
        </>
    );
};

export default PostDetail;
