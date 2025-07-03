import { useEffect, useState } from "react"
import Footer from "./components/Footer"
import Main from "./components/Main"
import SideBar from "./components/SideBar"

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState("") // Initially no date

  function handleToggleModal() {
    setShowModal(!showModal)
  }

  function handleDateChange(e) {
    const newDate = e.target.value
    setSelectedDate(newDate)
  }

  useEffect(() => {
    if (!selectedDate) return // 🛑 Skip fetch if no date selected

    async function fetchAPIData() {
      setLoading(true)
      const NASA_KEY = import.meta.env.VITE_NASA_API_KEY
      const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}&date=${selectedDate}`

      const cacheKey = `NASA-${selectedDate}`
      if (localStorage.getItem(cacheKey)) {
        setData(JSON.parse(localStorage.getItem(cacheKey)))
        setLoading(false)
        return
      }

      try {
        const res = await fetch(url)
        const apiData = await res.json()
        localStorage.setItem(cacheKey, JSON.stringify(apiData))
        setData(apiData)
      } catch (err) {
        console.error("API Error:", err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAPIData()
  }, [selectedDate])

  return (
    <>
      {/* Date Picker */}
      <div style={{ position: "absolute", top: "1rem", left: "1rem", zIndex: 20 }}>
        <input
          type="date"
          onChange={handleDateChange}
          max={new Date().toISOString().split("T")[0]}
          value={selectedDate}
          style={{
            background: "#030615",
            color: "white",
            border: "1px solid white",
            padding: "0.5rem",
            borderRadius: "5px"
          }}
        />
      </div>

      {/* Conditional UI */}
      {!selectedDate ? (
        <div className="loadingState">
          <h2>Please select a date to view NASA's APOD 🌌</h2>
        </div>
      ) : loading ? (
        <div className="loadingState">
          <i className="fa-solid fa-gear"></i>
        </div>
      ) : data ? (
        <>
          <Main data={data} />
          {showModal && <SideBar data={data} handleToggleModal={handleToggleModal} />}
          <Footer data={data} handleToggleModal={handleToggleModal} />
        </>
      ) : (
        <div className="loadingState">
          <h2>No data found for this date. Try another one.</h2>
        </div>
      )}
    </>
  )
}

export default App
