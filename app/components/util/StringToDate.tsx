

export default function StringToDate({string} : { string: string}) {

    if (!string) {
        return "";
    }
    const date:Date = new Date(string.replace(/^(\d{4})(\d\d)(\d\d)T(\d\d)(\d\d)(\d\d)$/,
        '$4:$5:$6 $2/$3/$1'));

    return (
        <span>
            { date.toLocaleDateString('fi-FI', {
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