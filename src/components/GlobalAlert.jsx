import { useAlert } from "../contexts/AlertProvider.jsx";

export default function GlobalAlert() {
    const { alert, hideAlert } = useAlert();

    if (!alert) return null;

    const isPrompt = alert.mode === "prompt";

    let classes = `global-alert ${alert.type}`;
    if (isPrompt) classes += " with-backdrop";

    return isPrompt ? (
        <div className={classes}>
            <div className="content fade-in fade-in-05s">
                <div className="prompt-message">{alert.message}</div>

                <div className="actions">
                    <button
                        className="btn btn-danger"
                        onClick={() => {
                            alert.onCancel?.();
                            hideAlert();
                        }}
                    >
                        {alert.cancelText}
                    </button>

                    <button
                        className="btn btn-purple"
                        onClick={() => {
                            alert.onConfirm?.();
                            hideAlert();
                        }}
                    >
                        {alert.confirmText}
                    </button>
                </div>
            </div>
        </div>
    ) : (
        <div className={classes}>
            <div>{alert.message}</div>
        </div>
    );
}