export default function ExportRcLuaButton({ onExportClicked }) {
    return (
        <input type="button"
            value="export rc.lua"
            onClick={(e) => onExportClicked()}>
        </input>
    );
}
