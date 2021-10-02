import { useEffect, useRef } from "react"

export default function PulseCanvas({ dataPoints, maxPoints, color }) {
  const canvasRef = useRef(null)
  const animationFrameId = useRef(0)
  const pulseCount = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.width = window.innerWidth - 100
    canvas.height = window.innerHeight - 420

    const context = canvas.getContext("2d")
    context.strokeStyle = color
    context.fillStyle = color

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.innerWidth, window.innerHeight, color])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    const draw = () => {
      pulseCount.current++
      let maxPrice = 0
      let minPrice = 0

      dataPoints.forEach(({ price }) => {
        if (price > maxPrice) {
          maxPrice = price
        } else if (price < minPrice || minPrice === 0) {
          minPrice = price
        }
      })

      const pulseRadius = 7 * Math.sin(pulseCount.current * 0.05) ** 2
      const getX = (index) => (canvas.width / maxPoints) * index
      const getY = (price) =>
        Math.abs(
          (canvas.height / (maxPrice - minPrice)) * (price - minPrice) -
            canvas.height
        )

      // draw the pulse dot
      context.clearRect(0, 0, context.canvas.width, context.canvas.height)
      context.beginPath()
      context.arc(
        dataPoints.length >= canvas.width
          ? getX(canvas.width - pulseRadius)
          : dataPoints.length
          ? getX(dataPoints.length - 1)
          : getX(0),
        dataPoints.length
          ? getY(dataPoints[dataPoints.length - 1].price)
          : getY(0),
        pulseRadius,
        0,
        2 * Math.PI
      )
      context.fill()

      // draw the graph lines
      context.beginPath()
      dataPoints.forEach(({ price }, i) => {
        if (i === 0) {
          context.moveTo(getX(i), getY(price))
        } else {
          context.lineTo(getX(i), getY(price))
        }
      })
      context.stroke()

      animationFrameId.current = window.requestAnimationFrame(draw)
    }

    draw()
    return () => {
      window.cancelAnimationFrame(animationFrameId.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataPoints, maxPoints])

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  )
}
