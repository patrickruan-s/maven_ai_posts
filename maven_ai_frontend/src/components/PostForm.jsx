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
        <div className="rounded-xl shadow-lg  content-center mb-8 border border-white-200">
            <form onSubmit={handleSubmit}>
            <div className = 'col'>
                <div className='row items-center p-3'>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className='border border-white-200'
                />
                </div>
                <div className='row items-center'>
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className='border border-white-200'
                />
                </div>
                <div className='row items-center'>
                    <button type="submit">Create Post</button>
                </div>
            </div>
            </form>
        </div>
    )
}

export default PostForm;