
export default function LocalizedDateTime({ timestamp }: {timestamp: number }) {

    return (
        <span>
            { new Date(timestamp).toLocaleDateString('fi-FI', {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric"
            })}
        </span>
    );
}