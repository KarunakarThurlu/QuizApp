import React, { useState} from 'react'
import Cropper from 'react-easy-crop'

const ImageCropper = ({ getBlob, inputImg }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const onCropComplete = async (_, croppedAreaPixels) => {
        const croppedImage = await getCroppedImg(inputImg, croppedAreaPixels);
        getBlob(croppedImage)
    }
    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image()
            image.addEventListener('load', () => resolve(image))
            image.addEventListener('error', error => reject(error))
            image.setAttribute('crossOrigin', 'anonymous')
            image.src = url
        })

    const getCroppedImg = async (imageSrc, crop) => {
        const image = await createImage(imageSrc)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = 250
        canvas.height = 250
        ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob)
            }, 'image/jpeg')
        })
    }
    return (
        <>
            <Cropper
                image={inputImg}
                crop={crop}
                zoom={zoom}
                showGrid={false}
                cropShape="round"
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
            />
            {/* <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e, zoom) => setZoom(zoom)}
                classes={{ container: 'slider' }}
            /> */}
        </>
    );
}

export default ImageCropper;
