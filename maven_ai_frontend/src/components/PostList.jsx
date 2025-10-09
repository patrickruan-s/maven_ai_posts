import { useState, useEffect } from 'react'
import PostForm from './PostForm'
import { useNavigate } from 'react-router-dom'

function PostList() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showPostForm, setShowPostForm] = useState(false);

  // Fetch posts
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {const response = await fetch('http://localhost:3000/posts')
      const data = await response.json()
      setPosts(data) 
    } catch (error) {
      console.error(`Error fetching posts: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Delete post
  const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
        try { await fetch(`http://localhost:3000/posts/${id}`, {
          method: 'DELETE'
        })
        fetchPosts()
      } catch (error) {
        console.error('Error deleting post:', error)
      }
    }
  }

  //show Create Form
  const showForm = async () => {
    setShowPostForm(true);
  }

  //hide Create Form
  const hideForm = async () => {
    setShowPostForm(false);
  }

  //
  const handleCardClick = (postId) => {
    navigate(`/posts/${postId}`)
  }

  if (isLoading) {
    return (
      <div className="items bg-transparent justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="App">
      <h1 className='App-Header row'>
        Patrick's Posts
      </h1>

      <div className='p-6'>
        {showPostForm ? (
          <PostForm hideForm={hideForm} fetchPosts={fetchPosts} />
        ) : (
          <button onClick={showForm}>+</button>
        )}
      </div>


      {posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-gray-500 text-lg">
              No posts yet. Create your first post above!
            </p>
          </div>
          ) : (
        <div className="posts grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto justify-items-center">
          {posts.map(post => (
            <div key={post.id} className="bg-transparent rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col">
              <button onClick={() => handleCardClick(post.id)}>
                <h2 className="text-xl font-bold text-white-800 mb-3 line-clamp-2">{post.title}</h2>
                <p className="text-white-600 leading-relaxed line-clamp-4">{post.content}</p>
              </button>
              <button onClick={() => handleDelete(post.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PostList