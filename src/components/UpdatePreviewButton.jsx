export default function UpdatePreviewButton({ onUpdateClicked }) {
    return (
        <input type="button"
            value="teste restart"
            onClick={(e) => onUpdateClicked()}>
        </input>
    );
}
