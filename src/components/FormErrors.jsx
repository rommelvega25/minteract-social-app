export default function FormErrors({ errors = [] }) {
    if (!errors.length) return null;

    return (
        <div className="form-error">
            {errors.map((error, idx) => (
                <p className="error-message" key={idx}>
                    {error}
                </p>
            ))}
        </div>
    );
}