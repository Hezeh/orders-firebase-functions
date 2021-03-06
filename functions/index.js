const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();
const allOrdersRef = db.collection('all-orders');
const merchantOrdersRef = db.collection('profile')

// On consumers/{userId}/items/{itemId} document created
exports.createAllOrdersDoc = functions.firestore
    .document(`consumers/{userId}/orders/{orderId}`)
    .onCreate(async (snap, context) => {
        orderId = context.params.orderId;
        const _data = snap.data();
        const _merchantId = _data['item']['userId']
        console.log(_data);
        await allOrdersRef.doc(`${orderId}`).set(_data);
        await merchantOrdersRef.doc(_merchantId).collection('orders').doc(orderId).set(_data)
    });

// On consumers/{userId}/orders/{orderId} document updated
exports.updateAllOrdersDoc = functions.firestore
    .document('consumers/{userId}/orders/{orderId}')
    .onUpdate(async (change, context) => {
        orderId = context.params.orderId;
        const dataBefore = change.before.data();
        const dataAfter = change.after.data();
        const _merchantId = dataAfter['item']['userId']
        console.log(dataAfter);
        await allOrdersRef.doc(orderId).set({ dataAfter }, { merge: true });
        await merchantOrdersRef.doc(_merchantId).collection('orders').doc(orderId).set(_data, {merge: true})
    });


// on consumers/{userId}/orders/{orderId} document deleted
exports.deleteAllOrdersDoc = functions.firestore
    .document('consumers/{userId}/orders/{orderId}')
    .onDelete(async (snap, context) => {
        const orderId = context.params.orderId;
        await allOrdersRef.doc(orderId).delete();
    });