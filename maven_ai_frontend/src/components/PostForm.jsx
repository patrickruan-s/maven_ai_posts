import { useState } from 'react'
 
const PostForm = ({hideForm, fetchPosts, editingPost}) =>{
    const [title, setTitle] = useState(editingPost ? editingPost.title : '')
    const [content, setContent] = useState(editingPost ? editingPost.content : '')
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(editingPost ? editingPost.image_url : null)
    const [externalImageUrl, setExternalImageUrl] = useState(null)
    const [description, setDescription] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [rateLimitWait, setRateLimitWait] = useState(0)

    // Create post
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
        const formData = new FormData()
        formData.append('post[title]', title)
        formData.append('post[content]', content)
        if (image) {
            formData.append('post[image]', image)
        } else if (externalImageUrl) {
            formData.append('post[external_image_url]', externalImageUrl)
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
        setExternalImageUrl(null) // Clear external URL when user uploads a file
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
        }
    }

    const handleGenerate = async (e) => {
        e.preventDefault()

        if (!description.trim()) {
            alert('Please enter a description for the post')
            return
        }

        setIsGenerating(true)

        try {
            const response = await fetch('http://localhost:3000/posts/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description })
            })

            if (response.ok) {
                const data = await response.json()
                console.log('Generated data:', data)
                setTitle(data.title || '')
                setContent(data.content || '')
                if (data.image) {
                    console.log('Setting image preview to:', data.image.url)
                    setImagePreview(data.image.url)
                    setExternalImageUrl(data.image.url)
                    setImage(null) // Clear uploaded file when AI generates an image
                } else {
                    console.log('No image in response')
                }
            } else if (response.status === 429) {
                const error = await response.json()
                // Extract wait time from error message if available
                const waitMatch = error.error?.match(/(\d+) seconds/)
                const waitTime = waitMatch ? parseInt(waitMatch[1]) : 10
                setRateLimitWait(waitTime)

                // Countdown timer
                const countdownInterval = setInterval(() => {
                    setRateLimitWait(prev => {
                        if (prev <= 1) {
                            clearInterval(countdownInterval)
                            return 0
                        }
                        return prev - 1
                    })
                }, 1000)

                alert(error.error || 'Too many requests. Please wait a moment and try again.')
            } else {
                const error = await response.json()
                alert(`Error: ${error.error || 'Failed to generate post'}`)
            }
        } catch (error) {
            console.error(`Error generating post: ${error}`)
            alert('Failed to generate post. Please try again.')
        } finally {
            setIsGenerating(false)
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
                    {!editingPost && (
                        <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '0.75rem' }}>
                            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>Generate with AI</h3>
                            <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>Describe your post idea and let AI create it for you</p>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="e.g., Write a blog post about the benefits of meditation"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled={isGenerating || rateLimitWait > 0}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        border: '1px solid rgb(226 232 240)',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || rateLimitWait > 0}
                                >
                                    {isGenerating ? 'Generating...' : rateLimitWait > 0 ? `Wait ${rateLimitWait}s` : 'Generate'}
                                </button>
                            </div>
                        </div>
                    )}
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
                        {imagePreview && (
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