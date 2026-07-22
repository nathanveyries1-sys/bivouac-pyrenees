// ============================================================
// VOTE.JS
// BIVOUAC PYRÉNÉES 2026
// Lac d'Orédon → Lac d'Aumar → Lac de Berseau
// ============================================================


// ============================================================
// VARIABLES
// ============================================================


let selectedDates = [];





// ============================================================
// CONSTRUCTION DU CALENDRIER
// ============================================================


function buildCalendar(){


    const gridAug =
    document.getElementById("datesGridAug");


    const gridSep =
    document.getElementById("datesGridSep");



    if(!gridAug || !gridSep){

        return;

    }




    DATES_DATA.forEach(date => {



        const button =
        document.createElement("button");



        button.className =
        "date-btn";



        button.id =
        "date-" + date.id;



        button.innerHTML = `


            <div class="date-day">

                ${date.label.split(" ")[0]}

            </div>


            <div class="date-range">

                ${date.label}

            </div>


            <div class="date-check" id="check-${date.id}">

            </div>


        `;



        button.onclick = () => {

            toggleDate(date.id);

        };



        const mois =
        date.id.includes("08")
        ?
        "aout"
        :
        "septembre";



        if(mois === "aout"){


            gridAug.appendChild(button);


        }

        else{


            gridSep.appendChild(button);


        }



    });



}







// ============================================================
// SELECTION DES DATES
// ============================================================


function toggleDate(id){



    const index =
    selectedDates.indexOf(id);



    const button =
    document.getElementById(
        "date-" + id
    );



    const check =
    document.getElementById(
        "check-" + id
    );



    if(index === -1){



        selectedDates.push(id);



        button.classList.add(
            "selected"
        );



        check.textContent =
        "✓ Disponible";


    }


    else{


        selectedDates.splice(
            index,
            1
        );



        button.classList.remove(
            "selected"
        );



        check.textContent =
        "";

    }



    updateRecap();



}









// ============================================================
// RÉCAPITULATIF AUTOMATIQUE
// ============================================================


function updateRecap(){



    const recap =
    document.getElementById(
        "voteRecap"
    );



    if(!recap){

        return;

    }




    const prenom =
    document.getElementById(
        "inputPrenom"
    )
    .value
    .trim();




    const dates =
    selectedDates
    .map(id => {


        const date =
        DATES_DATA.find(
            d => d.id === id
        );


        return date
        ?
        date.label
        :
        "";

    })
    .join("<br>");





    recap.innerHTML = `


        <div class="recap-row">

            👤 <strong>Prénom :</strong>

            ${prenom || "Non renseigné"}

        </div>


        <div class="recap-row">

            🏔️ <strong>Parcours :</strong>

            Lac d'Orédon → Lac d'Aumar → Lac de Berseau

        </div>


        <div class="recap-row">

            📅 <strong>Disponibilités :</strong>

            <br>

            ${dates || "Aucune date sélectionnée"}

        </div>


    `;



}









// ============================================================
// ENVOI DU VOTE
// ============================================================


async function submitVote(){



    const prenom =
    document.getElementById(
        "inputPrenom"
    )
    .value
    .trim();




    const comment =
    document.getElementById(
        "inputComment"
    )
    .value
    .trim();





    if(!prenom){


        alert(
            "Merci d'indiquer ton prénom."
        );


        document
        .getElementById(
            "inputPrenom"
        )
        .focus();



        return;


    }






    if(selectedDates.length === 0){


        alert(
            "Sélectionne au moins une date disponible."
        );


        return;


    }







    const button =
    document.querySelector(
        ".btn-send"
    );



    button.disabled = true;


    button.textContent =
    "⏳ Enregistrement...";







    const vote = {


        prenom:prenom,


        parcours:
        "Lac d'Orédon → Lac d'Aumar → Lac de Berseau",


        dates:selectedDates,


        comment:comment


    };






    try{



        await saveVote(
            vote
        );





        document
        .querySelector(
            ".step-card"
        )
        .style.display =
        "none";





        const success =
        document.getElementById(
            "stepSuccess"
        );



        success.style.display =
        "block";





        document.getElementById(
            "successMsg"
        )
        .textContent =


        `Merci ${prenom} ! Ton choix a bien été enregistré. Les résultats seront visibles sur la page résultats.`;





        window.scrollTo({

            top:0,

            behavior:"smooth"

        });





    }


    catch(error){


        console.error(
            error
        );



        alert(
            "Erreur lors de l'enregistrement du vote."
        );



        button.disabled =
        false;



        button.textContent =
        "✅ Envoyer mon choix";



    }



}









// ============================================================
// RESET VOTE
// ============================================================


function resetVote(){



    selectedDates = [];



    document
    .getElementById(
        "inputPrenom"
    )
    .value = "";



    document
    .getElementById(
        "inputComment"
    )
    .value = "";





    document
    .querySelector(
        ".step-card"
    )
    .style.display =
    "block";



    document
    .getElementById(
        "stepSuccess"
    )
    .style.display =
    "none";





    DATES_DATA.forEach(date => {



        const btn =
        document.getElementById(
            "date-" + date.id
        );



        const check =
        document.getElementById(
            "check-" + date.id
        );



        if(btn){

            btn.classList.remove(
                "selected"
            );

        }



        if(check){

            check.textContent =
            "";

        }



    });





}









// ============================================================
// EVENEMENTS
// ============================================================


document.addEventListener(
"DOMContentLoaded",
()=>{


    buildCalendar();



    const prenom =
    document.getElementById(
        "inputPrenom"
    );


    if(prenom){


        prenom.addEventListener(
            "input",
            updateRecap
        );


    }



});
