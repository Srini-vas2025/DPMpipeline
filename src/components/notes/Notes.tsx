//import React from "react";

import type { Task } from '../../components/tasks/types';
type NotesProps = {
    isOpen: boolean;
    onBack: () => void;
    onClose: () => void;
    task: Task | null;
};

export default function Notes({ isOpen, onBack, onClose, task }: NotesProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* header */}
            <div className="notes-header-grid">
                <div className="notes-header-left">
                    <button className="modal-back-btn" onClick={onBack}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>

                    <h2 className="modal-title">Notes</h2>
                </div>

                <div className="notes-header-center">
                    <div className="notes-patient-name">{task?.patient}</div>
                </div>

                <button className="modal-close-btn" onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            {/* body */}
            <div className="notes-body">
                <div className="notes-grid">
                    <div className="notes-card">
                        <h3 className="section-title">NOTES</h3>

                        <div className="note-item">
                            <div className="user-icon">
                                <i className="fa-solid fa-user"></i>
                            </div>

                            <div>
                                <div className="note-header">
                                    <span className="user-name">Mary Miller</span>
                                    <span className="note-time">
                                        Tue. Nov 11 @ 12:23PM
                                    </span>
                                </div>

                                <div className="note-box">
                                    Physician FirstName: ANDRE <br />
                                    Physician LastName: SHINABARGER <br />
                                    Physician NPI: 1942417480 <br />
                                    Address1: 30 WARREN ST SE <br />
                                    city: ATLANTA <br />
                                    State: GA <br />
                                    Zip: 303172267- <br />
                                    Phone-Fax: 4046169304-
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="appointment-card">
                        <h3 className="section-title">APPOINTMENT</h3>

                        <div className="appointment-status">
                            <div className="status-icon">
                                <i className="fa-solid fa-check"></i>
                            </div>

                            <div className="status-text">Scheduled</div>

                            <div className="status-time">
                                Monday, April 4th 12:15pm
                            </div>

                            <div className="edit-link">Edit</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* footer */}
            <div className="notes-footer">
                <div className="notes-input-wrapper">
                    <input type="text" placeholder="Enter New Note" />
                    <button className="add-note-btn">Add new note</button>
                </div>

                <button className="danger-btn">
                    <i className="fa-regular fa-circle-xmark"></i>
                    Mark as cannot contact
                </button>
            </div>
        </>
    );
}
