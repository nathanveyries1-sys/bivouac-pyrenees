// ============================================================
// VOTE.JS
// BIVOUAC PYRÉNÉES 2026
// Lac de Berseau
// ============================================================


let currentStep = 1;

let selectedDates = [];

const TOTAL_STEPS = 3;



// ============================================================
// NAVIGATION ENTRE LES ÉTAPES
// ============================================================


function goStep(step){


    // Validation prénom

    if(currentStep === 1 && step > 1){


        const prenom =
        document.getElementById("inputPrenom")
        .value
        .trim();



        if(!prenom){

            alert(
            "Entre ton prénom avant de continuer."
            );

            document
            .getElementById("inputPrenom")
            .focus();

            return;

        }

    }



    // Validation dates

    if(currentStep === 2 && step > 2){


        if(selectedDates.length === 0){


            alert(
            "Choisis au moins une date disponible."
            );


            return;


        }


        buildRecap();


    }




    document
    .getElementById(
        "step"+currentStep
    )
    ?.classList.remove("active");



    document
    .getElementById(
        "pstep"+currentStep
    )
    ?.classList.remove("active");



    document
    .getElementById(
        "pstep"+currentStep
    )
    ?.classList.add("done");




    currentStep = step;



    document
    .getElementById(
        "step"+currentStep
    )
    ?.classList.add("active");



    document
    .getElementById(
        "pstep"+currentStep
    )
    ?.classList.add("active");



    const percent =
    ((currentStep-1)/(TOTAL_STEPS-1))*100;



    document
    .getElementById(
        "progressFill"
    )
    .style.width =
    percent+"%";



    window.scrollTo({

        top:0,

        behavior:"smooth"

    });


}




// ============================================================
// CALENDRIER DES DATES
// ============================================================


function buildCalendar(){



const aug =
document.getElementById(
"datesGridAug"
);



const sep =
document.getElementById(
"datesGridSep"
);



if(!aug || !sep)
return;




DATES_DATA.forEach(date=>{


const button =
document.createElement(
"button"
);



button.className =
"date-btn";



button.id =
"dbtn-"+date.id;



button.innerHTML = `

<div class="date-day">
Disponibilité
</div>


<div class="date-range">
${date.label}
</div>


<div class="date-check"
id="dchk-${date.id}">
</div>

`;



button.onclick =
()=>toggleDate(date.id);



if(date.month==="aout")
{

aug.appendChild(button);

}

else
{

sep.appendChild(button);

}



});



}





function toggleDate(id){


const index =
selectedDates.indexOf(id);



const button =
document.getElementById(
"dbtn-"+id
);



const check =
document.getElementById(
"dchk-"+id
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



}




// ============================================================
// RÉCAPITULATIF
// ============================================================


function buildRecap(){



const prenom =
document
.getElementById(
"inputPrenom"
)
.value
.trim();



const dates =
selectedDates
.map(id=>{


const d =
DATES_DATA.find(
x=>x.id===id
);


return d ? d.label : id;


})
.join("<br>");




document
.getElementById(
"voteRecap"
)
.innerHTML = `


<div class="recap-row">

👤

<strong>
Prénom :
</strong>

${prenom}

</div>


<div class="recap-row">

🏔️

<strong>
Aventure :
</strong>

Bivouac Lac de Berseau

</div>



<div class="recap-row">

📅

<strong>
Dates possibles :
</strong>

<br>

${dates}

</div>


`;



}





// ============================================================
// ENVOI DU VOTE
// ============================================================


async function submitVote(){



const prenom =
document
.getElementById(
"inputPrenom"
)
.value
.trim();



const comment =
document
.getElementById(
"inputComment"
)
?.value
.trim()
|| "";




if(!prenom || selectedDates.length===0){


alert(
"Informations incomplètes."
);


return;


}




const button =
document.querySelector(
".btn-send"
);



button.disabled=true;

button.textContent =
"⏳ Enregistrement...";





try{


await saveVote({

prenom:prenom,


hikes:[
"berseau"
],


dates:selectedDates,


comment:comment



});





document
.getElementById(
"step3"
)
.classList.remove(
"active"
);



document
.getElementById(
"stepSuccess"
)
.classList.add(
"active"
);




document
.getElementById(
"progressFill"
)
.style.width =
"100%";




document
.getElementById(
"successMsg"
)
.textContent =

`Merci ${prenom} ! 
Ta disponibilité est enregistrée pour le bivouac du Lac de Berseau.`;



}

catch(error){


console.error(error);


alert(
"Erreur lors de l'enregistrement."
);


button.disabled=false;


button.textContent =
"✅ Envoyer mon vote";



}



}




// ============================================================
// RESET
// ============================================================


function resetVote(){



selectedDates=[];

currentStep=1;




document
.getElementById(
"inputPrenom"
)
.value="";



if(document.getElementById("inputComment"))
{

document.getElementById(
"inputComment"
)
.value="";

}




DATES_DATA.forEach(date=>{


document
.getElementById(
"dbtn-"+date.id
)
?.classList.remove(
"selected"
);



const check =
document.getElementById(
"dchk-"+date.id
);



if(check)
check.textContent="";



});




document
.getElementById(
"stepSuccess"
)
.classList.remove(
"active"
);



document
.getElementById(
"step1"
)
.classList.add(
"active"
);



document
.getElementById(
"progressFill"
)
.style.width="0%";




document
.querySelectorAll(
".pstep"
)
.forEach((el,i)=>{


el.classList.remove(
"active",
"done"
);



if(i===0)
el.classList.add(
"active"
);



});



}




// ============================================================
// CARTE LEAFLET
// Lac d'Orédon → Lac d'Aumar → Lac de Berseau
// ============================================================


function initMap(){



if(typeof L==="undefined")
return;



const element =
document.getElementById(
"map-berseau"
);



if(!element)
return;




const map =
L.map(
"map-berseau"
)
.setView(
[
42.835,
0.15
],
13
);





L.tileLayer(
"https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
{

attribution:
"© OpenTopoMap",

maxZoom:17

}
)
.addTo(map);






const route=[


[42.819,0.184], // Orédon


[42.831,0.176], // Aumar


[42.842,0.161], // Aubert


[42.850,0.145]  // Berseau


];





L.polyline(
route,
{

color:"#245c3a",

weight:5,

opacity:0.85

}
)
.addTo(map);






const points=[



{

pos:[42.819,0.184],

text:
"Départ — Lac d'Orédon"

},



{

pos:[42.831,0.176],

text:
"Passage — Lac d'Aumar"

},



{

pos:[42.850,0.145],

text:
"Bivouac — Lac de Berseau"

}


];





points.forEach(p=>{


L.marker(
p.pos
)
.addTo(map)
.bindPopup(
p.text
);



});




map.fitBounds(
route
);



}





// ============================================================
// INITIALISATION
// ============================================================


document.addEventListener(
"DOMContentLoaded",
()=>{


buildCalendar();


setTimeout(
initMap,
500
);



const input =
document.getElementById(
"inputPrenom"
);



if(input){


input.addEventListener(
"keydown",
e=>{


if(e.key==="Enter")
goStep(2);


}
);



}



});
