import ChangeGreenRed from "./components/ChangeGreenRed"
import PulseCanvas from "./components/PulseCanvas"
import ethLogo from "./images/eth-normal.png"
import morningEth from "./images/eth-morning.png"
import CircularProgress from "@mui/material/CircularProgress"
import adaLogo from "./images/cardano-logo-1024x1024.png"
import btcLogo from "./images/btcLogo.png"
import Box from "@mui/material/Box"
import {
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
} from "@mui/material"
import { withApp } from "./withApp"
import { Sun } from "./components/Icons"

function App({
  crypto,
  maxQueue,
  backgroundColor,
  canvasColor,
  handleChange,
  dataPoints,
  roosterSound,
  change24hr,
  isMorning,
}) {
  const dropdownStyle = {
    position: "absolute",
    right: "20px",
    top: "20px",
  }

  const morningStyle = {
    cursor: "pointer",
    position: "absolute",
    left: "0",
    top: "0",
    padding: "20px",
  }
  return (
    <div className='app flex-col' style={{ backgroundColor }}>
      {dataPoints.length ? (
        <header className='ticker flex-col'>
          {isMorning && (
            <div onClick={() => roosterSound.play()} style={morningStyle}>
              <Sun />
            </div>
          )}
          <div style={dropdownStyle}>
            <FormControl variant='filled' sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id='demo-simple-select-filled-label'>Coin</InputLabel>
              <Select
                labelId='demo-simple-select-filled-label'
                id='demo-simple-select-filled'
                value={crypto}
                onChange={handleChange}>
                <MenuItem value='ADA'>
                  <em>ADA</em>
                </MenuItem>
                <MenuItem value='ETH'>
                  <em>ETH</em>
                </MenuItem>
                <MenuItem value='BTC'>
                  <em>BTC</em>
                </MenuItem>
              </Select>
            </FormControl>
          </div>

          {crypto === "ADA" && (
            <img src={adaLogo} alt='logo' className='logo' />
          )}

          {crypto === "BTC" && (
            <img src={btcLogo} alt='logo' className='logo' />
          )}

          {crypto === "ETH" && (
            <img
              src={isMorning ? morningEth : ethLogo}
              alt='logo'
              className='logo'
            />
          )}

          {dataPoints.length > 7 ? (
            <div className='flex-row'>
              <span className='price'>
                {dataPoints[dataPoints.length - 1].price}
              </span>

              <div className='flex-col'>
                <ChangeGreenRed
                  value={change24hr.priceChangePercent}
                  suffix='%'
                  invert
                  withCaret
                />
                <ChangeGreenRed
                  value={change24hr.priceChange}
                  prefix='$'
                  scale='0.8'
                />
              </div>
            </div>
          ) : (
            <CircularProgress width='50' height='50' />
          )}
        </header>
      ) : (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      )}

      {dataPoints.length ? (
        <PulseCanvas
          dataPoints={dataPoints}
          maxPoints={maxQueue}
          color={canvasColor}
        />
      ) : (
        <LinearProgress color='inherit' />
      )}
    </div>
  )
}

export default withApp(App)
