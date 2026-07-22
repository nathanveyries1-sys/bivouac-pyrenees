// ============================================================
// FIREBASE CONFIGURATION
// BIVOUAC PYRÉNÉES 2026
// ============================================================


// Configuration Firebase
const firebaseConfig = {

    apiKey: "AIzaSyD1xHeVJBpHnjvm61s04bGaw9gwVVXvh40",

    authDomain: "bivouac-pyrenees-2026.firebaseapp.com",

    projectId: "bivouac-pyrenees-2026",

    storageBucket: "bivouac-pyrenees-2026.firebasestorage.app",

    messagingSenderId: "272841154045",

    appId: "1:272841154045:web:5c90bb53928ab3ff530d94"

};



// ============================================================
// INITIALISATION FIREBASE
// ============================================================


let db = null;

let firebaseReady = false;



function initFirebase(){


    try {


        if(typeof firebase === "undefined"){


            console.warn(
                "Firebase non chargé"
            );


            return;


        }



        if(!firebase.apps.length){


            firebase.initializeApp(firebaseConfig);


        }



        db = firebase.firestore();


        firebaseReady = true;



        console.log(
            "✅ Firebase connecté"
        );



    }

    catch(error){


        console.warn(
            "⚠️ Firebase indisponible, mode local activé",
            error
        );


        firebaseReady = false;


    }


}





// ============================================================
// SAUVEGARDE D'UN VOTE
// ============================================================


async function saveVote(voteData){


    const data = {


        ...voteData,


        createdAt: new Date().toISOString()


    };



    // Firebase


    if(firebaseReady && db){


        try{


            await db
            .collection("votes")
            .add(data);



            return true;


        }


        catch(error){


            console.warn(
                "Erreur Firebase écriture",
                error
            );


        }


    }





    // Sauvegarde locale de secours


    const votes = getLocalVotes();



    votes.push({


        id: Date.now().toString(),


        ...data


    });



    localStorage.setItem(

        "bivouac_votes",

        JSON.stringify(votes)

    );



    return true;


}







// ============================================================
// RÉCUPÉRATION DES VOTES
// ============================================================


async function getAllVotes(){



    if(firebaseReady && db){


        try{


            const snapshot = await db

            .collection("votes")

            .orderBy(
                "createdAt",
                "desc"
            )

            .get();



            return snapshot.docs.map(doc => ({


                id:doc.id,


                ...doc.data()


            }));



        }


        catch(error){


            console.warn(
                "Erreur lecture Firebase",
                error
            );


        }


    }



    return getLocalVotes();



}








// ============================================================
// SUPPRESSION D'UN VOTE
// ============================================================


async function deleteVote(id){



    if(firebaseReady && db){


        try{


            await db

            .collection("votes")

            .doc(id)

            .delete();



            return;


        }


        catch(error){


            console.warn(error);


        }


    }





    const votes =
    getLocalVotes()
    .filter(v => v.id !== id);



    localStorage.setItem(

        "bivouac_votes",

        JSON.stringify(votes)

    );



}








// ============================================================
// SUPPRESSION TOTALE DES VOTES
// ============================================================


async function deleteAllVotes(){



    if(firebaseReady && db){


        try{


            const snapshot =
            await db
            .collection("votes")
            .get();



            const batch =
            db.batch();



            snapshot.docs.forEach(doc => {


                batch.delete(doc.ref);


            });



            await batch.commit();



            return;


        }


        catch(error){


            console.warn(error);


        }


    }





    localStorage.removeItem(
        "bivouac_votes"
    );


}








// ============================================================
// LOCAL STORAGE SECOURS
// ============================================================


function getLocalVotes(){


    try{


        return JSON.parse(

            localStorage.getItem(
                "bivouac_votes"
            )

            || 

            "[]"

        );


    }


    catch(error){


        return [];


    }


}








// ============================================================
// DONNÉES DU BIVOUAC
// ============================================================


const HIKES_DATA = {


    berseau:{


        name:
        "Lac de Berseau — Réserve du Néouvielle",


        description:
        "Départ du lac d'Orédon, passage par le lac d'Aumar puis montée vers le bivouac du lac de Berseau.",


        distance:
        "Environ 12 km",


        denivele:
        "850 m D+",


        duration:
        "2 jours / 1 nuit"


    }


};








// ============================================================
// DATES DISPONIBLES
// ============================================================


const DATES_DATA = [


    {
        id:"2026-08-01",
        label:"Sam 1 – Dim 2 août 2026"
    },


    {
        id:"2026-08-08",
        label:"Sam 8 – Dim 9 août 2026"
    },


    {
        id:"2026-08-15",
        label:"Sam 15 – Dim 16 août 2026"
    },


    {
        id:"2026-08-22",
        label:"Sam 22 – Dim 23 août 2026"
    },


    {
        id:"2026-08-29",
        label:"Sam 29 – Dim 30 août 2026"
    },


    {
        id:"2026-09-05",
        label:"Sam 5 – Dim 6 septembre 2026"
    },


    {
        id:"2026-09-12",
        label:"Sam 12 – Dim 13 septembre 2026"
    }


];








// ============================================================
// LANCEMENT AUTOMATIQUE
// ============================================================


window.addEventListener(

    "DOMContentLoaded",

    initFirebase

);
