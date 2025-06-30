'use client'

import { useEffect, useState } from 'react'
import { colors } from '@/lib/constants/colors'
import { cities } from '@/lib/constants/cities'

type WeatherData = {
  temp: number
  description: string
  icon: string
  humidity: number
  wind: number
  feelsLike: number
  minTemp: number
  maxTemp: number
}

type ForecastDay = {
  date: string
  minTemp: number
  maxTemp: number
}

export default function WeatherWidget({ city }: { city?: string }) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [loading, setLoading] = useState(true)
  const [currentCityIndex, setCurrentCityIndex] = useState(0)
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_KEY

  const displayedCity = city ? city : cities[currentCityIndex]?.name

  const handleNextCity = () => {
    if (city) return
    setCurrentCityIndex((prev) => (prev + 1) % cities.length)
  }

  useEffect(() => {
    async function fetchWeatherData() {
      if (!displayedCity) return

      setLoading(true)

      try {
        // Clima atual
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          displayedCity
        )}&appid=${apiKey}&units=metric&lang=pt_br`

        const weatherRes = await fetch(weatherUrl)
        const weatherData = await weatherRes.json()

        if (weatherRes.ok) {
          setWeather({
            temp: Math.round(weatherData.main.temp),
            description: weatherData.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
            humidity: weatherData.main.humidity,
            wind: weatherData.wind.speed,
            feelsLike: Math.round(weatherData.main.feels_like),
            minTemp: Math.round(weatherData.main.temp_min),
            maxTemp: Math.round(weatherData.main.temp_max)
          })
        } else {
          console.error('Erro na API de clima atual:', weatherData.message)
        }

        // Forecast próximos 2 dias
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          displayedCity
        )}&appid=${apiKey}&units=metric&lang=pt_br`

        const forecastRes = await fetch(forecastUrl)
        const forecastData = await forecastRes.json()

        if (forecastRes.ok) {
          const daily: Record<string, number[]> = {}

          forecastData.list.forEach((entry: any) => {
            const date = entry.dt_txt.split(' ')[0]
            if (!daily[date]) daily[date] = []
            daily[date].push(entry.main.temp_min, entry.main.temp_max)
          })

          const today = new Date().toISOString().split('T')[0]
          const nextTwoDays = Object.keys(daily)
            .filter(date => date !== today)
            .slice(0, 2)
            .map(date => {
              const temps = daily[date]
              return {
                date,
                minTemp: Math.round(Math.min(...temps)),
                maxTemp: Math.round(Math.max(...temps))
              }
            })

          setForecast(nextTwoDays)
        } else {
          console.error('Erro na API de forecast:', forecastData.message)
        }
      } catch (error) {
        console.error('Erro ao buscar dados do clima:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [displayedCity, apiKey])

  if (loading) return <p className="text-gray-500 text-sm">Carregando clima...</p>
  if (!weather) return <p className="text-gray-500 text-sm">Clima não disponível</p>

  return (
    <div
      onClick={handleNextCity}
      className="cursor-pointer rounded-xl shadow-sm p-4 space-y-3 border transition-all duration-300 hover:shadow-md hover:scale-[1.01des]"
      style={{
        backgroundColor: colors.neutralLight,
        borderColor: colors.primary
      }}
      title="Clique para ver o clima da próxima cidade"
    >
      <h2
        className="text-lg font-semibold tracking-wide uppercase"
        style={{ color: colors.primary }}
      >
        {displayedCity}
      </h2>

      {/* Clima Atual */}
      <div className="flex items-center gap-4">
        <img src={weather.icon} alt="Ícone do clima" className="w-12 h-12" />
        <div>
          <p
            className="text-3xl font-bold leading-tight"
            style={{ color: colors.secondary }}
          >
            {weather.temp}°C
          </p>
          <p className="text-xs capitalize text-gray-700">{weather.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
        <div>
          <span className="font-medium">Mín:</span> {weather.minTemp}°C
        </div>
        <div>
          <span className="font-medium">Máx:</span> {weather.maxTemp}°C
        </div>
        <div>
          <span className="font-medium">Umidade:</span> {weather.humidity}%
        </div>
        <div>
          <span className="font-medium">Vento:</span> {weather.wind} km/h
        </div>
      </div>

      <div className="flex justify-center mt-2">
        <span
          className="text-xs font-semibold uppercase px-3 py-1 text-highlight border rounded border-highlight"
          style={{ color: colors.highlight, borderColor: colors.highlight }}
        >
          Sensação térmica: {weather.feelsLike}°C
        </span>
      </div>

      {/* Forecast dos próximos 2 dias */}
      {forecast.length > 0 && (
        <div className="mt-3 space-y-1 text-xs text-gray-700">
          <p className="font-semibold" style={{ color: colors.primary }}>
            Próximos dias:
          </p>
          {forecast.map(day => (
            <div key={day.date} className="flex justify-between">
              <span className="capitalize">
                {new Date(day.date).toLocaleDateString('pt-BR', {
                  weekday: 'short',
                })}
              </span>
              <span>{day.minTemp}°C / {day.maxTemp}°C</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
