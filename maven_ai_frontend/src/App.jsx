import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import PostList from './components/PostList'
import PostDetail from './components/PostDetail'

function App() {
  return (
    <div className='items-center'>
    <Router>
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
    </Router>
     </div>
  )
}

export default App