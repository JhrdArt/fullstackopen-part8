export const Button = ({ handleCLick, label }) => {
    return (
        <button onClick={handleCLick}>{label}</button>
    )
}
