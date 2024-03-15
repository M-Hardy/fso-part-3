const Notification = ({ message, isError }) => {
    const notificationColor = isError ? "red" : "green";
    const notificationStyle = {
        color: notificationColor,
        background: "lightgrey",
        fontSize: 20,
        borderStyle: "solid",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    };
    if (message === null) {
        return null;
    }

    return (
        <div style={notificationStyle} className="notification">
            {message}
        </div>
    );
};

export default Notification;
