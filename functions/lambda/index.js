export default {
    GetByUserId(event, context) {
        console.log(`EVENT: ${JSON.stringify(event, null, 2)}`);
        return context.logStreamName;
    }
};