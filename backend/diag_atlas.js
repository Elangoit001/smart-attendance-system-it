
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://pommielango_db_user:elango123@cluster1.npob7y1.mongodb.net/smart_dept?retryWrites=true&w=majority&appName=Cluster1";
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

async function run() {
    try {
        console.log("Attempting to connect to Atlas...");
        await client.connect();
        console.log("SUCCESS: Connected to Atlas!");
        const db = client.db("smart_dept");
        const collections = await db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));
    } catch (err) {
        console.error("DIAGNOSTIC ERROR:", err.message);
    } finally {
        await client.close();
    }
}
run();
