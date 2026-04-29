export const formatEventDateTime = (dateString: string) => {
    if (!dateString) return { date: "", time: "", full: "" };

    const date = new Date(dateString.endsWith("Z") ? dateString : dateString + "Z");

    const formattedDate = date.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    const longDateTime = date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "numeric",   // 👈 gives 4 instead of Apr
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });

    const day = date.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "long",
    });

    return {
        date: formattedDate,         // 15 May 2026
        time: formattedTime,         // 10:00 AM
        full: `${formattedDate} • ${formattedTime}`, // combined
        longDateTime: longDateTime,
        day: day
    };
};