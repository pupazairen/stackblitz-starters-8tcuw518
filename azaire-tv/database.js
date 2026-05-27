/* ==========================================================================
   AZAIREN LOCAL DATABASE CONTROLLER (INDEXEDDB)
   ========================================================================== */

   const DB_NAME = 'AzairenLocalDB';
   const DB_VERSION = 1;
   const STORE_NAME = 'user_profiles';
   
   // Initialize the database connection
   function initDB() {
     return new Promise((resolve, reject) => {
       const request = indexedDB.open(DB_NAME, DB_VERSION);
   
       // This handles creating the schema if the DB doesn't exist yet
       request.onupgradeneeded = (event) => {
         const db = event.target.result;
         if (!db.objectStoreNames.contains(STORE_NAME)) {
           // Use email as the unique primary key (keyPath)
           db.createObjectStore(STORE_NAME, { keyPath: 'email' });
         }
       };
   
       request.onsuccess = (event) => resolve(event.target.result);
       request.onerror = (event) => reject(event.target.error);
     });
   }
   
   // Save or Update a profile record
   async function saveUserProfile(profileData) {
     const db = await initDB();
     return new Promise((resolve, reject) => {
       const transaction = db.transaction(STORE_NAME, 'readwrite');
       const store = transaction.objectStore(STORE_NAME);
       
       // profileData must be an object containing an 'email' field
       const request = store.put(profileData);
   
       request.onsuccess = () => resolve(true);
       request.onerror = () => reject(request.error);
     });
   }
   
   // Fetch a profile record by email
   async function getUserProfile(email) {
     const db = await initDB();
     return new Promise((resolve, reject) => {
       const transaction = db.transaction(STORE_NAME, 'readonly');
       const store = transaction.objectStore(STORE_NAME);
       const request = store.get(email);
   
       request.onsuccess = (event) => resolve(event.target.result);
       request.onerror = () => reject(request.error);
     });
   }