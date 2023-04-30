export default function BackgroundEditor({ onBackgroundSelected }) {
    return (
        <input type="file"
            name="file"
            onChange={(e) => onBackgroundSelected(e.target.files[0])}>
        </input>
    );
}
