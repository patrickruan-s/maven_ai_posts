import { useState, useEffect } from 'react'
import PostForm from './PostForm'
import { useNavigate } from 'react-router-dom'
import '../App.css'

function PostList() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null)


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
  const handleDelete = async (id, e) => {
        e.stopPropagation()
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
    setEditingPost(null)
  }

  //
  const handleCardClick = (postId) => {
    navigate(`/posts/${postId}`)
  }

  const handleEdit = (post, e) => {
    e.stopPropagation();

    setEditingPost(post)
    showForm()
  }

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="logo-text">
              <h1>Patricks Posts</h1>
            </div>
          </div>
          <div>
            <div>
              {showPostForm ? (
                <PostForm hideForm={hideForm} fetchPosts={fetchPosts} editingPost={editingPost}/>
              ) : (
                <button onClick={showForm} className="btn btn-primary">+</button>
              )}
            </div>
          </div>
        </div>
      </header>


      {posts.length === 0 ? (
            <div className="empty-state">
              <h3>No posts yet</h3>
              <p>Create your first post using the form above.</p>
            </div>
          ) : (
        <div className="grid">
          {posts.map(post => (
                <article
                  key={post.id}
                  onClick={() => handleCardClick(post.id)}
                  className="card m-6"
                >
                  <div className="card-accent"></div>
                  <div className="card-image">
                    {post.image_url && (
                      <div style={{ width: '100%', height: '12rem', overflow: 'hidden' }}>
                        <img 
                          src={post.image_url} 
                          alt={post.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                  </div>
            
                  <div className="card-content">
                    <div className="card-header">
                      <span className="card-badge">Article</span>
                      <span className="card-id">#{post.id}</span>
                    </div>
                    
                    <h3 className="card-title line-clamp-2">{post.title}</h3>
                    <p className="card-text line-clamp-3">{post.content}</p>
                  </div>
                  
                  <div className="card-footer">
                    <button
                      onClick={(e) => handleEdit(post, e)}
                      className="btn-icon-edit btn-secondary"
                      title="Edit post"
                    >
                      <svg style={{ width: '1rem', height: '1rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDelete(post.id, e)}
                      className="btn-icon"
                    >
                      <svg style={{ width: '1rem', height: '1rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default PostList