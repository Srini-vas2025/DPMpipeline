const TasksErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
    <div style={{ padding: 40, textAlign: 'center', color: '#c0392b' }}>
        <p>Failed to load tasks. Please try again.</p>
        <button className="secondary-action-btn" onClick={onRetry} style={{ marginTop: 12 }}>
            Retry
        </button>
    </div>
);
export default TasksErrorState;