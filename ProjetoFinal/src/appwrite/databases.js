import { databases, collections, account } from "./config";
import { Client, ID } from "appwrite";

const client = new Client();
client
    .setEndpoint(import.meta.env.VITE_ENDPOINT) // Your API Endpoint
    .setProject(import.meta.env.VITE_PROJECT_ID); // Your project ID

const db = {};

collections.forEach((collection) => {
    db[collection.name] = {
        create: async (payload, id = ID.unique()) => {
            return await databases.createDocument(
                collection.dbId,
                collection.id,
                id,
                payload
            );
        },
        update: async (id, payload) => {
            return await databases.updateDocument(
                collection.dbId,
                collection.id,
                id,
                payload
            );
        },
        delete: async (id) => {
            return await databases.deleteDocument(
                collection.dbId,
                collection.id,
                id
            );
        },
        get: async (id) => {
            return await databases.getDocument(
                collection.dbId,
                collection.id,
                id
            );
        },
        list: async (queries) => {
            return await databases.listDocuments(
                collection.dbId,
                collection.id,
                queries
            );
        },
    };
});

const auth = {
    login: async (email, password) => {
        return await account.createSession(email, password);
    },
    logout: async () => {
        return await account.deleteSession("current");
    },
    createUser: async (email, password) => {
        return await account.create(ID.unique(), email, password);
    },
    getCurrentUser: async () => {
        try {
            return await account.get();
        } catch (error) {
            console.error("No active session:", error);
            return null;
        }
    },
};

export { db, auth };