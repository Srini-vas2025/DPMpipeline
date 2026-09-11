import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import {
    formatAppointmentTime,
    parseAppointmentDateTime,
    type AppointmentDateTime,
} from '../../features/appointments/utils';
import { useTasks } from '../../features/tasks/hooks/useTasks';
import type { WorkflowContext } from '../../types/workflow';
import { useAuthStore } from '../../store/useAuthStore';
import PatientModalMeta from '../workflow/PatientModalMeta';

type NotesProps = {
    context: WorkflowContext;
    onClose: () => void;
    embedded?: boolean;
};

type PatientNote = {
    id: string;
    author: string;
    createdAt: string;
    text: string;
};

const initialNotes: PatientNote[] = [
    {
        id: 'initial-note',
        author: 'Mary Miller',
        createdAt: 'Tue. Nov 11 @ 12:23PM',
        text: `Physician FirstName: ANDRE
Physician LastName: SHINABARGER
Physician NPI: 1942417480
Address1: 30 WARREN ST SE
city: ATLANTA
State: GA
Zip: 303172267-
Phone-Fax: 4046169304-`,
    },
];

const TIME_SLOTS = Array.from({ length: 24 * 4 }, (_, index) => {
    const hours = Math.floor(index / 4);
    const minutes = (index % 4) * 15;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
});

const formatNoteTime = (date: Date) => {
    const datePart = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    }).format(date);
    const timePart = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    })
        .format(date)
        .replace(' ', '');
    return `${datePart} @ ${timePart}`;
};

export default function Notes({ context, onClose, embedded = false }: NotesProps) {
    const user = useAuthStore((state) => state.user);
    const { tasks } = useTasks();
    const [newNote, setNewNote] = useState('');
    const [notes, setNotes] = useState<PatientNote[]>(initialNotes);
    const [appointment, setAppointment] = useState<{ date: string; time: string } | null>({
        date: '2026-04-04',
        time: '12:15',
    });
    const [appointmentDraft, setAppointmentDraft] = useState(appointment ?? { date: '', time: '' });
    const [isEditingAppointment, setIsEditingAppointment] = useState(false);
    const notesListRef = useRef<HTMLDivElement>(null);

    const bookedAppointments = useMemo(
        () =>
            tasks.flatMap((task) =>
                [task.fittingApptDate, task.dispensingApptDate]
                    .map(parseAppointmentDateTime)
                    .filter(
                        (slot): slot is AppointmentDateTime => slot !== null && Boolean(slot.time),
                    ),
            ),
        [tasks],
    );

    const bookedTimesForSelectedDate = useMemo(
        () =>
            new Set(
                bookedAppointments
                    .filter((slot) => slot.date === appointmentDraft.date)
                    .map((slot) => slot.time),
            ),
        [appointmentDraft.date, bookedAppointments],
    );

    const isCurrentAppointmentSlot = (time: string) =>
        appointment?.date === appointmentDraft.date && appointment.time === time;

    const isTimeBooked = (time: string) =>
        bookedTimesForSelectedDate.has(time) && !isCurrentAppointmentSlot(time);

    const selectedTimeIsBooked =
        Boolean(appointmentDraft.time) && isTimeBooked(appointmentDraft.time);

    useEffect(() => {
        if (notesListRef.current) {
            notesListRef.current.scrollTop = notesListRef.current.scrollHeight;
        }
    }, [notes.length]);

    const handleAddNote = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const text = newNote.trim();
        if (!text) return;

        setNotes((current) => [
            ...current,
            {
                id: `${Date.now()}`,
                author: user?.name?.trim() || user?.username?.trim() || 'Current User',
                createdAt: formatNoteTime(new Date()),
                text,
            },
        ]);
        setNewNote('');
    };

    const formatAppointment = ({ date, time }: { date: string; time: string }) => {
        const dateValue = new Date(`${date}T${time || '00:00'}:00`);
        if (Number.isNaN(dateValue.getTime())) return 'Select an appointment date';
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        }).format(dateValue);
    };

    const handleAppointmentSave = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!appointmentDraft.date || !appointmentDraft.time || selectedTimeIsBooked) return;
        setAppointment(appointmentDraft);
        setIsEditingAppointment(false);
    };

    return (
        <>
            {!embedded && (
                <div className="modal-simple-header notes-simple-header">
                    <div className="modal-title-group">
                        <div className="modal-task-heading">
                            <h2 className="modal-title">Notes</h2>
                            <PatientModalMeta context={context} />
                        </div>
                    </div>

                    <button
                        type="button"
                        className="modal-close-btn upload-forms-close"
                        aria-label="Close"
                        onClick={onClose}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            )}

            {/* body */}
            <div className="notes-body">
                <div className="notes-grid">
                    <div className="notes-card">
                        <h3 className="section-title">NOTES</h3>

                        <div className="notes-list" ref={notesListRef}>
                            {notes.map((note) => (
                                <div className="note-item" key={note.id}>
                                    <div className="user-icon">
                                        <i className="fa-solid fa-user"></i>
                                    </div>

                                    <div className="note-content">
                                        <div className="note-header">
                                            <span className="user-name">{note.author}</span>
                                            <span className="note-time">{note.createdAt}</span>
                                        </div>

                                        <div className="note-box">{note.text}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="appointment-card">
                        <h3 className="section-title">APPOINTMENT</h3>

                        {isEditingAppointment ? (
                            <form className="appointment-editor" onSubmit={handleAppointmentSave}>
                                <label>
                                    <span>Date</span>
                                    <input
                                        type="date"
                                        value={appointmentDraft.date}
                                        onChange={(event) => {
                                            const date = event.target.value;
                                            const bookedTimes = new Set(
                                                bookedAppointments
                                                    .filter((slot) => slot.date === date)
                                                    .map((slot) => slot.time),
                                            );
                                            setAppointmentDraft((current) => ({
                                                date,
                                                time:
                                                    bookedTimes.has(current.time) &&
                                                    !(
                                                        appointment?.date === date &&
                                                        appointment.time === current.time
                                                    )
                                                        ? ''
                                                        : current.time,
                                            }));
                                        }}
                                    />
                                </label>
                                <label>
                                    <span>Time</span>
                                    <select
                                        value={appointmentDraft.time}
                                        disabled={!appointmentDraft.date}
                                        onChange={(event) =>
                                            setAppointmentDraft((current) => ({
                                                ...current,
                                                time: event.target.value,
                                            }))
                                        }
                                    >
                                        <option value="">Select a time</option>
                                        {TIME_SLOTS.map((time) => {
                                            const isBooked = isTimeBooked(time);
                                            return (
                                                <option disabled={isBooked} key={time} value={time}>
                                                    {formatAppointmentTime(time)}
                                                    {isBooked ? ' — Booked' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </label>
                                {appointmentDraft.date && bookedTimesForSelectedDate.size > 0 && (
                                    <p className="appointment-availability-note" role="status">
                                        <i className="fa-regular fa-clock" aria-hidden="true"></i>
                                        {bookedTimesForSelectedDate.size}{' '}
                                        {bookedTimesForSelectedDate.size === 1
                                            ? 'time is'
                                            : 'times are'}{' '}
                                        already booked on this date.
                                    </p>
                                )}
                                <div className="appointment-editor-actions">
                                    {appointment ? (
                                        <button
                                            type="button"
                                            className="appointment-delete-btn"
                                            onClick={() => {
                                                setAppointment(null);
                                                setAppointmentDraft({ date: '', time: '' });
                                                setIsEditingAppointment(false);
                                            }}
                                        >
                                            Delete appointment
                                        </button>
                                    ) : (
                                        <span />
                                    )}
                                    <div className="appointment-editor-primary-actions">
                                        <button
                                            type="button"
                                            className="appointment-cancel-btn"
                                            onClick={() => {
                                                setAppointmentDraft(
                                                    appointment ?? { date: '', time: '' },
                                                );
                                                setIsEditingAppointment(false);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="appointment-save-btn"
                                            disabled={
                                                !appointmentDraft.date ||
                                                !appointmentDraft.time ||
                                                selectedTimeIsBooked
                                            }
                                        >
                                            Save appointment
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="appointment-status">
                                {appointment ? (
                                    <>
                                        <div className="status-icon">
                                            <i className="fa-solid fa-check"></i>
                                        </div>

                                        <div className="status-text">Scheduled</div>

                                        <div className="status-time">
                                            {formatAppointment(appointment)}
                                        </div>
                                    </>
                                ) : (
                                    <div className="status-text appointment-empty-state">
                                        No appointment scheduled
                                    </div>
                                )}

                                <button
                                    type="button"
                                    className="edit-link"
                                    onClick={() => {
                                        setAppointmentDraft(appointment ?? { date: '', time: '' });
                                        setIsEditingAppointment(true);
                                    }}
                                >
                                    {appointment ? 'Edit' : 'Schedule appointment'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* footer */}
            <div className="notes-footer">
                <form className="notes-input-wrapper" onSubmit={handleAddNote}>
                    <input
                        type="text"
                        placeholder="Enter New Note"
                        value={newNote}
                        onChange={(event) => setNewNote(event.target.value)}
                    />
                    <button className="add-note-btn" disabled={!newNote.trim()} type="submit">
                        Add new note
                    </button>
                </form>

                <button className="danger-btn">
                    <i className="fa-regular fa-circle-xmark"></i>
                    Mark as cannot contact
                </button>
            </div>
        </>
    );
}
