import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API_URL from '../config/api'
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
      const response = await fetch(`${API_URL}/posts/${id}`)
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
        await fetch(`${API_URL}/posts/${id}`, {
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
      <div className="loading">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="loading">
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3>Post not found</h3>
          <p>The post you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Go back home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div>
        {/* Back Button */}
        <header className="header">
          <div className="header-content">
            <button onClick={() => navigate('/')} className="btn-back">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to posts
            </button>
            <div className="logo">
              <div className="logo-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Patricks Posts</span>
            </div>
          </div>
        </header>
        {/* Post Card */}
        <div className='article'>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8">
            <h1 className="text-4xl font-bold text-white">
              {post.title}
            </h1>
          </div>
          <div className='card-image'>
            {post.image_url && (
              <div className='p-8'>
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  style={{ width: '100%', maxHeight: '100%', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="article-content">
            <p className="article-text">{post.content}</p>
          </div>

          {/* Footer */}
          <div className="article-footer">
            <button
              onClick={(e) => handleDelete()}
              className="btn-icon"
            >
              <svg style={{ width: '1rem', height: '1rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail