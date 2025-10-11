"use client"

import { useEffect, useRef } from 'react'

interface FlyingAnimationProps {
  imageUrl: string
  count?: number
  speed?: number
  size?: number
  enabled?: boolean
}

export default function FlyingAnimation({ 
  imageUrl, 
  count = 20, 
  speed = 3, 
  size = 30,
  enabled = true 
}: FlyingAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationIdRef = useRef<number>()

  useEffect(() => {
    if (!enabled || !containerRef.current) return

    const container = containerRef.current

    // Create flying elements
    const elements: Array<{
      element: HTMLImageElement
      x: number
      y: number
      speedX: number
      speedY: number
      rotation: number
      rotationSpeed: number
    }> = []

    const createElement = () => {
      const img = document.createElement('img')
      img.src = imageUrl
      img.style.position = 'absolute'
      img.style.width = `${size}px`
      img.style.height = `${size}px`
      img.style.pointerEvents = 'none'
      img.style.zIndex = '1'
      img.style.userSelect = 'none'
      img.style.opacity = '0.8'
      
      container.appendChild(img)

      const element = {
        element: img,
        x: Math.random() * window.innerWidth,
        y: -size,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: Math.random() * speed + 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2
      }

      elements.push(element)
      return element
    }

    // Initialize elements
    for (let i = 0; i < count; i++) {
      const element = createElement()
      element.y = Math.random() * window.innerHeight
    }

    const animate = () => {
      elements.forEach((element, index) => {
        // Update position
        element.x += element.speedX
        element.y += element.speedY
        element.rotation += element.rotationSpeed

        // Apply transformations
        element.element.style.left = `${element.x}px`
        element.element.style.top = `${element.y}px`
        element.element.style.transform = `rotate(${element.rotation}deg)`

        // Reset if off screen
        if (element.y > window.innerHeight + size) {
          element.y = -size
          element.x = Math.random() * window.innerWidth
        }

        if (element.x < -size) {
          element.x = window.innerWidth + size
        } else if (element.x > window.innerWidth + size) {
          element.x = -size
        }
      })

      animationIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      elements.forEach(element => {
        if (element.element.parentNode) {
          element.element.parentNode.removeChild(element.element)
        }
      })
    }
  }, [imageUrl, count, speed, size, enabled])

  if (!enabled) return null

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    />
  )
}
