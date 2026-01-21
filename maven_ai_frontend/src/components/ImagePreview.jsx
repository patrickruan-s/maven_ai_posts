import { useState, useEffect, useCallback } from 'react'

const ImagePreview = ({imageUrls}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [slideDirection, setSlideDirection] = useState('')

    // Clean up blob URLs when component unmounts or images change
    useEffect(() => {
        if (!imageUrls) return
        return () => {
            imageUrls.forEach(url => URL.revokeObjectURL(url))
        }
    }, [imageUrls])

    const handlePageChange = useCallback((direction) => {
        if (!imageUrls) return
        const newIndex = currentImageIndex + direction
        if (newIndex >= 0 && newIndex < imageUrls.length) {
            setSlideDirection(direction > 0 ? 'slide-left' : 'slide-right')
            setTimeout(() => {
                setCurrentImageIndex(newIndex)
                setSlideDirection('')
            }, 30)
        }
    }, [currentImageIndex, imageUrls])

    if (!imageUrls || imageUrls.length === 0) {
        return null
    }

    const currentImageUrl = imageUrls[currentImageIndex]

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <div className="image-preview" style={{ position: 'relative', overflow: 'hidden' }}>
                    <button
                        type="button"
                        onClick={() => handlePageChange(-1)}
                        className="arrow-btn-back arrow-btn
                        "
                        aria-label="Previous"
                        disabled={currentImageIndex === 0}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                                aria-hidden="true"
                            >
                            <path
                                d="M8 5l8 7-8 7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <img
                        key={currentImageIndex}
                        src={currentImageUrl}
                        className={slideDirection}
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '400px',
                            objectFit: 'contain',
                            animation: slideDirection ? `${slideDirection} 0.3s ease-in-out` : 'none'
                        }}
                    />
                <button
                    type="button"
                    onClick={() => handlePageChange(1)}
                    className="arrow-btn-next arrow-btn"
                    aria-label="Next"
                    disabled={currentImageIndex === imageUrls.length - 1}
                    style={{
                        opacity: currentImageIndex === imageUrls.length - 1 ? 0.3 : 1
                    }}>
                    <svg
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            aria-hidden="true"
                        >
                        <path
                            d="M8 5l8 7-8 7"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                </div>
        </div>
    )
}

export default ImagePreview
