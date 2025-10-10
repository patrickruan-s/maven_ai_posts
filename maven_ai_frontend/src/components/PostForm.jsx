import { useState} from 'react'
 
const PostForm = ({hideForm, fetchPosts}) =>{
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    // Create post
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try { await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content })
        })
        hideForm();
        fetchPosts();
    } catch (error) {
        console.error(`Error creating post: ${error}`)
    }
    }

    return (
        <div className="modal-overlay" onClick={hideForm}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button onClick={hideForm} className="modal-close">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
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
                        </div>
                        <div className='row items-center'>
                            <button type="submit" className='btn btn-primary'>Create Post</button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
    )
}

export default PostForm;