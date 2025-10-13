import { useState } from 'react'
 
const PostForm = ({hideForm, fetchPosts, editingPost}) =>{
    const [title, setTitle] = useState(editingPost ? editingPost.title : '')
    const [content, setContent] = useState(editingPost ? editingPost.content : '')
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(editingPost ? editingPost.image_url : null)

    // Create post
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try { 
        const formData = new FormData()
        formData.append('post[title]', title)
        formData.append('post[content]', content)
        if (image) {
            formData.append('post[image]', image)
        }

        const url = editingPost 
        ? `http://localhost:3000/posts/${editingPost.id}`
        : 'http://localhost:3000/posts'
      
        const method = editingPost ? 'PATCH' : 'POST'

        const response = await fetch(url, {
            method: method,
            body: formData
        })
        
        if (response.ok) {
            setImage(null)
            hideForm()
            fetchPosts()
        }
    } catch (error) {
        console.error(`Error creating post: ${error}`)
    }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
        setImage(file)
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
        }
    }

    return (
        <div className="modal-overlay" onClick={hideForm}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className='modal-header'>
                    <button onClick={hideForm} className="modal-close">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2>{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
                    <p>{editingPost ? 'Update your post' : 'Share your ideas with the world'}</p>
                </div>
                <div className="container">
                    <form onSubmit={handleSubmit} className='form'>
                        <div className='row items-center'>
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className='input'
                            />
                            <textarea
                                placeholder="Content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                className='input'
                            />
                            <input
                                placeholder="Image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ 
                                display: 'block',
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid rgb(226 232 240)',
                                borderRadius: '0.75rem',
                                cursor: 'pointer'
                                }}
                            />
                        {editingPost && (
                            <div className="image-preview">
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                            />
                            </div>
                        )}
                        </div>
                        <div className='row items-center'>
                            <button type="submit" className='btn btn-primary'>{editingPost ? 'Update' : 'Create'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PostForm;