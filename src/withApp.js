import { useEffect, useState } from "react"
import rooster from "./files/rooster.mp3"

const withApp = (Component) => {
  function Hoc(props) {
    const [crypto, setCrypto] = useState("ETH")
    const ticker = crypto.concat("BUSD")
    const backgroundColor = `${
      crypto === "ETH" ? "#1c1c1c" : crypto === "ADA" ? "#141428" : "black"
    }`

    const canvasColor = `${
      crypto === "ETH" ? "green" : crypto === "ADA" ? "#3564f6" : "yellow"
    }`

    const maxQueue = 100
    const fixedDecimals = 3

    const handleChange = (event) => {
      setDataPoints([])
      setCrypto(event.target.value)
    }
    const [dataPoints, setDataPoints] = useState([])
    const [change24hr, setChange24hr] = useState({
      priceChange: 0,
      priceChangePercent: 0,
    })

    const [isMorning, setIsMorning] = useState(false)
    const currDate = new Date()
    const hrs = currDate.getHours()

    useEffect(() => {
      if (hrs < 12) {
        setIsMorning(true)
      } else {
        setIsMorning(false)
      }
    }, [hrs])

    const roosterSound = new Audio(rooster)

    useEffect(() => {
      const livePriceInterval = setInterval(
        () =>
          fetch(`https://www.binance.com/api/v3/ticker/price?symbol=${ticker}`)
            .then(async (response) => {
              const { price } = await response.json()

              setDataPoints((prev) => {
                while (prev.length >= maxQueue) prev.shift()
                return [
                  ...prev,
                  {
                    price: Number(Number(price).toFixed(fixedDecimals)),
                    timestamp: Date.now(),
                  },
                ]
              })
            })
            .catch((error) => console.error(error)),
        1000
      )

      // get 24 hour price change data on an interval basis (every 5 seconds)
      const priceChangeInterval = setInterval(
        () =>
          fetch(`https://www.binance.com/api/v3/ticker/24hr?symbol=${ticker}`)
            .then(async (response) => {
              const { priceChange, priceChangePercent } = await response.json()
              // add the price change data to the state object
              setChange24hr({
                priceChange: Number(Number(priceChange).toFixed(fixedDecimals)),
                priceChangePercent: Number(
                  Number(priceChangePercent).toFixed(fixedDecimals)
                ),
                timestamp: Date.now(),
              })
            })
            .catch((error) => console.error(error)),
        5000
      )

      return () => {
        clearInterval(livePriceInterval)
        clearInterval(priceChangeInterval)
      }
    }, [crypto, ticker])

    const newProps = {
      crypto,
      setCrypto,
      backgroundColor,
      ticker,
      canvasColor,
      maxQueue,
      fixedDecimals,
      handleChange,
      dataPoints,
      setDataPoints,
      change24hr,
      setChange24hr,
      isMorning,
      roosterSound,
    }

    return <Component {...newProps} />
  }

  return Hoc
}

export { withApp }
