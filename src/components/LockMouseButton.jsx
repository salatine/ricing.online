export default function LockMouseButton({ onLockClicked }) {
    return (
        <input type="button"
            value="lock mouse"
            onClick={(e) => onLockClicked()}>
        </input>
    );
}
