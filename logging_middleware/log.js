async function Log(stack, level, packageName, message) {
    let finalMessage = message;
    if (typeof message !== "string") {
        finalMessage = JSON.stringify(message);
    }
    const logData = {
        stack: stack,
        level: level,
        package: packageName,
        message: finalMessage,
        timestamp: new Date().toISOString()
    };

    try {
        await fetch("http://4.224.186.213/evaluation-service/log", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(logData)
        });
        
        
    } catch (error) {
        
    }
}



module.exports = { Log };