// ============================================================
// ADMIN.JS
// BIVOUAC PYRÉNÉES 2026
// Résultats des votes
// ============================================================


// ============================================================
// CHARGEMENT DES RESULTATS
// ============================================================


async function loadResults(){


    const total =
    document.getElementById(
        "totalVotes"
    );


    if(total){

        total.textContent =
        "Chargement...";

    }




    try{


        const votes =
        await getAllVotes();



        renderResults(votes);



    }


    catch(error){


        console.error(error);



        if(total){

            total.textContent =
            "Erreur de chargement";

        }


    }



}









// ============================================================
// AFFICHAGE GENERAL
// ============================================================


function renderResults(votes){



    const total =
    votes.length;





    const totalText =
    document.getElementById(
        "totalVotes"
    );



    if(totalText){



        if(total === 0){

            totalText.textContent =
            "Aucun vote pour le moment";

        }


        else if(total === 1){


            totalText.textContent =
            "1 participant";


        }


        else{


            totalText.textContent =
            total +
            " participants";


        }



    }







    const count =
    document.getElementById(
        "participantCount"
    );



    if(count){

        count.textContent =
        total;

    }







    if(total === 0){



        hideWinner();



        const tbody =
        document.getElementById(
            "participantsBody"
        );



        if(tbody){


            tbody.innerHTML = `

            <tr>

            <td colspan="5" class="empty-row">

            🏕️ Aucun vote enregistré

            </td>

            </tr>

            `;


        }



        renderDateChart({},0);



        return;



    }








    // Comptage des dates


    const dateCount = {};



    DATES_DATA.forEach(date => {


        dateCount[date.id] = 0;


    });





    votes.forEach(vote => {



        (vote.dates || [])
        .forEach(date=>{


            if(dateCount[date] !== undefined){


                dateCount[date]++;


            }


        });



    });






    // Recherche meilleure date


    const bestDateId =
    Object.keys(dateCount)
    .sort(
        (a,b)=>
        dateCount[b]-dateCount[a]
    )[0];





    showWinner(
        bestDateId,
        dateCount,
        votes
    );






    renderDateChart(
        dateCount,
        total
    );



    renderTable(
        votes
    );



}









// ============================================================
// CARTE DU MEILLEUR CHOIX
// ============================================================


function showWinner(
    bestDateId,
    dateCount,
    votes
){



    const card =
    document.getElementById(
        "winnerCard"
    );



    if(!card){

        return;

    }



    const date =
    DATES_DATA.find(
        d=>d.id===bestDateId
    );



    if(!date){

        return;

    }






    card.style.display =
    "flex";





    document.getElementById(
        "winnerHike"
    ).textContent =


    "🏕️ Lac de Berseau";





    document.getElementById(
        "winnerDate"
    ).textContent =


    date.label;





    const people =
    votes
    .filter(
        v=>
        (v.dates||[])
        .includes(bestDateId)
    )
    .map(
        v=>v.prenom
    );






    document.getElementById(
        "winnerDetail"
    ).textContent =


    dateCount[bestDateId]
    +
    " participant(s) disponible(s)"
    +
    (
        people.length
        ?
        " · " +
        people.join(", ")
        :
        ""
    );



}









function hideWinner(){



    const card =
    document.getElementById(
        "winnerCard"
    );


    if(card){

        card.style.display =
        "none";

    }


}









// ============================================================
// GRAPHIQUE DES DATES
// ============================================================


function renderDateChart(
    dateCount,
    total
){



    const wrap =
    document.getElementById(
        "chartDates"
    );



    if(!wrap){

        return;

    }




    wrap.innerHTML =
    "";




    const max =
    Math.max(
        ...Object.values(dateCount),
        1
    );






    DATES_DATA.forEach(date=>{


        const value =
        dateCount[date.id] || 0;



        const percent =
        Math.round(
            value/max*100
        );





        const row =
        document.createElement(
            "div"
        );



        row.className =
        "chart-row";




        row.innerHTML = `


        <div class="chart-label">

            <span class="chart-name">

            ${date.label}

            </span>


            <span class="chart-count">

            ${value}/${total}

            </span>


        </div>



        <div class="chart-bar-bg">


            <div 
            class="chart-bar"
            style="width:${percent}%">

            </div>


        </div>


        `;



        wrap.appendChild(row);



    });



}









// ============================================================
// TABLEAU PARTICIPANTS
// ============================================================


function renderTable(
    votes
){



    const tbody =
    document.getElementById(
        "participantsBody"
    );



    if(!tbody){

        return;

    }




    tbody.innerHTML =
    "";





    votes.forEach(vote=>{





        const dates =

        (vote.dates || [])

        .map(id=>{


            const d =
            DATES_DATA.find(
                x=>x.id===id
            );


            return d
            ?
            d.label
            :
            id;



        })

        .join("<br>");







        const tr =
        document.createElement(
            "tr"
        );



        tr.innerHTML = `


        <td>

        <strong>
        ${escapeHtml(vote.prenom)}
        </strong>

        </td>



        <td>

        Lac d'Orédon → Lac d'Aumar → Lac de Berseau

        </td>



        <td>

        ${dates}

        </td>



        <td>

        ${escapeHtml(vote.comment || "")}

        </td>



        <td>


        <button 
        class="btn-delete"
        onclick="removeVote('${vote.id}')">

        🗑️

        </button>


        </td>


        `;



        tbody.appendChild(tr);



    });



}









// ============================================================
// SUPPRESSION
// ============================================================


async function removeVote(id){



    if(
        !confirm(
            "Supprimer ce vote ?"
        )
    ){

        return;

    }




    await deleteVote(id);



    loadResults();



}









async function resetAll(){



    if(
        !confirm(
        "Supprimer tous les votes ?"
        )
    ){

        return;

    }




    await deleteAllVotes();



    loadResults();



}









// ============================================================
// SECURITE HTML
// ============================================================


function escapeHtml(text){


    return String(text || "")

    .replace(
        /&/g,
        "&amp;"
    )

    .replace(
        /</g,
        "&lt;"
    )

    .replace(
        />/g,
        "&gt;"
    )

    .replace(
        /"/g,
        "&quot;"
    );


}









// ============================================================
// INITIALISATION
// ============================================================


document.addEventListener(
"DOMContentLoaded",
()=>{


    setTimeout(
        loadResults,
        700
    );


    setInterval(
        loadResults,
        30000
    );


});
