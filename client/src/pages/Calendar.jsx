import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import api from '../api'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday, addMonths, subMonths, startOfDay, endOfDay, addHours, format as fnsFormat } from 'date-fns'
import TaskModal from '../components/TaskModal'

export default function Calendar() {
  const { user, logout } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('monthly')
  const [tasks, setTasks] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    fetchTasks()
  }, [currentDate, view])

  const fetchTasks = async () => {
    try {
      const start = view === 'monthly' ? startOfMonth(currentDate) : view === 'weekly' ? startOfWeek(currentDate) : startOfDay(currentDate)
      const end = view === 'monthly' ? endOfMonth(currentDate) : view === 'weekly' ? endOfWeek(currentDate) : endOfDay(currentDate)
      const res = await api.get(`/api/tasks?start=${start.toISOString()}&end=${end.toISOString()}`)
      setTasks(res.data)
    } catch (err) {
      console.error('Failed to fetch tasks')
    }
  }

  const handleDayClick = (day) => {
    setSelectedDate(day)
    setSelectedTime(null)
    setEditingTask(null)
    setModalOpen(true)
  }

  const handleTimeClick = (time) => {
    setSelectedDate(currentDate)
    setSelectedTime(time)
    setEditingTask(null)
    setModalOpen(true)
  }

  const handleTaskClick = (task) => {
    setEditingTask(task)
    setSelectedDate(new Date(task.start_time))
    setSelectedTime(new Date(task.start_time))
    setModalOpen(true)
  }

  const handleSave = async (taskData) => {
    try {
      if (editingTask) {
        await api.put(`/api/tasks/${editingTask.id}`, taskData)
      } else {
        await api.post('/api/tasks', taskData)
      }
      fetchTasks()
      setModalOpen(false)
    } catch (err) {
      console.error('Failed to save task')
    }
  }

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/api/tasks/${taskId}`)
      fetchTasks()
      setModalOpen(false)
    } catch (err) {
      console.error('Failed to delete task')
    }
  }

  const renderMonthly = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const calStart = startOfWeek(monthStart)
    const calEnd = endOfWeek(monthEnd)

    const days = []
    let day = calStart
    while (day <= calEnd) {
      days.push(day)
      day = addDays(day, 1)
    }

    return (
      <div className="calendar-grid">
        <div className="calendar-header">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="calendar-day-name">{d}</div>
          ))}
        </div>
        <div className="calendar-body">
          {days.map((day, i) => {
            const dayTasks = tasks.filter(t => isToday(new Date(t.start_time)) && format(new Date(t.start_time), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
            return (
              <div
                key={i}
                className={`calendar-day ${!isSameMonth(day, currentDate) ? 'other-month' : ''} ${isToday(day) ? 'today' : ''}`}
                onClick={() => handleDayClick(day)}
              >
                <span className="day-number">{format(day, 'd')}</span>
                {dayTasks.slice(0, 2).map(t => (
                  <div key={t.id} className="task-chip" onClick={(e) => { e.stopPropagation(); handleTaskClick(t) }}>
                    {t.title}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderWeekly = () => {
    const weekStart = startOfWeek(currentDate)
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

    return (
      <div className="weekly-grid">
        {days.map((day, i) => {
          const dayTasks = tasks.filter(t => format(new Date(t.start_time), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
          return (
            <div key={i} className="weekly-day" onClick={() => handleDayClick(day)}>
              <div className={`weekly-day-header ${isToday(day) ? 'today' : ''}`}>
                {format(day, 'EEE d')}
              </div>
              <div className="weekly-day-tasks">
                {dayTasks.map(t => (
                  <div key={t.id} className="task-chip" onClick={(e) => { e.stopPropagation(); handleTaskClick(t) }}>
                    {format(new Date(t.start_time), 'HH:mm')} - {t.title}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderDaily = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const isToday = format(currentDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')

    return (
      <div className="daily-grid">
        {hours.map(hour => {
          const time = addHours(startOfDay(currentDate), hour)
          const hourTasks = tasks.filter(t => {
            const tDate = new Date(t.start_time)
            return tDate.getHours() === hour
          })
          const isCurrentHour = isToday && hour === currentHour
          return (
            <div key={hour} className={`daily-hour ${isCurrentHour ? 'current-hour' : ''}`} onClick={() => handleTimeClick(time)}>
              <div className="daily-time">{fnsFormat(time, 'HH:00')}</div>
              <div className="daily-tasks">
                {isCurrentHour && (
                  <div className="current-time-line" style={{ top: `${(currentMinute / 60) * 100}%` }} />
                )}
                {hourTasks.map(t => (
                  <div key={t.id} className="task-chip" onClick={(e) => { e.stopPropagation(); handleTaskClick(t) }}>
                    {t.title}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const handleAddClick = () => {
    setSelectedDate(new Date())
    setSelectedTime(null)
    setEditingTask(null)
    setModalOpen(true)
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <button className="btn add-btn" onClick={handleAddClick}>+ ADD</button>
        <nav className="sidebar-nav">
          <Link to="/settings">Settings</Link>
          <button className="btn btn-secondary" onClick={logout}>Logout</button>
        </nav>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>Prev</button>
            <h3>{format(currentDate, 'MMMM yyyy')}</h3>
            <button className="btn btn-secondary" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>Next</button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['monthly', 'weekly', 'daily'].map(v => (
              <button key={v} className={`btn ${view === v ? '' : 'btn-secondary'}`} onClick={() => setView(v)}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          {view === 'monthly' && renderMonthly()}
          {view === 'weekly' && renderWeekly()}
          {view === 'daily' && renderDaily()}
        </div>
      </main>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          date={selectedDate}
          time={selectedTime}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
