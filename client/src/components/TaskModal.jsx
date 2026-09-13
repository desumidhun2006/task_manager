import { useState } from 'react'
import { format } from 'date-fns'

export default function TaskModal({ task, date, time, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [startTime, setStartTime] = useState(
    task ? format(new Date(task.start_time), "yyyy-MM-dd'T'HH:mm") :
    time ? format(time, "yyyy-MM-dd'T'HH:mm") :
    format(date, "yyyy-MM-dd'T'09:00")
  )
  const [endTime, setEndTime] = useState(
    task?.end_time ? format(new Date(task.end_time), "yyyy-MM-dd'T'HH:mm") :
    time ? format(new Date(time.getTime() + 3600000), "yyyy-MM-dd'T'HH:mm") :
    ''
  )
  const [type, setType] = useState(task?.type || 'task')
  const [reminder, setReminder] = useState(task?.reminder || 'none')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      title,
      description,
      start_time: new Date(startTime).toISOString(),
      end_time: endTime ? new Date(endTime).toISOString() : null,
      reminder
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{task ? 'Edit Task' : 'New Task'}</h3>
          <button className="btn btn-secondary" onClick={onClose}>X</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="input" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Start</label>
              <input className="input" type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>End (optional)</label>
              <input className="input" type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Reminder</label>
            <select className="input" value={reminder} onChange={e => setReminder(e.target.value)}>
              <option value="none">None</option>
              <option value="15m">15 min before</option>
              <option value="30m">30 min before</option>
              <option value="1h">1 hour before</option>
              <option value="1d">1 day before</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="btn" type="submit">{task ? 'Update' : 'Create'}</button>
            {task && (
              <button className="btn" type="button" style={{ background: '#e74c3c' }} onClick={() => onDelete(task.id)}>
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
