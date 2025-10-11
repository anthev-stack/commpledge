"use client"

import { useTheme } from './ThemeProvider'
import FlyingAnimation from './FlyingAnimation'

export default function ThemeAnimation() {
  const { themeName } = useTheme()

  if (themeName === 'halloween') {
    return (
      <FlyingAnimation
        imageUrl="/images/bat.gif"
        count={15}
        speed={2}
        size={25}
        enabled={true}
      />
    )
  }

  if (themeName === 'christmas') {
    return (
      <FlyingAnimation
        imageUrl="/images/snowflake.gif"
        count={25}
        speed={1.5}
        size={20}
        enabled={true}
      />
    )
  }

  return null
}
