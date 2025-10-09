import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../App.css'

function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${id}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await fetch(`http://localhost:3000/posts/${id}`, {
          method: 'DELETE'
        })
        navigate('/')
      } catch (error) {
        console.error('Error deleting post:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Post not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium transition"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Posts
        </button>

        {/* Post Card */}
        <div className="rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8">
            <h1 className="text-4xl font-bold text-white">
              {post.title}
            </h1>
            <p className="text-sm bg-transparent">
              Post ID: {post.id}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-between items-center">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800text-gray-800 font-semibold py-2 px-6 rounded-lg transition duration-200 transform hover:scale-105 shadow-md"
            >
              Close
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-blue-600 hover:text-blue-800 font-semibold py-2 px-6 rounded-lg transition duration-200 transform hover:scale-105 shadow-md m-2"
            >
              Delete Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail