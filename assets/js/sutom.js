//  dictionnaire de mot 
// let mots = [
//   'ananas',
//   'banane',
//   'bonbon',
//   'carafe',
//   'cigare',
//   'citron',
//   'courir',
//   'couvre',
//   'diable',
//   'tables'
// ];


// def des variable global 
const nbEssai = 6;
let essaiRestant = nbEssai;
let essaiAct = [];
let lettreSuivante = 0;
// choix aléatoire du mot
// let bonMot = mots[Math.floor(Math.random() * mots.length)]
let prochLettre = 0;



  const regex = RegExp (/[a-zA-Z]/gi)
  const asyncWord = async () => {
    const result = await fetch("https://trouve-mot.fr/api/size/6").then((response) => response.json()).then((words) => { return words[0].name })
    return result
  }
  // console.log(asyncWord())
  
  let bonMot = no_accent(await asyncWord());
  console.log(bonMot)



let firstLettre = bonMot[0];

function no_accent(my_string)
{
// tableau accents
        var pattern_accent = new Array(/À/g, /Á/g, /Â/g, /Ã/g, /Ä/g, /Å/g, /Æ/g, /Ç/g, /È/g, /É/g, /Ê/g, /Ë/g,
        /Ì/g, /Í/g, /Î/g, /Ï/g, /Ð/g, /Ñ/g, /Ò/g, /Ó/g, /Ô/g, /Õ/g, /Ö/g, /Ø/g, /Ù/g, /Ú/g, /Û/g, /Ü/g, /Ý/g,
        /Þ/g, /ß/g, /à/g, /á/g, /â/g, /ã/g, /ä/g, /å/g, /æ/g, /ç/g, /è/g, /é/g, /ê/g, /ë/g, /ì/g, /í/g, /î/g,
        /ï/g, /ð/g, /ñ/g, /ò/g, /ó/g, /ô/g, /õ/g, /ö/g, /ø/g, /ù/g, /ú/g, /û/g, /ü/g, /ý/g, /ý/g, /þ/g, /ÿ/g);
 
        // tableau sans accents
        var pattern_replace_accent = new Array("A","A","A","A","A","A","A","C","E","E","E","E",
        "I","I","I","I","D","N","O","O","O","O","O","O","U","U","U","U","Y",
        "b","s","a","a","a","a","a","a","a","c","e","e","e","e","i","i","i",
        "i","d","n","o","o","o","o","o","o","u","u","u","u","y","y","b","y");
 
        //pour chaque caractere si accentué le remplacer par un non accentué
        for(var i=0;i<pattern_accent.length;i++)
        {
            my_string = my_string.replace(pattern_accent[i],pattern_replace_accent[i]);
        }
        return my_string;
}

function generate_table() {
  // récupération de l'id de la div 
  var body = document.getElementById("grille");

  // création des élément <table> et <tbody>
  var tbl = document.createElement("table");
  var tblBody = document.createElement("tbody");

  // création des cellules
  for (var i = 0; i < nbEssai; i++) {

    // création des ligne
    var row = document.createElement("tr");
    row.className = "row"

    // Création des collones
    for (var j = 0; j < nbEssai; j++) {

      // 
      var lettre;
      var cell = document.createElement("td");
      cell.className = "box"
      if (j == 0) {
        lettre = document.createTextNode(firstLettre);
        prochLettre = 1
      } else {
        lettre = document.createTextNode("-");
      }
      cell.appendChild(lettre);
      row.appendChild(cell);
    }

    // add the row to the end of the table body
    tblBody.appendChild(row);
  }

  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  // appends <table> into <body>
  body.appendChild(tbl);
  // sets the border attribute of tbl to 2;
  tbl.setAttribute("border", "2");
}

// listener pour les touches 
document.addEventListener("keyup", (e) => {

  if (essaiRestant === 0) {
    return
  }

  let toucheP = String(e.key)
  if (toucheP === "Backspace" && lettreSuivante !== 0) {
    suppr()
    return
  }

  if (toucheP === "Enter") {
    checkGuess()
    return
  }

  let found = toucheP.match(/[a-z\-]/gi)
  if (!found || found.length > 1) {
    return
  } else {
    insertLettre(toucheP)
  }
})

// insertion des lettre 
function insertLettre(toucheP) {
  if (lettreSuivante === 6) {
    return
  }
  toucheP = toucheP.toLowerCase()

  let row = document.getElementsByClassName("row")[6 - essaiRestant]
  let box = row.children[lettreSuivante]
  animateCSS(box, "pulse")
  box.textContent = toucheP
  box.classList.add("filled-box")
  essaiAct.push(toucheP)
  lettreSuivante += 1
}

// suppression
function suppr() {
  let row = document.getElementsByClassName("row")[6 - essaiRestant]
  let box = row.children[lettreSuivante - 1]
  box.textContent = "-"
  box.classList.remove("filled-box")
  essaiAct.pop()
  lettreSuivante -= 1
}

// vérification des lettre et de la position
// vérification des lettre et de la position
function checkGuess() {
  let row = document.getElementsByClassName("row")[6 - essaiRestant]
  let essai = ''
  let essaiJuste = Array.from(bonMot)

  for (const val of essaiAct) {
    essai += val
  }

  if (essai.length != 6) {
    alert("Le mot n'est pas dans la liste !")
    return
  }

  for (let i = 0; i < 6; i++) {
    let colorLettre = ''
    let box = row.children[i]
    let lettre = essaiAct[i]

    let positionLettre = essaiJuste.indexOf(essaiAct[i])
    // lettre en bonne position
    if (positionLettre === -1) {
      colorLettre = 'grey'
    } else {
      // lettre dans le mot et a la bonne position
      if (essaiAct[i] === essaiJuste[i]) {
        colorLettre = 'green'
      } else {
        colorLettre = 'yellow'
      }
      essaiJuste[positionLettre] = '#'

    }

    let delay = 250 * i
    setTimeout(() => {
      animateCSS(box, 'flipInX')
      box.style.backgroundColor = colorLettre
      box.classList.add(getColorClass(colorLettre)); // Ajouter la classe correspondante
      box.style.backgroundImage = 'none'; // Supprimer l'image de fond
      clavierVirtuel(lettre, colorLettre)
    }, delay)
  }

  if (essai === bonMot) {
    alert("Vous avez trouvé le bon mot ! Bien joué !")
    essaiRestant = 0
    return
  } else {
    essaiRestant -= 1;
    essaiAct = [];
    lettreSuivante = 0;

    if (essaiRestant === 0) {
      alert("Vous avez utilisez toute vos tentative !")
      alert(`The right word was: "${rightGuessString}"`)
    }
  }
}
function getColorClass(color) {
  switch (color) {
    case 'grey':
      return 'background-grey';
    case 'green':
      return 'background-green';
    case 'yellow':
      return 'background-yellow';
    default:
      return '';
  }
}


function clavierVirtuel(lettre, color) {
  for (const elem of document.getElementsByClassName("keyboard-button")) {
    if (elem.textContent === lettre) {
      let oldColor = elem.style.backgroundColor
      if (oldColor === 'green') {
        return
      }

      if (oldColor === 'yellow' && color !== 'green') {
        return
      }
      elem.style.backgroundColor = color
      break
    }
  }
}
function reset() {
  // Supprimer la grille existante
  var grille = document.getElementById("grille");
  grille.innerHTML = "";

  // Réinitialiser les variables globales
  essaiRestant = nbEssai;
  essaiAct = [];
  lettreSuivante = 0;

  // Générer une nouvelle grille
  generate_table();
}

// Associer la fonction "reset" à un bouton HTML avec un ID "reset-button"
var resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", reset);
document.getElementById("keyboard-cont").addEventListener("click", (e) => {
  const target = e.target

  if (!target.classList.contains("keyboard-button")) {
    return
  }
  let key = target.textContent

  if (key === "Del") {
    key = "Backspace"
  }
  document.dispatchEvent(new KeyboardEvent("keyup", { 'key': key }))
})
const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '0.3s');

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, { once: true });
  });


generate_table();
